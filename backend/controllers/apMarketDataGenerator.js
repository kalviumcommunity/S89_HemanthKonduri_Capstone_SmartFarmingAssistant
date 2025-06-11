// backend/utils/apMarketDataGenerator.js

const AP_DISTRICTS_TOWNS = {
    "Krishna": "Vijayawada",
    "Guntur": "Guntur City",
    "Kakinada": "Kakinada",
    "West Godavari": "Eluru",
    "Visakhapatnam": "Vizag City",
    "Chittoor": "Tirupati",
    "Kurnool": "Kurnool Town",
    "Anantapur": "Anantapur City",
    "Prakasam": "Ongole City",
    "Bapatla": "Chirala City",
    
    "East Godavari": "Rajamundry City",
  
    // Add more districts as needed for a fuller list
};

const CROP_VARIETIES = {
    Tomato: ["Local", "Hybrid S-22", "Pusa Ruby"],
    Potato: ["Kufri Jyoti", "Chipsona-1", "Local Red"],
    Onion: ["Nasik Red", "Bellary Red", "White Onion"],
    Chilli: ["Guntur Sannam", "Teja", "Byadagi (imported)"],
    Turmeric: ["Duggirala", "Kadapa"],
    Cotton: ["BT Cotton", "Desi Cotton MCU-5"],
    "Bengal Gram": ["Chana Desi KAK-2", "Kabuli Chana"],
    "Groundnut": ["Kadiri-6", "TMV-2"],
    Rice: ["Sona Masoori BPT-5204", "Swarna MTU-7029"],
    Maize: ["Hybrid Deccan", "Composite Ganga-5"],
    Okra: ["Pusa Sawani", "Arka Anamika"],
    Mango: ["Banganapalli", "Suvarnarekha", "Dasheri (seasonal)"],
};
const CROP_NAMES = Object.keys(CROP_VARIETIES);

// Placeholder image URLs (use real URLs or local paths if available)
const CROP_IMAGES = {
    Tomato: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D",
    Potato: "https://media.istockphoto.com/id/157430678/photo/three-potatoes.webp?a=1&b=1&s=612x612&w=0&k=20&c=xCQkT9Rwrz3XgFnLQfQZ2mq-xTA4WuGkdr23MkdPddA=",
    Onion: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9uaW9uc3xlbnwwfHwwfHx8MA%3D%3D",
    Chilli: "https://images.unsplash.com/photo-1667885098591-8fec06ead8d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGxpZXN8ZW58MHx8MHx8fDA%3D",
    Turmeric: "https://images.unsplash.com/photo-1606951444141-e5533feb55be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVybWVyaWN8ZW58MHx8MHx8fDA%3D",
    Cotton: "https://images.unsplash.com/photo-1705147293352-3e81c1b8ab5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y290dG9ufGVufDB8fDB8fHww",
    "Bengal Gram": "https://media.istockphoto.com/id/1919243661/photo/yellow-gram-whole.webp?a=1&b=1&s=612x612&w=0&k=20&c=bdKpvlTsn8GE7PbDZPFmpeg6aucL2igo-xl6KC-hjbU=",
    "Groundnut": "https://plus.unsplash.com/premium_photo-1669998297388-4a4fc3b61673?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JvdW5kJTIwbnV0fGVufDB8fDB8fHww",
    Rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmljZXxlbnwwfHwwfHx8MA%3D%3D",
    Maize: "https://images.unsplash.com/photo-1623066798929-946425dbe1b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFpemV8ZW58MHx8MHx8fDA%3D",
    Okra: "https://images.unsplash.com/photo-1664289242854-e99d345cfa92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9rcmF8ZW58MHx8MHx8fDA%3D",
    Mango: "https://media.istockphoto.com/id/1338315311/photo/image-of-heap-of-whole-raw-tropical-mango-fruit-besides-diced-pieces-green-skins-on-blue-wood.webp?a=1&b=1&s=612x612&w=0&k=20&c=tkARhRzK8LHukLLp9Fkc2KBmkhSaWMo2LGpK9HZUxCQ=",
    Default: "https://images.unsplash.com/photo-1694825588875-190db201a997?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1hcmtldCUyMHByaWNlcyUyMGZvciUyMGNyb3BzfGVufDB8fDB8fHww"
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generatePriceHistory = (currentPrice) => {
    const history = [];
    let price = currentPrice;
    for (let i = 6; i >= 0; i--) { // 7 days ago to yesterday
        const date = new Date();
        date.setDate(date.getDate() - (i + 1));
        const fluctuation = price * getRandomFloat(-0.08, 0.08, 3); // +/- 8%
        price = Math.max(10, parseFloat((price + fluctuation).toFixed(2)));
        history.push({ date: date.toISOString().split('T')[0], price });
    }
    return history;
};

const generateAPMarketData = () => {
    const markets = [];
    Object.entries(AP_DISTRICTS_TOWNS).forEach(([district, town], index) => {
        const marketId = `ap-market-${index + 1}-${town.toLowerCase().replace(/\s+/g, '-')}`;
        const marketName = `${town} Agricultural Market Yard`;
        const cropsInMarket = [];
        const numCropsInThisMarket = getRandomInt(Math.min(5, CROP_NAMES.length), CROP_NAMES.length); // 5 to All crops
        const shuffledCrops = [...CROP_NAMES].sort(() => 0.5 - Math.random());

        for (let i = 0; i < numCropsInThisMarket; i++) {
            const cropName = shuffledCrops[i];
            const varieties = CROP_VARIETIES[cropName];
            const variety = varieties[getRandomInt(0, varieties.length - 1)];
            const basePrice = getRandomInt(500, 8000); // Price per quintal
            const currentPrice = getRandomFloat(basePrice * 0.85, basePrice * 1.15, 2);
            const priceChangePercent = getRandomFloat(-12, 12, 1);

            cropsInMarket.push({
                id: `${marketId}-crop-${i + 1}-${cropName.toLowerCase().replace(/\s+/g, '-')}`,
                cropName,
                variety,
                image: CROP_IMAGES[cropName] || CROP_IMAGES.Default,
                currentPrice,
                unit: "qtl",
                priceChangePercent,
                priceHistory: generatePriceHistory(currentPrice),
                marketId, // Link back
                marketName, // For convenience
            });
        }

        markets.push({
            id: marketId,
            name: marketName,
            address: `${town}, ${district} District, Andhra Pradesh`,
            town,
            district,
            state: "Andhra Pradesh",
            timings: `${getRandomInt(7,9)}:00 AM - ${getRandomInt(5,7)}:00 PM`,
            contact: `+91-9${getRandomInt(100,999)}${getRandomInt(100000,500000)}`,
            crops: cropsInMarket.sort((a,b) => a.cropName.localeCompare(b.cropName)), // Sort crops alphabetically
        });
    });
    return markets;
};

module.exports = { generateAPMarketData };