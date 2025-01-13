import React, { useState } from 'react'; // Import React and the useState hook to manage component state
import { useNavigate } from 'react-router-dom'; // Import useNavigate for accessing URL parameters

// A reusable search bar component with filtering options
const SearchBar = () => {
    const [query, setQuery] = useState(''); // State for storing the search query
    const [filter, setFilter] = useState(''); // State for storing the selected filter
    const navigate = useNavigate(); // Navigation hook to redirect users to the search results page

    // Redirects the user to the search results page with the query and filter parameters
    const handleSearch = () => {
        navigate(`/search?query=${query}&filter=${filter}`);
    };

    // Render the search input, filter dropdown and search button
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
                <option value="Category">Category</option>
                <option value="species">Species</option>
                <option value="Cellular Component">Cellular Component</option>
                <option value="Biological Process">Biological Process</option>
                <option value="Shape">Shape</option>
                <option value="Number of Cells">Number of Cells</option>
                <option value="Imaging Modality">Imaging Modality</option>
                <option value="Description">Description</option>
                <option value="DOI">DOI</option>
            </select>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;