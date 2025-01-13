import React from 'react'; // Import React to define and render components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for accessing URL parameters
import logoImage from  '../logo2.png';
import './Logo.css' // Import the CSS file for styling this component

function Logo() {
    const navigate = useNavigate();

    // Renders the logo and navigates to the home page when clicked
    return (
        <div className="logo" onClick={() => navigate('/')}>
            <img src={logoImage} alt="Logo" />
        </div>
    );
}

export default Logo;
