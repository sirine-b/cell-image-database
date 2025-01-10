import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './ImageGallery.css';
import './MainPage.css';

function ImageGallery() {
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

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
                    setFavorites(favoritesResponse.data.map(fav => fav.id));
                }
            } catch (error) {
                console.error('Error fetching user or favorites:', error);
                setUser(null);
            }
        };

        fetchImages();
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const handleImageClick = (imageId) => {
        navigate(`/image/${imageId}`);
    };

    const toggleFavorite = async (imageId, isFavorite) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(favorites.filter(favId => favId !== imageId));
            } else {
                await axios.post(
                    'http://localhost:5000/api/favorites',
                    { imageId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavorites([...favorites, imageId]);
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
                        <button className="nav-button" onClick={() => navigate('/upload')}>Upload</button>
                        <button className="nav-button" onClick={() => navigate('/favorites')}>Favorites</button>
                        <button className="nav-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-button">Login</Link>
                        <Link to="/register" className="nav-button">Register</Link>
                        <Link to="/upload" className="nav-button">Upload</Link>
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
                                <p><strong>NCBI:</strong> {image.ncbiclassification}</p>
                                <p><strong>Species:</strong> {image.species}</p>
                                <p><strong>Component:</strong> {image.cellularcomponent}</p>
                                <p><strong>Process:</strong> {image.biologicalprocess}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ImageGallery;
