// frontend/src/pages/SapraStorePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import StoreNavBar from '../components/StoreNavBar';
import '../styles/SapraStorePage.css';
import '../styles/ProductCard.css'; // For ProductCardDisplay styles

const API_BASE_URL = 'http://localhost:5000/api';

// --- Inline Banner Component ---
const BannerDisplay = () => (
    <div className="banner">
        <img 
            src="/assets/banner-sale.jpg" // Ensure this image exists in frontend/public/assets/
            alt="Sapra Store Sale Banner" 
        />
    </div>
);

// --- Inline Categories Component ---
const CategoriesDisplay = React.memo(({ categories, selectedCategory, onSelectCategory }) => (
    <div className="categories-list">
        {["All", ...categories].map((cat) => (
            <button
                key={cat}
                className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
                aria-pressed={selectedCategory === cat}
            >
                {cat}
            </button>
        ))}
    </div>
));

// --- Inline Product Card Component ---
const ProductCardDisplay = React.memo(({ product }) => {
    const { addToCart, loadingCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!currentUser) {
            alert("Please sign in to add items to your cart.");
            navigate('/signin?redirect=/saprastore'); // Redirect to your app's signin
            return;
        }
        if (product.stock > 0) {
            addToCart(product, 1);
        }
    };
    const discountedPrice = product.price * (1 - (product.discount || 0));

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.imageUrl || 'https://placehold.co/220x180/e0e0e0/777?text=No+Image'} alt={product.name} className="product-image" />
                {product.discount > 0 && <span className="discount-badge">{Math.round(product.discount * 100)}% OFF</span>}
                 {product.stock === 0 && <span className="stock-badge out-of-stock-badge">Out of Stock</span>}
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description" title={product.description}>{product.description?.substring(0, 70)}...</p>
                <div className="price-rating-container">
                    <div className="price-section">
                        <span className="current-price">₹{discountedPrice.toFixed(2)}</span>
                        {product.discount > 0 && <span className="original-price">₹{product.price.toFixed(2)}</span>}
                    </div>
                    {product.rating && <p className="rating">⭐ {product.rating.toFixed(1)}</p>}
                </div>
            </div>
            <button 
                onClick={handleAddToCart} 
                disabled={loadingCart || product.stock === 0} 
                className="add-to-cart-btn"
                aria-label={`Add ${product.name} to cart`}
            >
                {product.stock === 0 ? "Out of Stock" : loadingCart ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
    );
});

// --- Inline Product List Component ---
const ProductListDisplay = ({ products, loading, error }) => {
    if (loading) return <p className="loading-message">Loading products...</p>;
    if (error) return <p className="error-message">Error: {error}. Please try again.</p>;
    if (!products || products.length === 0) return <p className="info-message">No products found matching your criteria.</p>;
    return (
        <div className="product-grid">
            {products.map((product) => <ProductCardDisplay key={product.id} product={product} />)}
        </div>
    );
};

// --- Inline Pagination Component ---
const PaginationDisplay = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    // Simple pagination: Prev, Next, Current/Total
    return (
        <div className="pagination-controls">
            <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page">
                « Prev
            </button>
            <span aria-current="page"> Page {currentPage} of {totalPages} </span>
            <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page">
                Next »
            </button>
        </div>
    );
};

// --- Main SapraStorePage Component ---
const SapraStorePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setStoreCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const fetchCategoriesOnce = useCallback(async () => {
        try {
            const catResponse = await axios.get(`${API_BASE_URL}/categories`);
            setStoreCategories(catResponse.data || []);
        } catch (err) {
            console.error("SapraStorePage: Error fetching categories:", err);
            // setError("Could not load categories."); // Or set a specific category error
        }
    }, []);

    useEffect(() => {
        fetchCategoriesOnce();
    }, [fetchCategoriesOnce]);


    const fetchProductData = useCallback(async (page, category, search) => {
        setLoading(true);
        setError(null);
        try {
            const prodParams = { page, limit: 12 };
            if (category && category.toLowerCase() !== 'all') prodParams.category = category;
            if (search) prodParams.search = search;
            
            const prodResponse = await axios.get(`${API_BASE_URL}/products`, { params: prodParams });
            setProducts(prodResponse.data.products || []);
            setCurrentPage(prodResponse.data.currentPage || 1);
            setTotalPages(prodResponse.data.totalPages || 1);

        } catch (err) {
            console.error("SapraStorePage: Error fetching products:", err);
            setError(err.response?.data?.message || "Could not load products. Please try refreshing.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
        const categoryFromUrl = searchParams.get('category') || 'All';
        const currentSearchTerm = searchParams.get('q') || '';
        
        setSelectedCategory(categoryFromUrl); // Update selected category from URL
        
        fetchProductData(pageFromUrl, categoryFromUrl, currentSearchTerm);
    }, [searchParams, fetchProductData]); 

    const handleCategorySelect = (category) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('category', category);
        newSearchParams.set('page', '1'); 
        if (category.toLowerCase() === 'all') newSearchParams.delete('category');
        setSearchParams(newSearchParams);
    };

    const handleSearch = (term) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (term) newSearchParams.set('q', term);
        else newSearchParams.delete('q');
        newSearchParams.set('page', '1'); 
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', newPage.toString());
            setSearchParams(newSearchParams);
        }
    };

    return (
        <div className="sapra-store-page-container">
            <StoreNavBar onSearch={handleSearch} />
            <div className="store-content-area container">
                <BannerDisplay />
                <CategoriesDisplay
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                />
                <ProductListDisplay products={products} loading={loading && products.length === 0} error={error} /> {/* Show loading only if no products yet */}
                {!loading && products.length > 0 && (
                    <PaginationDisplay
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default SapraStorePage;