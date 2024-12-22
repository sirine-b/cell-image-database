import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ImageGallery from './components/ImageGallery';
import ImageUploader from './components/ImageUploader';
import ReinitialiseTables from './components/ReinitialiseTables';
import ImageDetails from './components/ImageDetails';
import Favorites from './components/Favorites';
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/upload" element={<ImageUploader />} />
                    <Route path="/" element={<ImageGallery />} />
                    <Route path="/reinitialisetables" element={<ReinitialiseTables />}/>
                    <Route path="/image/:id" element={<ImageDetails />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;