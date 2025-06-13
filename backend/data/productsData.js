// backend/data/productsData.js

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const TOTAL_PRODUCTS_TO_GENERATE = 300;

// This is a complete, well-structured template object.
const productTemplates = {
    "Fertilizers": {
        baseNames: ["Urea", "DAP", "NPK 19-19-19", "Potash", "Bio-Fertilizer", "Zinc Sulphate"],
        adjectives: ["High-Yield", "Organic", "Granular", "Water-Soluble", "Fast-Acting", "Eco-Friendly"],
        brands: ["IFFCO", "Coromandel", "Chambal", "KRIBHCO", "AgriLife", "Bio-Prime"],
        units: ["50kg Bag", "25kg Bag", "5kg Pouch", "1L Bottle"],
        priceRange: { min: 300, max: 2500 },
        images: ["https://source.unsplash.com/300x300/?fertilizer,bag", "https://source.unsplash.com/300x300/?agriculture,soil"],
        descriptionTemplates: ["{{name}} is a {{adjective}} fertilizer from {{brand}}, essential for robust plant growth.", "Boost your crop yield with {{name}}. A premium {{adjective}} product by {{brand}}."]
    },
    "Pesticides": {
        baseNames: ["Insecticide", "Fungicide", "Herbicide", "Neem Oil", "Miticide"],
        adjectives: ["Systemic", "Broad-Spectrum", "Organic", "Concentrated", "SafeGuard", "Bio-Safe"],
        brands: ["Bayer", "Syngenta", "UPL", "Crystal Crop", "Dhanuka Agritech", "Bio-Care"],
        units: ["1L Bottle", "500ml Bottle", "250g Powder", "5L Can"],
        priceRange: { min: 400, max: 3500 },
        images: ["https://source.unsplash.com/300x300/?pesticide,bottle", "https://source.unsplash.com/300x300/?spraying,farm"],
        descriptionTemplates: ["Protect your crops with {{name}}, a {{adjective}} solution by {{brand}}.", "{{name}} offers effective pest control. A trusted {{adjective}} formula from {{brand}}."]
    },
    "Seeds": {
        baseNames: ["Hybrid Maize", "BT Cotton", "Basmati Rice", "Hybrid Tomato", "Marigold", "Soybean"],
        adjectives: ["High-Germination", "Drought-Resistant", "Certified", "Prime-Quality", "Early-Harvest", "High-Yielding"],
        brands: ["Mahyco", "Kaveri", "Nuziveedu", "Syngenta", "Pioneer", "AgriGold"],
        units: ["1kg Packet", "500g Packet", "100g Pouch", "Seedling Tray"],
        priceRange: { min: 200, max: 1800 },
        images: ["https://source.unsplash.com/300x300/?seeds,packet", "https://source.unsplash.com/300x300/?seedling,plant"],
        descriptionTemplates: ["Start your season right with {{name}}. {{adjective}} seeds from {{brand}} for a bountiful harvest.", "Get the best results with {{name}}, a pack of {{adjective}} seeds from the house of {{brand}}."]
    },
    "Gardening Tools": {
        baseNames: ["Trowel", "Pruning Shear", "Watering Can", "Hand Weeder", "Gardening Gloves", "Spade"],
        adjectives: ["Heavy-Duty", "Ergonomic", "Stainless Steel", "Rust-Proof", "Durable", "Multi-Purpose"],
        brands: ["Falcon", "Wolf-Garten", "KisanKraft", "Sharpex", "Gardena", "ToolMaster"],
        units: ["Single Piece", "Set of 3", "Pair"],
        priceRange: { min: 150, max: 1200 },
        images: ["https://source.unsplash.com/300x300/?gardening,tools", "https://source.unsplash.com/300x300/?trowel"],
        descriptionTemplates: ["The {{name}} is a {{adjective}} tool by {{brand}}, perfect for all your gardening needs.", "Make gardening easier with the {{adjective}} {{name}} from {{brand}}."]
    },
    "Irrigation Supplies": {
        baseNames: ["Drip Kit", "Sprinkler Head", "PVC Pipe", "Water Pump", "Filter System", "Lay-Flat Hose"],
        adjectives: ["Automated", "Micro-Irrigation", "UV-Protected", "High-Pressure", "Durable", "Efficient"],
        brands: ["Jain Irrigation", "Netafim", "Kisan", "Captain", "Finolex", "AquaFlow"],
        units: ["Full Kit", "10m Roll", "0.5 HP Motor", "Single Unit"],
        priceRange: { min: 500, max: 15000 },
        images: ["https://source.unsplash.com/300x300/?irrigation,pipe", "https://source.unsplash.com/300x300/?water,pump"],
        descriptionTemplates: ["Ensure efficient water management with the {{adjective}} {{name}} from {{brand}}.", "The {{brand}} {{name}} is a high-quality, {{adjective}} solution for your farm."]
    }
};

const generatedProducts = [];
const categories = Object.keys(productTemplates);

if (categories.length > 0) {
    for (let i = 0; i < TOTAL_PRODUCTS_TO_GENERATE; i++) {
        const category = getRandomElement(categories);
        // This is the line that could fail if the template is not found
        const template = productTemplates[category];

        // Safety Check: If for any reason the template is undefined, skip this iteration.
        if (!template) {
            console.warn(`Warning: Could not find template for category "${category}". Skipping product generation.`);
            continue; 
        }

        const baseName = getRandomElement(template.baseNames);
        const adjective = getRandomElement(template.adjectives);
        const brand = getRandomElement(template.brands);
        const unit = getRandomElement(template.units);
        const descriptionTemplate = getRandomElement(template.descriptionTemplates);

        const productName = `${adjective} ${brand} ${baseName} (${unit})`;
        const price = getRandomFloat(template.priceRange.min, template.priceRange.max, 2);
        const description = descriptionTemplate
            .replace('{{name}}', `<strong>${productName}</strong>`)
            .replace('{{adjective}}', adjective.toLowerCase())
            .replace('{{brand}}', brand);

        const discountPercentage = getRandomElement([0, 0, 0, 5, 10, 10, 15, 25]);
        
        const product = {
            _id: `prod_${i + 1}_${Date.now()}`, // Add a unique ID
            name: productName,
            imageUrl: getRandomElement(template.images),
            description: description,
            category: category,
            price: price,
            discount: discountPercentage / 100, 
            stock: getRandomInt(0, 150),
            rating: getRandomFloat(3.9, 5.0, 1)
        };
        
        generatedProducts.push(product);
    }
}

console.log(`Successfully generated ${generatedProducts.length} products.`);

module.exports = generatedProducts;