import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ImageDetails.css';

function ImageDetails() {
    const { id } = useParams(); // Get the image ID from URL parameters
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                console.log('Fetching image details for ID:', id);
                const response = await axios.get(`http://localhost:5000/api/images/${id}`);
                console.log('Received image data:', response.data);
                setImageData(response.data);
            } catch (error) {
                console.error('Error fetching image details:', error);
            }
        };

        fetchImageDetails();
    }, [id]);

    if (!imageData) return <div className="loading">Loading...</div>;

    return (
        <div className="image-details-container">

            <img className="image-display" src={`http://localhost:5000/${imageData.filepath}`} alt={imageData.filename} />

            <div className="image-metadata">
                <p><span className="metadata-label">Category:</span> {imageData.category}</p>
                <p><span className="metadata-label">Species:</span> {imageData.species}</p>
                <p><span className="metadata-label">Cellular Component:</span> {imageData.cellular_component}</p>
                <p><span className="metadata-label">Biological Process:</span> {imageData.biological_process}</p>
                <p><span className="metadata-label">Shape:</span> {imageData.shape}</p>
                <p><span className="metadata-label">Imaging Modality:</span> {imageData.imaging_modality}</p>
                <p><span className="metadata-label">Description:</span> {imageData.description}</p>
                <p><span className="metadata-label">Licensing:</span> {imageData.licensing}</p>
            </div>
        </div>
    );
}

export default ImageDetails;