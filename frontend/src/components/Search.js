import React, { useState } from 'react'; // Import React and the useState hook to manage component state
import axios from 'axios'; // Import axios for making HTTP requests

// Component to search for images based on a query
function Search() {
    const [query, setQuery] = useState(''); // State to hold the search query
    const [results, setResults] = useState([]); // State to hold search results

    // Handle the search action by sending a request to the server
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
            setResults(response.data); // Update results with server response
        } catch (error) {
            console.error('Search error', error);
        }
    };

    // Render the search bar and display the results
    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search images"
                />
                <button type="submit">Search</button>
            </form>

            <div className="search-results">
                {results.map((image) => (
                    <div key={image.id} className="image-card">
                        <img src={`http://localhost:5000/${image.filepath}`} alt={image.filename}/>
                        <p>Category: {image.category}</p>
                        <p>Species: {image.species}</p>
                        <p>Cellular Component: {image.cellular_component}</p>
                        <p>Biological Process: {image.biological_process}</p>
                        <p>Shape: {image.shape}</p>
                        <p>Number of Cells: {image.number_cells}</p>
                        <p>Imaging Modality: {image.imaging_modality}</p>
                        <p>Description: {image.description}</p>
                        <p>DOI: {image.doi}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
