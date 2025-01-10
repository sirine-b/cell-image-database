import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setImageData({
            ...imageData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);
        Object.keys(imageData).forEach(key => {
            formData.append(key, imageData[key]);
        });

        try {
            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Image uploaded successfully');
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
