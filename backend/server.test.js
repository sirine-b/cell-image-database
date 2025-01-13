const request = require('supertest');
const app = require('./server');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Mock the database connection pool
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();


// Testing Regirstering User
describe('POST /api/register', () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    it('should register a new user', async () => {
        // First query checks if user exists (should return empty)
        // Second query inserts the user
        pool.query
            .mockImplementationOnce(() => Promise.resolve({ rows: [] }))
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ id: 1 }] }));

        const res = await request(app)
            .post('/api/register')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('should handle registration errors', async () => {
        // Mock a database error during user check
        pool.query
            .mockImplementationOnce(() => Promise.reject(new Error('Database error')));

        const res = await request(app)
            .post('/api/register')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Error registering user');
    });
});

// Testing Logging In
describe('POST /api/login', () => {
    it('should return a token if credentials are correct', async () => {
        const mockUser = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10) };
        pool.query.mockResolvedValue({ rows: [mockUser] });
        const loginDetails = { username: 'testuser', password: 'testpassword' };

        const res = await request(app)
            .post('/api/login')
            .send(loginDetails);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 400 if credentials are incorrect', async () => {
        const mockUser = { id: 1, username: 'testuser', password: await bcrypt.hash('wrongpassword', 10) };
        pool.query.mockResolvedValue({ rows: [mockUser] });
        const loginDetails = { username: 'testuser', password: 'testpassword' };

        const res = await request(app)
            .post('/api/login')
            .send(loginDetails);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 if user is not found', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const loginDetails = { username: 'nonexistentuser', password: 'testpassword' };

        const res = await request(app)
            .post('/api/login')
            .send(loginDetails);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 500 if there is an error logging in', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));
        const loginDetails = { username: 'testuser', password: 'testpassword' };

        const res = await request(app)
            .post('/api/login')
            .send(loginDetails);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error logging in');
    });
});

// Testing Uploading Image
describe('POST /api/upload', () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    it('should upload an image successfully', async () => {
        // Create a test image buffer
        const imageBuffer = Buffer.from('fake image content');

        // Mock successful database query for image upload
        pool.query.mockImplementationOnce(() =>
            Promise.resolve({ rows: [{ id: 1 }] })
        );

        const res = await request(app)
            .post('/api/upload')
            .attach('image', imageBuffer, {
                filename: 'backend/uploads/1734306474380-onion image.jpeg',
                contentType: 'image/jpeg'
            })
            .field('category', 'test category')
            .field('species', 'test species')
            .field('cellular_component', 'test component')
            .field('biological_process', 'test process')
            .field('shape', 'test shape')
            .field('imaging_modality', 'test mod')
            .field('description', 'test description')
            .field('licensing', 'test license');

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Image uploaded successfully');
        expect(res.body.imageId).toBeDefined();
    });

    it('should handle no file uploaded', async () => {
        const res = await request(app)
            .post('/api/upload')
            .field('category', 'test category')
            .field('species', 'test species')
            .field('cellular_component', 'test component')
            .field('biological_process', 'test process')
            .field('shape', 'test shape')
            .field('imaging_modality', 'test mod')
            .field('description', 'test description')
            .field('licensing', 'test license');


        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('No file uploaded');
    });
});

//Testing returning Search Results
describe('GET /api/search', () => {
    it('should return search results for images', async () => {
        const mockImages = [
            { id: 1, category: 'Test Category', species: 'Test Species' },
            { id: 2, category: 'Another Category', species: 'Another Species' }
        ];

        pool.query.mockResolvedValue({ rows: mockImages });

        const res = await request(app)
            .get('/api/search')
            .query({ query: 'Test' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockImages);
    });

    it('should handle errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .get('/api/search')
            .query({ query: 'Test' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error searching images');
    });
});

// Testing Returning Image
describe('GET /api/images', () => {
    it('should return all images', async () => {
        const mockImages = [
            { id: 1, category: 'Test Category', species: 'Test Species' },
            { id: 2, category: 'Another Category', species: 'Another Species' }
        ];

        pool.query.mockResolvedValue({ rows: mockImages });

        const res = await request(app)
            .get('/api/images');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockImages);
    });

    it('should handle errors', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .get('/api/images');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error fetching images');
    });
});

// Testing Adding User
describe('GET /api/user', () => {
    it('should return the username of the authenticated user', async () => {
        const mockUser = { id: 1, username: 'testuser' };
        const token = jwt.sign({ id: mockUser.id }, 'your_jwt_secret');

        pool.query.mockResolvedValue({ rows: [{ username: mockUser.username }] });

        const res = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ username: mockUser.username });
    });

    it('should return 404 if user is not found', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');

        pool.query.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 if token is invalid', async () => {
        const res = await request(app)
            .get('/api/user')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
});

// Testing Returning Favorites
describe('GET /api/favorites', () => {
    it('should return the favorite images of the authenticated user', async () => {
        const mockFavorites = [
            { id: 1, category: 'Test Category', species: 'Test Species' },
            { id: 2, category: 'Another Category', species: 'Another Species' }
        ];
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');

        pool.query.mockResolvedValue({ rows: mockFavorites });

        const res = await request(app)
            .get('/api/favorites')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockFavorites);
    });

    it('should return 500 if there is an error fetching favorites', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');

        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .get('/api/favorites')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error fetching favorites');
    });
});

// Testing Adding to Favorites
describe('POST /api/favorites', () => {
    it('should add an image to favorites for the authenticated user', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');
        const imageId = 123;

        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/api/favorites')
            .set('Authorization', `Bearer ${token}`)
            .send({ imageId });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Image added to favorites');
    });

    it('should return 500 if there is an error adding to favorites', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');
        const imageId = 123;

        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .post('/api/favorites')
            .set('Authorization', `Bearer ${token}`)
            .send({ imageId });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error adding to favorites');
    });
});

describe('DELETE /api/favorites/:imageId', () => {
    it('should remove an image from favorites for the authenticated user', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');
        const imageId = 123;

        pool.query.mockResolvedValue({});

        const res = await request(app)
            .delete(`/api/favorites/${imageId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Image removed from favorites');
    });

    it('should return 500 if there is an error removing from favorites', async () => {
        const token = jwt.sign({ id: 1 }, 'your_jwt_secret');
        const imageId = 123;

        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .delete(`/api/favorites/${imageId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error removing from favorites');
    });
});

describe('POST /api/reinitialisetables', () => {
    it('should reinitialise the database tables successfully', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/api/reinitialisetables')
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Database tables reinitialised successfully');
    });

    it('should return 500 if there is an error reinitialising the tables', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .post('/api/reinitialisetables')
            .send();

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Error reinitialising database tables');
    });
});