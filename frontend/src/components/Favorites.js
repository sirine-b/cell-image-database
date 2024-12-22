import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favorites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/api/favorites/${userId}`);
                setFavorites(response.data);
            } catch (err) {
                setError('Error fetching favorite images');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Favorites</h2>
            <div className="favorites-grid">
                {favorites.map((favorite) => (
                    <div key={favorite.image_id} className="favorite-item">
                        <img src={`/${favorite.filepath}`} alt={favorite.description} />
                        <p>{favorite.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
