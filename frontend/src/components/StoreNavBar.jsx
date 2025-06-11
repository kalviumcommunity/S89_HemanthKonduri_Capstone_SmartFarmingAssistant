import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './StoreNavBar.css'; // Ensure you have this CSS file for styling

// A lightweight SVG icon for the search button
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
    </svg>
);

const StoreNavBar = ({ onSearch }) => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        // Changed the container to a more semantic <header> tag
        <header className="store-header">
            <div className="store-header-left">
                {/* The title now links back to the main store page, which is great for UX */}
                
                    <h1 className="store-title-link">Sapra Store</h1>
                <Link to='/homepage'></Link>
            </div>

            <div className="store-header-center">
                <form className="store-search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="search" // Using 'search' type adds a clear 'x' button in some browsers
                        placeholder="Search for fertilizers, tools, seeds..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products in Sapra Store"
                    />
                    <button type="submit" aria-label="Submit search">
                        <SearchIcon />
                    </button>
                </form>
            </div>
            
            {/* This empty div is a spacer to ensure the search bar is perfectly centered */}
            <div className="store-header-right"></div>
        </header>
    );
};

export default StoreNavBar;