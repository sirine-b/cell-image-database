// Imports required components and libraries
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ImageGallery from './components/ImageGallery';
import ImageUploader from './components/ImageUploader';
import ReinitialiseTables from './components/ReinitialiseTables';
import ImageDetails from './components/ImageDetails';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FavoritesPage from './components/FavoritesPage';
import Logo from './components/Logo';
import Cellpose from './components/Cellpose';

// Main App component with routing setup
function App() {
    return (
        <Router>
            <div className="App">
                <ConditionalSearchBar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/upload" element={<ImageUploader />} />
                    <Route path="/" element={<ImageGallery />} />
                    <Route path="/reinitialisetables" element={<ReinitialiseTables />}/>
                    <Route path="/image/:id" element={<ImageDetails />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/cellpose" element={<Cellpose />} />
                </Routes>
                <Logo/>
            </div>
        </Router>
    );
}

// Conditionally renders the search bar on specific pages
function ConditionalSearchBar() {
    const location = useLocation();
    return (location.pathname === '/' || location.pathname === '/search') ? <SearchBar /> : null;
}
export default App;