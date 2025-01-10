import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImageGallery.css';

const SearchResults = () => {
    const [images, setImages] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        const filter = params.get('filter');

        const fetchData = async () => {
            try {
                // Fetch search results
                const response = await axios.get(`http://localhost:5000/api/search?query=${query}&filter=${filter}`);
                setImages(response.data);

                // Fetch user's favorites
                const token = localStorage.getItem('token');
                if (token) {
                    const favoritesResponse = await axios.get('http://localhost:5000/api/favorites', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFavorites(favoritesResponse.data.map(fav => fav.id));
                }
            } catch (error) {
                console.error('Error fetching search results or favorites:', error);
            }
        };

        fetchData();
    }, [location.search]);

    const toggleFavorite = async (imageId, isFavorite) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            if (isFavorite) {
                // Remove from favorites
                await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(favorites.filter(favId => favId !== imageId));
            } else {
                // Add to favorites
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
        <div className="image-gallery">
            <header className="header">
                <button className="gallery-button" onClick={() => navigate('/')}>Image Gallery</button>
                <button className="favorites-button" onClick={() => navigate('/favorites')}>Favorites</button>
            </header>
            <div className="title-container">
                <h2>Search Results</h2>
            </div>
            <div className="images">
                {images.map((image) => (
                    <div key={image.id} className="image-item">
                        <img
                            src={`http://localhost:5000/${image.filepath}`}
                            alt={image.filename}
                            onClick={() => navigate(`/image/${image.id}`)}
                        />
                        <div
                            className={`favorite-icon ${favorites.includes(image.id) ? 'favorite' : ''}`}
                            onClick={() => toggleFavorite(image.id, favorites.includes(image.id))}
                        >
                            ❤️
                        </div>
                        <div className="overlay">
                            <p><strong>NCBI Classification:</strong> {image.ncbiclassification}</p>
                            <p><strong>Species:</strong> {image.species}</p>
                            <p><strong>Cellular Component:</strong> {image.cellularcomponent}</p>
                            <p><strong>Biological Process:</strong> {image.biologicalprocess}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
