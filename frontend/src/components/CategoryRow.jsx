import React from 'react';
import ProductCard from './ProductCard';
import './CategoryRow.css';

// The component now just renders a row of products passed to it.
const CategoryRow = ({ products }) => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="product-scroll-container">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default CategoryRow;