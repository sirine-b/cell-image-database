import React, { useState } from 'react'; // Import React and the useState hook to manage component state.
import axios from 'axios'; // Import axios for making HTTP requests.
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting users after register.
import './Register.css'; // Import the CSS file for styling the Register component.

function Register() {
    const [username, setUsername] = useState(''); // State to handle the username input
    const [password, setPassword] = useState(''); // State to handle the password input
    const [error, setError] = useState(''); // State to store any error messages
    const navigate = useNavigate(); // Used for redirecting to another page after registration

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        try {
            // Send registration data to the backend
            await axios.post('http://localhost:5000/api/register', { username, password });
            alert('Registration successful');
            navigate('/login'); // Redirect to login page after registration
        } catch (error) {
            console.error('Registration error', error); // Log any errors
            alert('Registration failed');
            setError('Registration failed. Please try again.'); // Set error message for the user
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
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        className="register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="register-button">Register</button> {/* Registration button */}
                    {error && <p className="register-error">{error}</p>} {/* Display error message if any */}
                </form>
            </div>
        </div>
    );
}

export default Register;