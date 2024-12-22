const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Add this before setting up multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const multer = require('multer');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Database connection
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user' });
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
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Image upload
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const filepath = req.file.path; // Get the path of the uploaded file


        const {
            ncbiclassification,
            species,
            cellularcomponent,
            biologicalprocess,
            shape,
            imagingmod,
            description,
            licensing,
        } = req.body;

        const result = await pool.query(
            'INSERT INTO images (filepath, ncbiclassification, species, cellularcomponent, biologicalprocess, shape, imagingmod, description, licensing) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [filepath, ncbiclassification, species, cellularcomponent, biologicalprocess, shape, imagingmod, description, licensing]
        );

        res.status(201).json({ message: 'Image uploaded successfully', imageId: result.rows[0].id });
    } catch (error) {
        console.error('Upload error:', error); // Log the specific error for debugging
        res.status(500).json({ error: 'Error uploading image' });
    }
});

// Search images
app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        const result = await pool.query(`
      SELECT * FROM images 
      WHERE 
        ncbiclassification ILIKE $1 OR
        species ILIKE $1 OR
        cellularcomponent ILIKE $1 OR
        biologicalprocess ILIKE $1 OR
        shape ILIKE $1 OR
        imagingmod ILIKE $1 OR
        description ILIKE $1 OR
        licensing ILIKE $1
    `, [`%${query}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error searching images' });
    }
});


// Get all images
app.get('/api/images', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM images');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching images' });
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
                                    ncbiclassification VARCHAR(255) NOT NULL,
                                    species VARCHAR(255) NOT NULL,
                                    cellularcomponent VARCHAR(255) NOT NULL,
                                    biologicalprocess VARCHAR(255) NOT NULL,
                                    shape VARCHAR(255) NOT NULL,
                                    imagingmod VARCHAR(255) NOT NULL,
                                    description VARCHAR(255),
                                    licensing VARCHAR(255),
                                    numbercells INTEGER 
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
        res.status(200).json({ message: 'Database tables reinitialised successfully' });
    } catch (error) {
        console.error('Error reinitialising database tables:', error);
        res.status(500).json({ error: 'Error reinitialising database tables' });
    }
});

// Display image details by ID
app.get('/api/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching image details' });
    }
});
//
// app.get('/api/user', async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const result = await pool.query('SELECT username FROM users WHERE id = $1', [decoded.id]);
//         if (result.rows.length > 0) {
//             res.json({ username: result.rows[0].username });
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// });

// app.get('/api/verify-token', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ error: 'No token provided' });
//     }
//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const result = await pool.query('SELECT username FROM users WHERE id = $1', [decoded.id]);
//         if (result.rows.length > 0) {
//             res.json({ username: result.rows[0].username });
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// });

// Add image to favorites
app.post('/api/favorites', async (req, res) => {
    const { user_id, image_id } = req.body;

    try {
        await pool.query(
            'INSERT INTO favorites (user_id, image_id) VALUES ($1, $2)',
            [user_id, image_id]
        );
        res.status(201).send('Image added to favorites');
    } catch (error) {
        console.error('Error adding image to favorites:', error);
        res.status(500).send('Server error');
    }
});

// Get user's favorite images
app.get('/api/favorites/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT images.image_id, images.filepath, metadata.*
            FROM favorites
            JOIN images ON favorites.image_ =id images.image_id
            JOIN metadata ON images.image_id = metadata.image_id
            WHERE favorites.user_id = $1`,
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching favorite images:', error);
        res.status(500).send('Server error');
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
