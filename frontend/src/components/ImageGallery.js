import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './ImageGallery.css';

function ImageGallery() {
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);
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

        // get user data
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchImages();
        fetchUser();
    }, []);

    const handleImageClick = (imageId) => {
        navigate(`/image/${imageId}`);
    };

    return (
        <div>
            <header>
                {user ? (
                    <div>
                        <span>Hello, {user.username}</span>
                        <Link to="/favourites">Favourites</Link>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </header>
            <div className="image-gallery">
                <h2>Image Gallery</h2>
                <div className="images">
                    {images.map((image) => (
                        <div key={image.id} className="image-item" style={{ position: 'relative' }}>
                            <img
                                src={`http://localhost:5000/${image.filepath}`}
                                alt={image.filename}
                                    style={{ width: '20%', height: 'auto', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(image.id)}
                                    />
                                    <div className="overlay">
                                    <p><strong>NBCI Classification:</strong> {image.ncbiclassification}</p>
                        <p><strong>Species:</strong> {image.species}</p>
                <p><strong>Cellular Component:</strong> {image.cellularcomponent}</p>
                <p><strong>Biological Process:</strong> {image.biologicalprocess}</p>
            </div>
        </div>
    ))}
</div>
</div>
</div>
);
}

export default ImageGallery;