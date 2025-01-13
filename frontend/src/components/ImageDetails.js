import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ImageDetails.css';

// The ImageDetails component is used to display detailed information about a specific image.
function ImageDetails() {
    const { id } = useParams(); // Extracts the image ID from the URL parameters.
    const [imageData, setImageData] = useState(null); // Stores the image details fetched from the server.

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                // Fetches the image details from the backend using the image ID.
                const response = await axios.get(`http://localhost:5000/api/images/${id}`);
                setImageData(response.data); // Sets the fetched image data to state.
            } catch (error) {
                console.error('Error fetching image details:', error); // Logs any errors.
            }
        };

        fetchImageDetails(); // Calls the function to fetch image details when the component loads.
    }, [id]);

    if (!imageData) return <div className="loading">Loading...</div>; // Displays a loading message until the data is fetched.

    return (
        <div className="image-details-container">
            <img className="image-display" src={`http://localhost:5000/${imageData.filepath}`} alt={imageData.filename} />
            {/* Displays the image */}

            <div className="image-metadata">
                {/* Displays metadata about the image, such as category, species, and description */}
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
