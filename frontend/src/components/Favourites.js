import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Favourites() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/favourites');
                setFavourites(response.data);
            } catch (error) {
                console.error('Error fetching favourites:', error);
            }
        };

        fetchFavourites();
    }, []);

    return (
        <div>
            <h2>Your Favourites</h2>
            <div className="favourites-gallery">
                {favourites.map((image) => (
                    <div key={image.id} className="image-card">
                        <img src={`http://localhost:5000/${image.filepath}`} alt={image.filename} />
                        <p>{image.filename}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favourites;