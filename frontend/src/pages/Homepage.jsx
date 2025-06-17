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
        imageUrl: "https://sdmntpreastus.oaiusercontent.com/files/00000000-50ec-61f9-983c-f3b22ac9814d/raw?se=2025-06-16T10%3A27%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=f72aa3e2-a997-548b-8a29-08b0f3842220&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T20%3A56%3A02Z&ske=2025-06-16T20%3A56%3A02Z&sks=b&skv=2024-08-04&sig=45gW2PgSEf6ogc3qqC85C0X46LjGFP0SM4c7EDr8GEI%3D", // Placeholder
        altText: "Market Prices Chart",
        link: "/marketprices" 
    },
    {
        title: "AI-Powered Disease Detection",
        description: "Identify plant diseases quickly and accurately using our advanced AI-powered image analysis. Protect your crops and prevent losses.",
        imageUrl: "https://sdmntpreastus.oaiusercontent.com/files/00000000-3f40-61f9-a71b-ec7fb34ea015/raw?se=2025-06-16T10%3A31%3A02Z&sp=r&sv=2024-08-04&sr=b&scid=70fa45ce-1d17-53ee-b28f-53427d4ca6ea&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T20%3A57%3A27Z&ske=2025-06-16T20%3A57%3A27Z&sks=b&skv=2024-08-04&sig=20iVGg0OCyUpULlHmw9ZtSAh4kFMgshmsFu9xQ7m4OQ%3D", // Placeholder
        altText: "Plant with disease highlighted by AI",
        link: "/disease-detection"
    },
    {
        title: "24/7 Smart Farming Assistant",
        description: "Get instant support and expert advice anytime with our AI-powered chatbot. Ask questions about farming practices, crop care, and more.",
        imageUrl: "https://sdmntpreastus.oaiusercontent.com/files/00000000-b024-61f9-a93c-1f6f00ce6dbb/raw?se=2025-06-16T10%3A41%3A21Z&sp=r&sv=2024-08-04&sr=b&scid=47749a57-c57f-5c08-8bf2-234245cb8825&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-16T08%3A58%3A59Z&ske=2025-06-17T08%3A58%3A59Z&sks=b&skv=2024-08-04&sig=jBxw1YW52vCN%2BPsFRGF8Zh71wsPQ1QZzqkjdcAaYYsg%3D", // Placeholder
        altText: "Farmer using AI Chatbot on a tablet",
        link: "/chatwindows" 
    },
    {
        title: "SAPRA Store",
        description: "Shop for high-quality farming supplies at competitive prices from verified vendors. Fertilizers, tools, and more.",
        imageUrl: "https://sdmntprcentralus.oaiusercontent.com/files/00000000-e878-61f5-a643-a47daec6a564/raw?se=2025-06-16T10%3A51%3A20Z&sp=r&sv=2024-08-04&sr=b&scid=176962d3-9507-5883-9f16-75de12b7cd5f&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T20%3A57%3A30Z&ske=2025-06-16T20%3A57%3A30Z&sks=b&skv=2024-08-04&sig=soNogaTN5JsMMH0aoGayREDQD58Lo0/XtSEeF9WaszM%3D", // Placeholder
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
                <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-column">
          <h3>Smart Farming Assistant</h3>
          <p>
            Empowering farmers with technology – from AI tools to real-time
            support.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/market-prices">Market Prices</a></li>
            <li><a href="/ai-chat">AI Chat</a></li>
            <li><a href="/products">Products</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>Email: support@smartfarming.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Rajahmundry, India</p>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="Facebook" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384017.png" alt="Twitter" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384012.png" alt="Instagram" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Smart Farming Assistant. All rights reserved.</p>
      </div>
            </footer>
        </div>
    );
};

export default HomePage;