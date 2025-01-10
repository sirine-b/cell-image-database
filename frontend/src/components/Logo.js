import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from 'C:\\Users\\sirin\\cell-image-database\\frontend\\src\\logo2.png'; // Adjust the path as needed
import './Logo.css'
function Logo() {
    const navigate = useNavigate();

    return (
        <div className="logo" onClick={() => navigate('/')}>
            <img src={logoImage} alt="Logo" />
        </div>
    );
}

export default Logo;
