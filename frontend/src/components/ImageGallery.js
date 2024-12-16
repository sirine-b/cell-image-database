import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ImageGallery.css'; // Import your CSS file

function ImageGallery() {
    const [images, setImages] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/images');
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = (imageId) => {
        // Navigate to the image detail page with the image ID
        navigate(`/image/${imageId}`);
    };

    return (
        <div className="image-gallery">
            <h2>Image Gallery</h2>
            <div className="images">
                {images.map((image) => (
                    <div key={image.id} className="image-item" style={{ position: 'relative' }}>
                        <img
                            src={`http://localhost:5000/${image.filepath}`}
                            alt={image.filename}
                            style={{ width: '20%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => handleImageClick(image.id)} // Handle click event
                        />
                        {/* Hover effect for displaying metadata */}
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
    );
}

export default ImageGallery;
