import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImageGallery.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:5000/api/favorites', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    const handleDeleteFavorite = async (imageId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(favorites.filter(image => image.id !== imageId)); // Remove image locally
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    return (
        <div className="image-gallery">
            <header className="header">
                <button className="gallery-button" onClick={() => navigate('/')}>Image Gallery</button>
            </header>
            <div className="title-container">
                <h2>Your Favorites</h2>
            </div>
            <div className="images">
                {favorites.length > 0 ? (
                    favorites.map((image) => (
                        <div key={image.id} className="image-item">
                            <img src={`http://localhost:5000/${image.filepath}`} alt={image.filename}/>
                            <button
                                className="delete-favorite-button"
                                onClick={() => handleDeleteFavorite(image.id)}
                            >
                                Remove
                            </button>
                            <div className="overlay">
                                <p><strong>NCBI Classification:</strong> {image.ncbiclassification}</p>
                                <p><strong>Species:</strong> {image.species}</p>
                                <p><strong>Cellular Component:</strong> {image.cellularcomponent}</p>
                                <p><strong>Biological Process:</strong> {image.biologicalprocess}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No favorites yet.</p>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
