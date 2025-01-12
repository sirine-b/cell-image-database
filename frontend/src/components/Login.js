import React, { useState } from 'react'; // Import React and the useState hook to manage component state.
import axios from 'axios'; // Import axios for making HTTP requests.
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting users after login.
import './Login.css'; // Import the CSS file for styling the Login component.

// Main Login Component
function Login() {
    const [username, setUsername] = useState(''); // State for username input.
    const [password, setPassword] = useState(''); // State for password input.
    const [error, setError] = useState(''); // State to store error messages.
    const navigate = useNavigate(); // Hook for navigation.

    // Handles the login form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission.
        setError(''); // Clear previous errors.
        try {
            // Send login request to the server
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            localStorage.setItem('token', response.data.token); // Save token to local storage.
            navigate('/'); // Redirect to the main page after login.
        } catch (error) {
            // Display error if login fails
            setError(error.response?.data?.error || 'An error occurred during login');
        }
    };

    // Renders the login form UI
    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Login</h1> {/* Page title */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Input fields for username and password */}
                    <input
                        type="text"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="login-button">Login</button> {/* Login button */}
                    {error && <p className="login-error">{error}</p>} {/* Error message display */}
                </form>
            </div>
        </div>
    );
}

export default Login;
