import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/search?query=${query}&filter=${filter}`);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All Features</option>
                <option value="ncbiclassification">NCBI Classification</option>
                <option value="species">Species</option>
                <option value="cellularcomponent">Cellular Component</option>
                <option value="biologicalprocess">Biological Process</option>
                <option value="shape">Shape</option>
                <option value="imagingmod">Imaging Mod</option>
                <option value="description">Description</option>
                <option value="licensing">Licensing</option>
            </select>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;