import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './ImageGallery.css';
import './MainPage.css';

function ImageGallery() {
// State variables to store images, user data, and favorite images
    const [images, setImages] = useState([]); // Store the list of images fetched from the server
    const [user, setUser] = useState(null); // Store the currently logged-in user's information
    const [favorites, setFavorites] = useState([]); // Store the IDs of images marked as favorites
    const navigate = useNavigate(); // Hook for navigation between pages

    /**
     * Fetches images and user data when the component mounts
     * - Fetches all images from the backend and updates the `images` state.
     * - If the user is logged in (based on a token in localStorage), fetches user details and their favorite images.
     */
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/images');
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:5000/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data);
                    const favoritesResponse = await axios.get('http://localhost:5000/api/favorites', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFavorites(favoritesResponse.data.map(fav => fav.id)); // Extract and store favorite image ID
                }
            } catch (error) {
                console.error('Error fetching user or favorites:', error); // Catch errors
                setUser(null);
            }
        };

        fetchImages();
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/'); // Navigate back to homepage
    };

    const handleImageClick = (imageId) => {
        navigate(`/image/${imageId}`);
    };

    /**
     * Adds or removes an image from the user's favorites:
     * - If already a favorite, removes it from favorites.
     * - Otherwise, adds it to the favorites.
     * @param {number} imageId - The ID of the image to toggle.
     * @param {boolean} isFavorite - Whether the image is already a favorite.
     */

    const toggleFavorite = async (imageId, isFavorite) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            if (isFavorite) {// Remove from favorites
                await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(favorites.filter(favId => favId !== imageId));
            } else {
                await axios.post(// Add to favorites
                    'http://localhost:5000/api/favorites',
                    { imageId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavorites([...favorites, imageId]); // Update state of upload
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div className="main-container">
            <div className="title-container">
                <h2>Image Gallery</h2>
                {user && <span className="user-greeting">Hello, {user.username}</span>}
            </div>

            <div className="button-container">
                {user ? (
                    <>
                        <button className="nav-button" onClick={() => navigate('/upload')}>Upload </button>
                        <button className="nav-button" onClick={() => navigate('/cellpose')}>Count Cells</button>
                        <button className="nav-button" onClick={() => navigate('/favorites')}>Favorites</button>
                        <button className="nav-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-button">Login</Link>
                        <Link to="/register" className="nav-button">Register</Link>
                        <Link to="/upload" className="nav-button">Upload</Link>
                        <Link to="/cellpose" className="nav-button">Count Cells</Link>
                    </>
                )}
            </div>
            <div className="image-gallery">
                <div className="images">
                    {images.map((image) => (
                        <div key={image.id} className="image-item">
                            <img
                                src={`http://localhost:5000/${image.filepath}`}
                                alt={image.filename}
                                onClick={() => handleImageClick(image.id)}
                            />
                            <div
                                className={`favorite-icon ${favorites.includes(image.id) ? 'favorite' : ''}`}
                                onClick={() => toggleFavorite(image.id, favorites.includes(image.id))}
                            >
                                ❤️
                            </div>
                            <div className="overlay">
                                <p><strong>Category:</strong> {image.category}</p>
                                <p><strong>Species:</strong> {image.species}</p>
                                <p><strong>Cellular Component:</strong> {image.cellular_component}</p>
                                <p><strong>Biological Process:</strong> {image.biological_process}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ImageGallery;
