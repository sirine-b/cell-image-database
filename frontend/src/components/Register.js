import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';


function Register() {
    const [username, setUsername] = useState(''); // State to store the username
    const [password, setPassword] = useState(''); // State to store the password
    const [error, setError] = useState('');
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
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h1 className="register-title">Register</h1>
                <form className="register-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="register-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        className="register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="register-button">Register</button>
                    {error && <p className="register-error">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Register;
