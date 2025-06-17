const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db.config');
const Product = require('./models/Product');
const StoreUserModel = require('./models/StoreUser'); // <-- CORRECTED: Using StoreUser.js
const Order = require('./models/Order');

// --- DATA GENERATION DICTIONARY (No changes) ---
const categories = {
    Fertilizers: { brands: ['AgroGrow', 'HarvestKing', 'TerraFertil', 'GreenBloom', 'NutriFarm', 'SoilBoost'], names: ['NPK Blend', 'Urea Pellets', 'Bio-Organic Mix', 'Super Potash', 'Phosphate Booster', 'Liquid Seaweed'], adjectives: ['High-Yield', 'Slow-Release', 'Water-Soluble', 'Eco-Friendly', 'Concentrated', 'Premium-Grade'] },
    Pesticides: { brands: ['PestGuard', 'BugOff', 'CropShield', 'MiteAway', 'FungiClear', 'NatureShield'], names: ['Neem Oil Extract', 'Insecticidal Soap', 'Broad-Spectrum Fungicide', 'Natural Herbicide', 'Spider Mite Control', 'Aphid Spray'], adjectives: ['Organic', 'Fast-Acting', 'Plant-Safe', 'Weather-Resistant', 'Systemic', 'Concentrated'] },
    'Gardening Tools': { brands: ['GardenPro', 'TerraTools', 'EasyGrip', 'DuraSteel', 'YardMaster', 'Fiskars'], names: ['Hand Trowel', 'Pruning Shears', 'Weeder Fork', 'Leaf Rake', 'Watering Can', 'Digging Spade', 'Garden Gloves'], adjectives: ['Ergonomic', 'Heavy-Duty', 'Stainless Steel', 'Lightweight', 'Rust-Proof', 'Professional'] },
    Seeds: { brands: ['SeedSupreme', 'HeirloomHarvest', 'SproutWell', 'QuickGrow', 'GardenGems', 'Burpee'], names: ['Cherry Tomato', 'Marigold Flower', 'Hybrid Spinach', 'Heirloom Carrot', 'Italian Basil', 'Sweet Corn', 'Cucumber'], adjectives: ['Non-GMO', 'High-Germination', 'Organic', 'All-Season', 'Drought-Tolerant', 'Heirloom'] }
};
const imageUrls = {
    Fertilizers: [ "https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/2252482/pexels-photo-2252482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.unsplash.com/photo-1627922933252-9b244a1597da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" ],
    Pesticides: [ "https://images.pexels.com/photos/6419731/pexels-photo-6419731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.unsplash.com/photo-1599723903530-01c3a6ed552a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" ],
    'Gardening Tools': [ "https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/796526/pexels-photo-796526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/1030979/pexels-photo-1030979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" ],
    Seeds: [ "https://images.pexels.com/photos/1325676/pexels-photo-1325676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/1453771/pexels-photo-1453771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.unsplash.com/photo-1589445342933-727581395899?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" ]
};
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateProducts = (count) => {
    const products = [];
    const usedNames = new Set();
    while (products.length < count) {
        const categoryName = getRandomElement(Object.keys(categories));
        const catData = categories[categoryName];
        const name = `${getRandomElement(catData.brands)} ${getRandomElement(catData.adjectives)} ${getRandomElement(catData.names)}`;
        if (usedNames.has(name)) { continue; }
        usedNames.add(name);
        const description = `A top-quality ${name} from Sapra Store, perfect for modern farming and gardening. Ensures healthy growth and bountiful harvests. Ideal for both professional and hobbyist use.`;
        const price = parseFloat((Math.random() * (4500 - 150) + 150).toFixed(2));
        const discount = Math.floor(Math.random() * 22) + 5;
        const rating = parseFloat((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1));
        const stock = Math.floor(Math.random() * 180) + 20;
        const image = getRandomElement(imageUrls[categoryName]);
        products.push({ name, category: categoryName, description, price, discount, rating, image, stock });
    }
    return products;
};

// --- DATABASE SEEDING LOGIC ---
const seedDatabase = async () => {
    await connectDB();
    console.log("Database connected successfully");
    try {
        console.log('Clearing existing data from Products, StoreUsers, and Orders collections...');
        await Product.deleteMany();
        await StoreUserModel.deleteMany(); // <-- CORRECTED: Using the StoreUser model
        await Order.deleteMany();
        console.log('Old data cleared.');

        console.log('Generating 525 new products internally...');
        const productsToInsert = generateProducts(525);
        
        console.log('Seeding generated products to the database...');
        await Product.insertMany(productsToInsert);
        console.log(`${productsToInsert.length} products have been seeded successfully.`);

        console.log('Seeding default store user profile...');
        const defaultStoreUser = {
            authUserId: process.env.USER_ID, // This should link to an ID from your main User model
            hasPlacedFirstOrder: false,
            addresses: [{
                name: 'Default User',
                street: '123 Farm Lane',
                city: 'Greenfield',
                state: 'Harvest',
                zip: '54321',
                phone: '9876543210'
            }]
        };
        await StoreUserModel.create(defaultStoreUser); // <-- CORRECTED: Using the StoreUser model
        console.log('Default store user seeded.');

        console.log('Database seeding complete!');
        process.exit();
    } catch (error) {
        console.error(`Error during seeding: ${error}`);
        process.exit(1);
    }
};

seedDatabase();