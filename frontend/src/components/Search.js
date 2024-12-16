import React, { useState } from 'react';
import axios from 'axios';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error('Search error', error);
        }
    };

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
                        <img src={`http://localhost:5000/${image.filepath}`} alt={image.filename} />
                        <p>NCBI Classification: {image.ncbiclassification}</p>
                        <p>Species: {image.species}</p>
                        <p>Cellular Component: {image.cellularcomponent}</p>
                        <p>Biological Process: {image.biologicalprocess}</p>
                        <p>Shape: {image.shape}</p>
                        <p>Imaging Modality: {image.imagingmod}</p>
                        <p>Description: {image.description}</p>
                        <p>Licensing: {image.licensing}</p>
                        <p>Number of Cells: {image.numbercells}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
