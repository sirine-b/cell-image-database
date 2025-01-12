import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImageGallery.css';

// FavoritesPage component handles displaying the user's favorite images and allowing interactions with them.
const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]); // Stores the list of favorite images.
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Fetches the user's favorite images from the server.
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
            // Deletes the selected favorite image from the server and updates the local state.
            await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(favorites.filter(image => image.id !== imageId));
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    const handleImageClick = (imageId) => {
        // Navigates to the image detail of the clicked image.
        navigate(`/image/${imageId}`);
    };

    return (
        <div className="image-gallery">
            <div className="title-container">
                <h2>Your Favorites</h2> {/* Displays the page title */}
            </div>
            <div className="images">
                {favorites.length > 0 ? (
                    favorites.map((image) => (
                        <div key={image.id} className="image-item">
                            <img
                                src={`http://localhost:5000/${image.filepath}`}
                                alt={image.filename}
                                onClick={() => handleImageClick(image.id)}
                            /> {/* Displays each favorite image */}
                            <button
                                className="delete-favorite-button"
                                onClick={() => handleDeleteFavorite(image.id)}
                            >
                                Remove
                            </button> {/* Button to remove the image from favorites */}
                            <div className="overlay">
                                <p><strong>Category:</strong> {image.category}</p>
                                <p><strong>Species:</strong> {image.species}</p>
                                <p><strong>Cellular Component:</strong> {image.cellular_component}</p>
                                <p><strong>Biological Process:</strong> {image.biological_process}</p>
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
