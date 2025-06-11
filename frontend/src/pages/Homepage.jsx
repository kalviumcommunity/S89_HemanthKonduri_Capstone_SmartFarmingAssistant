// client/src/features/HomePage.jsx (or wherever your Homepage component is)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For "Shop Now" button
import './HomePage.css'; // We'll update this CSS
import NavBar from '../components/NavBar';
// Assuming NavBar is a global component or imported correctly


// Banner Data - You'll replace image URLs with actual relevant images for each feature
const bannerFeatures = [
    {
        title: "Real-Time Market Prices",
        description: "Stay ahead with instant access to current market prices for your crops, fertilizers, and tools. Make informed selling and buying decisions.",
        imageUrl: "https://i.pinimg.com/736x/33/db/be/33dbbe844878b2431492eceba380fd1f.jpg", // Placeholder
        altText: "Market Prices Chart",
        link: "/marketprices" // Example link
    },
    {
        title: "AI-Powered Disease Detection",
        description: "Identify plant diseases quickly and accurately using our advanced AI-powered image analysis. Protect your crops and prevent losses.",
        imageUrl: "https://lh3.googleusercontent.com/gg-dl/AJfQ9KQqdTYpShj5pX8c8vm59P6_HDKb1LnI2O8eBlcsQ6jqmv4Zn3Sj1zVmZh3uymvkcOSln0XD3jRfP1WTq2GFMZmIntKQEoYrWTW1K2AgZHUflt_BuPgU7K2FbXwsBZgQOYFoIVWnOjAR4GkR9f-nezEGSk5iuLo29oNKQBIJpepvvdOs9g=s1024?authuser=1", // Placeholder
        altText: "Plant with disease highlighted by AI",
        link: "/disease-detection" // Example link
    },
    {
        title: "24/7 Smart Farming Assistant",
        description: "Get instant support and expert advice anytime with our AI-powered chatbot. Ask questions about farming practices, crop care, and more.",
        imageUrl: "https://images.unsplash.com/photo-1551843009-b587955a5435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBjaGF0Ym90JTIwZmFybWluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=60", // Placeholder
        altText: "Farmer using AI Chatbot on a tablet",
        link: "/chatwindows" // Example link
    },
    {
        title: "SAPRA Store",
        description: "Shop for high-quality farming supplies at competitive prices from verified vendors. Fertilizers, tools, and more.",
        imageUrl: "https://images.unsplash.com/photo-1586769020540-750b6dfe21ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFybWluZyUyMHN1cHBsaWVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=60", // Placeholder
        link: "/saprastore"
    }
];

// Data for alternating feature sections
const alternatingFeaturesData = [
    {
        title: "Happy Farmers, Thriving Harvests",
        description: "Our platform is dedicated to empowering farmers like you. By providing smart tools and timely information, we help you increase yield, reduce risks, and achieve greater success in your agricultural endeavors. Join a community of forward-thinking farmers.",
        imageUrl: "https://i.pinimg.com/736x/70/5d/62/705d62712815531da63b754e1a695761.jpg", // Placeholder
        altText: "Group of happy farmers in a field",
        imagePosition: "right" // 'left' or 'right'
    },
    {
        title: "All-In-One Farming Solutions",
        description: "From AI-driven insights to a comprehensive marketplace, Sapra offers an integrated suite of tools. Manage your farm efficiently, make data-backed decisions, and connect with resources, all within a single, user-friendly platform. Simplify your farming operations today.",
        imageUrl: "https://media.istockphoto.com/id/1284360001/photo/young-indian-farmer-and-agronomist-showing-money-and-laptop-screen.webp?a=1&b=1&s=612x612&w=0&k=20&c=FFlkDWxp5YVWPocU5h9AEEc_yKhx2w-k8I3-hJVRKds=", // Placeholder
        altText: "Dashboard showing various farming metrics",
        imagePosition: "left"
    },
    {
        title: "Embrace Modern Farming",
        description: "Step into the future of agriculture with cutting-edge technology. Utilize precision farming techniques, IoT devices, and advanced analytics to optimize resource usage, improve crop health, and contribute to sustainable farming practices for a better tomorrow.",
        imageUrl: "https://i.pinimg.com/736x/72/78/6f/72786f8acd5ca5060142969e83f66364.jpg", // Placeholder
        altText: "Drone flying over a modern farm",
        imagePosition: "right"
    }
];


const HomePage = () => {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerFeatures.length);
        }, 5000); // Change banner every 5 seconds

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, []);

    const currentBanner = bannerFeatures[currentBannerIndex];

    return (
        <div className='homepage-container'>
          
    <NavBar/>
            {/* Hero Section with Auto-Changing Banner */}
            <section
                className='hero-section'
                style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
            >
                <div className='hero-overlay'>
                    <div className='hero-content container'>
                        <h1>{currentBanner.title}</h1>
                        <p className="hero-description">{currentBanner.description}</p>
                        {/* Optional: Button specific to the banner or a general one */}
                        <Link to={currentBanner.link || "/sapra-store"} className="btn btn-primary btn-hero">
                            Learn More
                        </Link>
                    </div>
                    <div className="banner-dots">
                        {bannerFeatures.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentBannerIndex ? 'active' : ''}`}
                                onClick={() => setCurrentBannerIndex(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main heading for the overall message - Placed before alternating features */}
            <section className="main-heading-section">
                <div className="container">
                    <h1>Grow Smarter, Farm Better</h1>
                    <p className="sub-text">
                        Empowering farmers with smart solutions — from soil to success.
                    </p>
                </div>
            </section>


            {/* Alternating Feature Sections */}
            <div className='alternating-features-container'>
                {alternatingFeaturesData.map((feature, index) => (
                    <section
                        key={index}
                        className={`alternating-feature-section ${feature.imagePosition === 'left' ? 'image-left' : 'image-right'}`}
                    >
                        <div className='container feature-content-grid'>
                            <div className='feature-image-wrapper'>
                                <img
                                    src={feature.imageUrl}
                                    alt={feature.altText}
                                    className='feature-image-circle'
                                />
                            </div>
                            <div className='feature-text-content'>
                                <h2>{feature.title}</h2>
                                <p>{feature.description}</p>
                                {/* Optional: Add a button or link here too */}
                                {/* <Link to="/learn-more" className="btn btn-secondary">Read More</Link> */}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Optional: A final call to action or link to the store */}
            <section className="final-cta-section">
                <div className="container">
                    <h2>Ready to Transform Your Farm?</h2>
                    <p>Explore our full range of products and services designed for modern agriculture.</p>
                    <Link to="/saprastore" className="btn btn-primary btn-large">
                        Visit SAPRA Store
                    </Link>
                </div>
            </section>


            <footer className="home-footer">
                <div className="container">
                    
                    <p>© {new Date().getFullYear()} Sapra Store. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;