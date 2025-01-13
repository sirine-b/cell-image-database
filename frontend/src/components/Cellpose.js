import React, { useState } from 'react'; // Import React and its useState hook for managing state
import axios from 'axios'; // Import axios to make HTTP requests
import './Cellpose.css'; // Import the CSS file for styling the Cellpose component

// Define the App component for managing Cellpose launch
function App() {
    const [status, setStatus] = useState(''); // State to store the status message displayed to the user
    const [loading, setLoading] = useState(false); // State to indicate whether the Cellpose process is loading

    // Function to handle launching the Cellpose GUI
    const handleLaunchCellpose = async () => {
        setLoading(true); // Show loading indicator
        try {
            // Make a GET request to launch Cellpose via the backend
            const response = await axios.get('http://localhost:5000/cellpose');
            if (response.status === 200) {
                setStatus(response.data.message); // Display success message
            }
        } catch (error) {
            setStatus('Failed to launch Cellpose'); // Show error message on failure
            console.error('Error:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // JSX for rendering the component UI
    return (
        <div className="Cellpose">
            <h1 className="title-cellpose">Cellpose Cell Counting Model</h1>
            <button className="cellpose-button" onClick={handleLaunchCellpose} disabled={loading}>
                {loading ? 'Launching Cellpose...' : 'Launch Cellpose to Start Counting Cells Now!'}
            </button>
            <p>{status}</p>
        </div>
    );
}

export default App;
