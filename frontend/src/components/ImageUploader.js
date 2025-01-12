import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

/**
 * ImageUploader Component
 * - Allows users to upload an image along with associated metadata.
 * - Sends the image and metadata to a backend API for storage.
 */
function ImageUploader() {
    const [file, setFile] = useState(null);
    const [imageData, setImageData] = useState({
        Category: '',
        Species: '',
        Cellular_Component: '',
        Biological_Process: '',
        Shape: '',
        Imaging_Modality: '',
        Description: '',
        Licensing: '',
    });
    /**
     * Updates the `file` state when a user selects an image.
     * @param {Event} e - The file input change event
     */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    /**
     * Updates the `imageData` state when a user modifies a metadata field.
     * @param {Event} e - The input change event
     */

    const handleInputChange = (e) => {
        setImageData({
            ...imageData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handles form submission:
     * - Prepares a `FormData` object containing the image file and metadata.
     * - Sends the data to the backend API for uploading.
     * - Resets the form and provides feedback to the user.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();// Create a FormData object to handle file and metadata
        formData.append('image', file);
        Object.keys(imageData).forEach(key => {
            formData.append(key, imageData[key]);
        });

        try {
            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Image uploaded successfully');

            // Reset the file and metadata states
            setFile(null);

            // Reset the imageData state
            setImageData({
                Category: '',
                Species: '',
                Cellular_Component: '',
                Biological_Process: '',
                Shape: '',
                Imaging_Modality: '',
                Description: '',
                Licensing: '',
            });

            // Clear the file input
            document.getElementById('file-upload').value = '';

        } catch (error) {
            console.error('Upload error', error);
            alert('Upload failed');
        }
    };

    return (
        <div className="image-uploader">
            <h2>Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <div className="file-input-container">
                    <label htmlFor="file-upload" className="file-input-label" style={{color: 'white',textAlign:"center"}}>
                        Select Image
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="file-input"
                    />
                </div>

                {Object.keys(imageData).map(key => (
                    <div key={key} className="input-container">
                        <label htmlFor={key}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            id={key}
                            type={key === 'Number_Cells' ? 'number' : 'text'}
                            name={key}
                            value={imageData[key]}
                            onChange={handleInputChange}
                            required
                            className="text-input"
                        />
                    </div>
                ))}

                <button type="submit" className="submit-button">Upload Image</button>
            </form>
        </div>
    );
}

export default ImageUploader;