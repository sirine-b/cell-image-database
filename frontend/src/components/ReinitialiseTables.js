import React from 'react';
import axios from 'axios';

function ReinitialiseTables() {
    const handleReinitialize = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/reinitialisetables');
            alert(response.data.message);
        } catch (error) {
            console.error('Error reinitialising tables:', error);
            alert('Failed to reinitialise tables');
        }
    };

    return (
        <div>
            <h2>Reinitialise Tables</h2>
            <button onClick={handleReinitialize}>Reinitialise Tables</button>
        </div>
    );
}

export default ReinitialiseTables;
