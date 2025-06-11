// backend/data.js
import { v4 as uuidv4 } from 'uuid';

const productCategories = ["Fertilizers", "Pesticides", "Gardening Tools", "Seeds", "Organic Inputs", "Farm Machinery Parts", "Irrigation Supplies", "Protective Gear", "Soil Amendments", "Plant Growth Regulators"];
const fertilizerTypes = ["Nitrogen Rich Urea", "Phosphorus Blend DAP", "Potassium Booster MOP", "Balanced NPK 19-19-19", "Micronutrient Mix Special", "Slow Release Granules Pro", "Organic Vermicompost", "Liquid Seaweed Extract"];
const pesticideTypes = ["Insecticide Spray Alpha", "Fungicide Powder Beta", "Herbicide Concentrate Gamma", "Organic Pest Repellent NeemOil", "Rodent Control Pellets Omega", "Bio-Pesticide Delta"];
const toolTypes = ["Heavy Duty Shovel XL", "Carbon Steel Rake Pro", "Precision Pruner SharpCut", "Ergonomic Hoe ComfortGrip", "Large Watering Can (10L)", "Reinforced Safety Gloves", "Heavy Duty Wheelbarrow", "Digital Soil pH Tester", "Garden Spade Compact"];
const seedVarieties = ["Hybrid Tomato Champion", "Leafy Spinach Evergreen", "Sweet Carrot Nantes", "Bell Pepper Mix Rainbow", "Culinary Herb Kit Gourmet", "Exotic Flower Seeds Sunshine", "High-Yield Corn Golden", "Drought-Resistant Millet Pearl", "Organic Vegetable Medley"];

const descriptions = [
    "Premium quality for maximum yield and plant health. Trusted by professional farmers and home gardeners alike.",
    "Effective and easy-to-apply solution for common agricultural challenges. Environmentally conscious formulation.",
    "Durable and reliable, designed for long-term use in demanding field conditions. Built to last.",
    "Ideal for both large-scale farming operations and small home gardening enthusiasts. Versatile and user-friendly.",
    "Eco-friendly and sustainable option for modern agriculture practices. Promotes soil health and biodiversity.",
    "Boosts plant growth, protects against a wide range of pests, and significantly improves soil quality and structure.",
    "Engineered for superior performance, helping you achieve the best possible results in your farming endeavors.",
    "A must-have for any serious farmer or gardener. Enhances productivity and simplifies your work.",
    "Carefully selected and tested for optimal performance in various climatic conditions. Ensures high germination rates.",
    "State-of-the-art formulation using the latest agricultural technology. Safe for crops, users, and the environment."
];

const generateRandomProducts = (count = 350) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const category = productCategories[i % productCategories.length];
        let name = "";
        let imageBase = "https://placehold.co/300x200";
        // Generate more distinct placeholder colors
        const r = (i * 50) % 256;
        const g = (i * 90) % 256;
        const b = (i * 130) % 256;
        const bgColor = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        const textColor = "ffffff";

        switch (category) {
            case "Fertilizers":
                name = `${fertilizerTypes[Math.floor(Math.random() * fertilizerTypes.length)]}`;
                imageBase += `/${bgColor}/${textColor}?text=Fertilizer`;
                break;
            case "Pesticides":
                name = `${pesticideTypes[Math.floor(Math.random() * pesticideTypes.length)]}`;
                imageBase += `/${bgColor}/${textColor}?text=Pesticide`;
                break;
            case "Gardening Tools":
                name = `${toolTypes[Math.floor(Math.random() * toolTypes.length)]}`;
                imageBase += `/${bgColor}/${textColor}?text=Tool`;
                break;
            case "Seeds":
                name = `${seedVarieties[Math.floor(Math.random() * seedVarieties.length)]} Pack`;
                imageBase += `/${bgColor}/${textColor}?text=Seeds`;
                break;
            default:
                name = `${category} Series ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`;
                imageBase += `/${bgColor}/${textColor}?text=${encodeURIComponent(category.substring(0,6))}`;
        }

        products.push({
            id: uuidv4(),
            name: `${name} (Product #${i + 1})`,
            category: category,
            price: parseFloat((Math.random() * (3000 - 40) + 40).toFixed(2)),
            discount: Math.random() < 0.3 ? parseFloat((Math.random() * 0.35 + 0.05).toFixed(2)) : 0, // 5-40% discount 30% of time
            rating: parseFloat((Math.random() * (5 - 2.8) + 2.8).toFixed(1)), // 2.8 - 5.0
            description: descriptions[Math.floor(Math.random() * descriptions.length)] + ` Stock keeping unit: SKU${10000+i}.`,
            imageUrl: `${imageBase}&s=${i}`, // Add sequence for better uniqueness of placeholder
            stock: Math.floor(Math.random() * 200) + (Math.random() < 0.1 ? 0 : 10), // 10% chance of being out of stock
        });
    }
    return products;
};

export let products = generateRandomProducts();
export const categoriesFromData = Array.from(new Set(products.map(p => p.category))).sort();

export let users = {
    // User data is created/updated by getUserData
};

export const getUserData = (userId, userName, userEmail) => {
    if (!users[userId]) {
        console.log(`Backend: Creating new user entry for ID: ${userId}, Name: ${userName}, Email: ${userEmail}`);
        users[userId] = {
            id: userId,
            name: userName || "User " + userId.substring(0,5), // Fallback name
            email: userEmail || `${userId.substring(0,5)}@sapra.store`, // Fallback email
            walletBalance: 5000.00,
            cart: { items: [] },
            orders: []
        };
    } else {
        // Update name/email if provided and different (optional, frontend usually source of truth for display)
        if (userName && users[userId].name !== userName) users[userId].name = userName;
        if (userEmail && users[userId].email !== userEmail) users[userId].email = userEmail;
    }
    return users[userId];
};