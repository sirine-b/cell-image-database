import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';  // Add this line

function ImageUploader() {
    const [file, setFile] = useState(null);
    const [imageData, setImageData] = useState({
        ncbiclassification: '',
        species: '',
        cellularcomponent: '',
        biologicalprocess: '',
        shape: '',
        imagingmod: '',
        description: '',
        licensing: '',
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
                <div>
                    <label htmlFor="file-upload">Select Image:</label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                </div>

                {Object.keys(imageData).map(key => (
                    <div key={key}>
                        <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input
                            id={key}
                            type={key === 'numbercells' ? 'number' : 'text'}
                            name={key}
                            value={imageData[key]}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit">Upload Image</button>
            </form>
        </div>
    );
}

export default ImageUploader;