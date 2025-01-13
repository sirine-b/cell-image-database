import React, { useEffect, useState } from 'react'; // Import React and hooks for component logic and state management
import { useParams } from 'react-router-dom'; // Import useParams for accessing URL parameters
import axios from 'axios'; // Import axios for making HTTP requests
import './ImageDetails.css'; // Import the CSS file for styling this component

// The ImageDetails component is used to display detailed information about a specific image
function ImageDetails() {
    const { id } = useParams(); // Get the image ID from URL parameters
    const [imageData, setImageData] = useState(null); // Stores the image details fetched from the server

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                // Fetches the image details from the backend using the image ID
                console.log('Fetching image details for ID:', id);
                const response = await axios.get(`http://localhost:5000/api/images/${id}`);
                console.log('Received image data:', response.data);
                setImageData(response.data); // Sets the fetched image data to state
            } catch (error) {
                console.error('Error fetching image details:', error);
            }
        };

        fetchImageDetails(); // Calls the function to fetch image details when the component loads
    }, [id]);

    if (!imageData) return <div className="loading">Loading...</div>; // Displays a loading message until the data is fetched

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
                <p><span className="metadata-label">Number of Cells:</span> {imageData.number_cells}</p>
                <p><span className="metadata-label">Imaging Modality:</span> {imageData.imaging_modality}</p>
                <p><span className="metadata-label">Description:</span> {imageData.description}</p>
                <p><span className="metadata-label">DOI:</span> {imageData.doi}</p>
            </div>
        </div>
    );
}

export default ImageDetails;