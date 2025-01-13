const express = require('express'); // Core server framework
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const { Pool } = require('pg'); // PostgreSQL database connection
const bcrypt = require('bcrypt'); // Password hashing
const jwt = require('jsonwebtoken'); // JSON web Token for authentication
const fs = require('fs'); // File system module
const path = require('path'); // File and directory path utilities
// add this for cell counting model
const { spawn } = require('child_process');  // Running sub-processes
const { exec } = require('child_process');

// Setup for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir); // Ensure the upload directory exists
}
const multer = require('multer'); // File upload middleware

// Initialize the server
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static('uploads')); // Serve static files from the upload directory

// Database connection setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user' });  // Send an error response
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token });
                res.status(200)
            } else {
                res.status(400).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });  // Send an error response
    }
});

// Route to launch Cellpose GUI and process the results
app.get('/cellpose', (req, res) => {
    // For Windows Users
    const activateEnvCommand = `${path.join(__dirname, 'cellpose', 'Scripts', 'activate.bat')}`;
    const cellposeCommand = `${activateEnvCommand} && python -m cellpose`;
    const outputDir = path.join(__dirname, 'output'); // Set the directory where Cellpose saves results
    // For Mac Users (comment the above 3 lines and comment out the 3 lines below)
    // const activateEnvCommand = `source ${path.join(__dirname, 'cellpose', 'bin', 'activate')}`;
    // const cellposeCommand = `${activateEnvCommand} && python -m cellpose`;
    // const outputDir = path.join(__dirname, 'output'); // Set the directory where Cellpose saves results

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir); // Ensure output directory exists
    }

    // Launch Cellpose GUI
    exec(cellposeCommand, { shell: 'cmd.exe' }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error launching Cellpose:', error);
            res.status(500).json({ error: 'Failed to launch Cellpose GUI', details: stderr });
            return;
        }

        console.log('Cellpose GUI launched successfully. Waiting for it to close...');
        res.status(200).json({ message: 'Cellpose GUI launched successfully' });

        // Monitor for the saved seg.npy file
        const filePath = path.join(outputDir, 'seg.npy');
        const interval = setInterval(() => {
            if (fs.existsSync(filePath)) {
                clearInterval(interval);
                console.log('seg.npy file detected:', filePath);

                // Count the number of cells using a Python script
                const pythonScript = path.join(__dirname, 'count_cells.py');
                const pythonProcess = spawn('python3', [pythonScript, filePath]);

                pythonProcess.stdout.on('data', (data) => {
                    console.log('Python script output:', data.toString());
                    // Optionally, send the data to a client if needed
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error('Error in Python script:', data.toString());
                });

                pythonProcess.on('close', (code) => {
                    console.log(`Python script exited with code ${code}`);
                });
            }
        }, 1000); // Check every second
    });
});

// Image upload and Cellpose processing
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' }); // Return an error if no file is uploaded
        }
        const filePath = path.normalize(req.file.path); // Normalize file path for consistency
        const {
            Category,
            Species,
            Cellular_Component,
            Biological_Process,
            Shape,
            Imaging_Modality,
            Description,
            DOI,
        } = req.body; // Extract metadata from the request body

        // Insert the uploaded image and its metadata into the database
        const result = await pool.query(
            'INSERT INTO images (filepath, Category, Species, Cellular_Component, Biological_Process, Shape, Imaging_Modality,Description, DOI) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [filePath, Category, Species, Cellular_Component, Biological_Process, Shape, Imaging_Modality,Description,DOI]
        );
        const imageId = result.rows[0].id; // Retrieve the generated ID of the new database entry

        // Run Cellpose on the uploaded image
        // For Windows Users:
        const activateEnvCommand = `${path.join(__dirname, 'cellpose', 'Scripts', 'activate.bat')}`;
        const cellposeCommand = `${activateEnvCommand} && python -m cellpose --image ${filePath} --diameter 0 --verbose`;
        const cellposeProcess = spawn('cmd.exe', ['/c', cellposeCommand]);

        //For Mac Users, please comment the above 3 lines and comment out the 3 lines below
        // const activateEnvCommand = `source ${path.join(__dirname, 'cellpose', 'bin', 'activate')}`;
        // const cellposeCommand = `${activateEnvCommand} && python3 -m cellpose --image ${filePath} --diameter 0 --verbose`;
        // const cellposeProcess = spawn('/bin/bash', ['-c', cellposeCommand]);

        cellposeProcess.stdout.on('data', (data) => {
            console.log('Cellpose output:', data.toString());
        });

        cellposeProcess.stderr.on('data', (data) => {
            console.error('Cellpose error:', data.toString());
        });

        cellposeProcess.on('close', async (code) => {
            console.log(`Cellpose process exited with code: ${code}`);

            if (code === 0) {
                // Locate the seg.npy file
                const npyPath = filePath.replace(/\.jpg$/, '_seg.npy');
                console.log('npyPath:', npyPath)

                // Run the Python cell counting script
                const pythonProcess = spawn('python3', [path.join(__dirname, 'count_cells.py'), npyPath]);

                let pythonOutput = ''; // Define pythonOutput to accumulate data from the Python process

                pythonProcess.stdout.on('data', (data) => {
                    pythonOutput += data.toString();
                    console.log('Python script output chunk:', data.toString());
                });

                // Handle Python script errors (stderr)
                pythonProcess.stderr.on('data', (data) => {
                    console.error('Python script error:', data.toString()); // Log errors correctly
                });

                pythonProcess.on('close', async (pyCode) => {
                    if (pyCode === 0) {
                        console.log('Cell counting completed successfully.');

                        // Ensure pythonOutput was captured
                        console.log('Full Python output:', pythonOutput);
                        const cellCountMatch = pythonOutput.match(/with (\d+) cells\./);
                        if (cellCountMatch) {
                            const cellCount = parseInt(cellCountMatch[1], 10);

                            // Update the database with the cell count
                            await pool.query(
                                'UPDATE images SET number_cells = $1 WHERE id = $2',
                                [cellCount, imageId]
                            );

                            console.log(`Database updated with cell count: ${cellCount}`);
                            res.status(201).json({
                                message: 'Image uploaded and processed successfully',
                                imageId,
                                cellCount,
                            });
                        } else {
                            console.error('Failed to parse cell count from script output.');
                            res.status(500).json({ error: 'Failed to process cell count.' });
                        }
                    } else {
                        console.error('Error in cell counting process.');
                        res.status(500).json({ error: 'Cell counting process failed.' });
                    }
                });

            } else {
                console.error('Error in Cellpose process.');
                res.status(500).json({ error: 'Cellpose process failed.' });
            }
        });
    } catch (error) {
        console.error('Upload error:', error); // Log the specific error for debugging
        res.status(500).json({ error: 'Error uploading image' }); // Send an error response
    }
});

// Search images
app.get('/api/search', async (req, res) => {
    try {
        // Extract the search query from the request parameters
        const { query } = req.query;

        // Perform a database query to search for images matching the query
        const result = await pool.query(`
            SELECT * FROM images
            WHERE
                Category ILIKE $1 OR
                Species ILIKE $1 OR
                Cellular_Component ILIKE $1 OR
                Biological_Process ILIKE $1 OR
                Shape ILIKE $1 OR
                Imaging_Modality ILIKE $1 OR
                Description ILIKE $1 OR
                DOI ILIKE $1
        `, [`%${query}%`]);

        // Send the matching images as the response
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error searching images' });  // Send an error response
    }
});

// Get all images
app.get('/api/images', async (req, res) => {
    try {
        // Query the database to retrieve all rows from the "images" table
        const result = await pool.query('SELECT * FROM images');
        res.json(result.rows); // Return all images
    } catch (error) {
        res.status(500).json({ error: 'Error fetching images' });  // Send an error response
    }
});


app.post('/api/reinitialisetables', async (req, res) => {
    try {
        // Drop the users, images, and favorites tables if they exist
        await pool.query('DROP TABLE IF EXISTS favorites');
        await pool.query('DROP TABLE IF EXISTS images');
        await pool.query('DROP TABLE IF EXISTS users');

        // Recreate the users table
        await pool.query(`
            CREATE TABLE users (
                                   id SERIAL PRIMARY KEY,
                                   username VARCHAR(255) UNIQUE NOT NULL,
                                   password VARCHAR(255) NOT NULL
            )
        `);

        // Recreate the images table
        await pool.query(`
            CREATE TABLE images (
                                    id SERIAL PRIMARY KEY,
                                    filepath VARCHAR(255) NOT NULL,
                                    Category VARCHAR(255) NOT NULL,
                                    Species VARCHAR(255) NOT NULL,
                                    Cellular_Component VARCHAR(255) NOT NULL,
                                    Biological_Process VARCHAR(255) NOT NULL,
                                    Shape VARCHAR(255) NOT NULL,
                                    Imaging_Modality VARCHAR(255) NOT NULL,
                                    Description VARCHAR(255),
                                    DOI VARCHAR(255),
                                    Number_Cells INTEGER
            )
        `);

        // Recreate the favorites table
        await pool.query(`
            CREATE TABLE favorites (
                                       id SERIAL PRIMARY KEY,
                                       user_id INTEGER REFERENCES users(id),
                                       image_id INTEGER REFERENCES images(id)
            )
        `);

        // Respond with a success message
        res.status(200).json({ message: 'Database tables reinitialised successfully' });
    } catch (error) {
        console.error('Error reinitialising database tables:', error);
        res.status(500).json({ error: 'Error reinitialising database tables' });  // Send an error response
    }
});

// Display image details by ID
app.get('/api/images/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the image ID from the request parameters
        const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]); // Query the database for the image with the given ID

        if (result.rows.length > 0) {
            // If the image is found, send it in the response
            res.json(result.rows[0]);
        } else {
            // If no image is found, send a 404 error
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching image details' }); // Send an error response
    }
});

app.get('/api/user', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the JWT token from the request headers
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify and decode the token
        const result = await pool.query('SELECT username FROM users WHERE id = $1', [decoded.id]); // Query the database for the user with the decoded ID

        if (result.rows.length > 0) {
            // If the user is found, send the username in the response
            res.json({ username: result.rows[0].username });
        } else {
            // If no user is found, send a 404 error
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' }); // Handle error
    }
});

/////////////////ADDITION////////////////////
// Fetch favorites for a user
app.get('/api/favorites', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the JWT token from the request headers
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify and decode the token to identify the user
        const result = await pool.query(`
            SELECT images.* FROM favorites
                                     JOIN images ON favorites.image_id = images.id
            WHERE favorites.user_id = $1
        `, [decoded.id]);
        res.json(result.rows); // Return the list of favorite images
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' }); // Send an error response
    }
});

// Add to favorites
app.post('/api/favorites', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the JWT token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify and decode the token
        const { imageId } = req.body; // Get the image ID from the request body

        await pool.query('INSERT INTO favorites (user_id, image_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [decoded.id, imageId]);
        res.status(201).json({ message: 'Image added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Error adding to favorites' }); // Send an error response
    }
});

// Remove from favorites
app.delete('/api/favorites/:imageId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the JWT token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify and decode the token
        const { imageId } = req.params; // Get the image ID from the request parameters

        await pool.query('DELETE FROM favorites WHERE user_id = $1 AND image_id = $2', [decoded.id, imageId]);
        res.status(200).json({ message: 'Image removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Error removing from favorites' }); // Send an error response
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Export app module for unit tests
module.exports=app;