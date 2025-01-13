import React, { useEffect, useState } from 'react'; // Import React and hooks for managing component state
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate for accessing URL parameters
import axios from 'axios'; // Import axios for making HTTP requests
import './ImageGallery.css'; // Import the CSS file for styling this component

const SearchResults = () => {
    const [images, setImages] = useState([]); // Stores search results
    const [favorites, setFavorites] = useState([]); // Stores the user's favorite images
    const location = useLocation(); // Retrieves the current URL parameters for the search query and filter
    const navigate = useNavigate(); // Enables navigation to different pages

    useEffect(() => {
        const params = new URLSearchParams(location.search); // Extracts query and filter parameters
        const query = params.get('query');
        const filter = params.get('filter');

        const fetchData = async () => {
            try {
                // Fetch search results from the backend based on query and filter 
                const response = await axios.get(`http://localhost:5000/api/search?query=${query}&filter=${filter}`);
                setImages(response.data);

                // Fetch user's favorites images if logged in
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

    // Toggles an image's favorite status (add/remove from favorites)
    const toggleFavorite = async (imageId, isFavorite) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            if (isFavorite) {
                // Remove the image from favorites
                await axios.delete(`http://localhost:5000/api/favorites/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(favorites.filter(favId => favId !== imageId));
            } else {
                // Add the image to favorites
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
                            <p><strong>Category:</strong> {image.category}</p>
                            <p><strong>Species:</strong> {image.species}</p>
                            <p><strong>Cellular Component:</strong> {image.cellular_component}</p>
                            <p><strong>Biological Process:</strong> {image.biological_process}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
