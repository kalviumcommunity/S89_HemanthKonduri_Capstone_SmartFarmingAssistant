import React, { useMemo } from 'react';
import { useStore } from '/src/contexts/StoreContext';
import ProductCard from '../components/ProductCard';
import './StoreHomePage.css'; // We will provide new CSS for this
import NavBar from '../components/NavBar';
import StoreNavbar from '../components/StoreNavbar';

const categoryDetails = {
    Fertilizers: { img: '/assets/fertilizers.jpg' },
    Pesticides: { img: '/assets/pesticides.jpg' },
    'Gardening Tools': { img: '/assets/tools.jpg' },
    Seeds: { img: '/assets/seeds.jpg' }
};

const categoryOrder = ['Fertilizers', 'Pesticides', 'Gardening Tools', 'Seeds'];

const StoreHomePage = () => {
    const { products, loading } = useStore();

    const productsByCategory = useMemo(() => {
        if (!products) return {};
        return products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});
    }, [products]);

    const scrollToCategory = (category) => {
        document.getElementById(category)?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return <div className="loader">Loading Sapra Store...</div>;

    return (
        <div className="store-home-page">
            <NavBar/>
            <StoreNavbar/>
            <div className="banner-container">
                <img src="/assets/banner.jpg" alt="Sapra Store Banner" className="banner-image" />
                <div className="banner-overlay">
                    <h1>Your One-Stop Shop for Farming Needs</h1>
                    <p>High-quality products for a bountiful harvest.</p>
                </div>
            </div>

            <div className="categories-preview-container container">
                <h2>Our Categories</h2>
                <div className="category-cards">
                    {categoryOrder.map(cat => (
                        <div key={cat} className="category-card" onClick={() => scrollToCategory(cat)}>
                            <img src={categoryDetails[cat]?.img} alt={cat} />
                            <div className="category-card-title">{cat}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container product-sections">
                {categoryOrder.map(category => {
                    const categoryProducts = productsByCategory[category] || [];
                    if (categoryProducts.length === 0) return null;

                    return (
                        <section className="category-section" id={category} key={category}>
                            <h2 className="category-title">{category}</h2>
                            <div className="horizontal-scroll-wrapper">
                                {categoryProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default StoreHomePage;