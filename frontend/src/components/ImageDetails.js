import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

    if (!imageData) return <div>Loading...</div>;

    return (
        <div>
            <h2>{imageData.filename}</h2>
            <img src={`http://localhost:5000/${imageData.filepath}`} alt={imageData.filename}/>
            <p><strong>NBCI Classification:</strong> {imageData.ncbiclassification}</p>
            <p><strong>Species:</strong> {imageData.species}</p>
            <p><strong>Cellular Component:</strong> {imageData.cellularcomponent}</p>
            <p><strong>Biological Process:</strong> {imageData.biologicalprocess}</p>
            <p><strong>Shape:</strong> {imageData.shape}</p>
            {/*<p><strong>Number of Cells:</strong> {imageData.numbercells}</p>*/}
            <p><strong>Imaging Modality:</strong> {imageData.imagingmod}</p>
            <p><strong>Description:</strong> {imageData.description}</p>
            <p><strong>Licencing: </strong> {imageData.licensing}</p>
            {/* Add more metadata fields as necessary */}
        </div>
    );
}

export default ImageDetails;
