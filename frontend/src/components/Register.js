import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {
    const [username, setUsername] = useState(''); // State to store the username
    const [password, setPassword] = useState(''); // State to store the password
    const navigate = useNavigate(); // Used to navigate to another page after registration

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send registration data to the backend
            await axios.post('http://localhost:5000/api/register', { username, password });
            alert('Registration successful');
            navigate('/login'); // Redirect to the login page after successful registration
        } catch (error) {
            console.error('Registration error', error);
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                placeholder="Password"
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
