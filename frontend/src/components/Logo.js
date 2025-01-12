import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from 'C:\\Users\\danielhuang\\celldatabase\\frontend\\src\\logo2.png'; // Adjust the path as needed
import './Logo.css'

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
