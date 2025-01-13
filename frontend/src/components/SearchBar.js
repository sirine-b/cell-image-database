import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// A reusable search bar component with filtering options
const SearchBar = () => {
    const [query, setQuery] = useState(''); // State for storing the search query
    const [filter, setFilter] = useState(''); // State for storing the selected filter
    const navigate = useNavigate(); // Navigation hook to redirect users to the search results page

    // Redirects the user to the search results page with the query and filter parameters
    const handleSearch = () => {
        navigate(`/search?query=${query}&filter=${filter}`);
    };

    // Renders the search input, filter dropdown, and search button
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