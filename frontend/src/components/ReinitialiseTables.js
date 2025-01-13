import React from 'react'; // Import React to define and render components
import axios from 'axios'; // Import axios for handling HTTP requests

function ReinitialiseTables() {
    // Sends a request to reinitialize database tables and displays a success or error message
    const handleReinitialize = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/reinitialisetables');
            alert(response.data.message);
        } catch (error) {
            console.error('Error reinitialising tables:', error);
            alert('Failed to reinitialise tables');
        }
    };

    // Renders the button and title for triggering table reinitialization
    return (
        <div>
            <h2>Reinitialise Tables</h2>
            <button onClick={handleReinitialize}>Reinitialise Tables</button>
        </div>
    );
}

export default ReinitialiseTables;
