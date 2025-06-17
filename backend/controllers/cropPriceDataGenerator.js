// backend/controllers/cropPriceDataGenerator.js (Expanded Version)

const STATES_MARKETS = {
    "Karnataka": ["Bangalore (K.R)", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Hassan", "Raichur", "Udupi", "Kolar", "Tumakuru", "Chitradurga", "Hospet", "Gadag"],
    "Maharashtra": ["Mumbai (Vashi)", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Sangli", "Jalgaon", "Latur", "Nanded", "Akola", "Satara", "Ahmednagar", "Dhule"],
    "Tamil Nadu": ["Chennai (Koyambedu)", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Vellore", "Dindigul", "Thanjavur", "Tiruppur", "Hosur", "Nagercoil", "Pollachi", "Karur", "Ooty"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Prayagraj", "Ghaziabad", "Gorakhpur", "Bareilly", "Saharanpur", "Aligarh", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura"],
    "Gujarat": ["Ahmedabad (Jamalpur)", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Mehsana", "Bharuch", "Navsari", "Gandhidham", "Nadiad", "Morbi", "Patan", "Valsad"],
    "West Bengal": ["Kolkata (Koley)", "Asansol", "Siliguri", "Durgapur", "Howrah", "Bardhaman", "Malda", "Medinipur", "Haldia", "Darjeeling", "Bankura", "Purulia", "Cooch Behar", "Jalpaiguri", "Kharagpur", "Shantipur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Firozpur", "Pathankot", "Moga", "Abohar", "Fazilka", "Gurdaspur", "Kapurthala", "Sangrur", "Barnala"],
};

const CROP_VARIETIES = {
    "Paddy (Rice)": ["Sona Masoori", "Basmati", "IR-64"], 
    "Wheat": ["Lokwan", "Sharbati", "HD-2967"], 
    "Maize": ["Hybrid Deccan", "Composite Ganga-5"], 
    "Sorghum (Jowar)": ["Maldandi", "CSH-9"], 
    "Pearl Millet (Bajra)": ["Pusa-322", "ICTP-8203"], 
    "Barley": ["BH-75", "PL-426"], 
    "Chickpea (Gram)": ["Chana Desi", "Kabuli Chana"], 
    "Pigeon Pea (Tur)": ["Maruti", "Asha"], 
    "Lentil (Masoor)": ["Pusa Vaibhav", "WBL-77"], 
    "Mung Bean": ["PDM-139", "Samrat"], 
    "Urad Bean": ["T-9", "Pant U-31"], 
    "Tomato": ["Local", "Hybrid S-22", "Pusa Ruby"], 
    "Potato": ["Kufri Jyoti", "Chipsona-1", "Kufri Bahar"], 
    "Onion": ["Nasik Red", "Bellary Red", "Pusa White"], 
    "Brinjal (Eggplant)": ["Pusa Purple", "Black Beauty"], 
    "Cauliflower": ["Pusa Snowball", "Early Kunwari"], 
    "Cabbage": ["Golden Acre", "Pusa Drumhead"], 
    "Okra (Lady Finger)": ["Pusa Sawani", "Arka Anamika"], 
    "Cucumber": ["Japanese Long", "Poona Khira"], 
    "Carrot": ["Nantes", "Pusa Kesar"], 
    "Radish": ["Pusa Chetki", "Japanese White"], 
    "Bell Pepper": ["California Wonder", "Indra"], 
    "Chilli": ["Guntur Sannam", "Teja", "Byadagi"], 
    "Turmeric": ["Duggirala", "Erode", "Rajapuri"], 
    "Ginger": ["Cochin", "Rio de Janeiro"], 
    "Garlic": ["Yamuna Safed", "Ooty-1"], 
    "Coriander": ["Local Green", "CO-4"], 
    "Mango": ["Banganapalli", "Alphonso", "Totapuri"], 
    "Banana": ["Robusta", "Dwarf Cavendish", "Nendran"], 
    "Grapes": ["Thompson Seedless", "Anab-e-Shahi"], 
    "Pomegranate": ["Bhagwa", "Ganesh"], 
    "Guava": ["Allahabad Safeda", "L-49 (Sardar)"], 
    "Papaya": ["Red Lady", "Coorg Honey Dew"], 
    "Watermelon": ["Sugar Baby", "Kiran"], 
    "Cotton": ["BT Cotton", "MCU-5"], 
    "Sugarcane": ["Co-86032", "Local"], 
    "Soybean": ["JS-335", "MACS-1407"], 
    "Groundnut": ["Kadiri-6", "TMV-2"], 
    "Mustard": ["Pusa Bold", "Varuna"], 
    "Sunflower": ["Morden", "EC-68414"],
};
const CROP_NAMES = Object.keys(CROP_VARIETIES);

const CROP_IMAGES = {
    "Paddy (Rice)": "https://i.pinimg.com/736x/34/b3/ba/34b3ba175159776d0028ffa91edf33b3.jpg", 
    "Wheat": "https://i.pinimg.com/736x/7b/27/df/7b27df6f1ee6527250e5dab00cde5fb2.jpg", 
    "Maize": "https://i.pinimg.com/736x/e9/20/f7/e920f70dfbc8ac565873ec12f2462f89.jpg", 
    "Sorghum (Jowar)": "https://i.pinimg.com/736x/c1/0f/ab/c10fab6d23d9a4efe752ffe5054ff911.jpg", 
    "Pearl Millet (Bajra)": "https://i.pinimg.com/736x/d2/9a/20/d29a20e87247eee405c5b96b1360b460.jpg", 
    "Barley": "https://i.pinimg.com/736x/6b/ee/e4/6beee4afff243ca0684f56c354484074.jpg", 
    "Chickpea (Gram)": "https://i.pinimg.com/736x/72/51/13/725113e9d7d5176d5bdd9b539b75441f.jpg", 
    "Pigeon Pea (Tur)": "https://i.pinimg.com/736x/54/63/48/5463481850b2126e1fe0a33ad8028ee5.jpg", 
    "Lentil (Masoor)": "https://i.pinimg.com/736x/e8/0a/f6/e80af632e77b5acce6128362a328e033.jpg", 
    "Mung Bean": "https://i.pinimg.com/736x/82/8c/22/828c22008068478851478c1dd9acd0e4.jpg", 
    "Urad Bean": "https://i.pinimg.com/736x/70/38/e1/7038e1bd29dfe5289b2a852bc2c07657.jpg", 
    "Tomato": "https://i.pinimg.com/736x/23/3a/7b/233a7b1fe36a2ee6962944cadae1b352.jpg", 
    "Potato": "https://i.pinimg.com/736x/cb/35/8d/cb358d27b980a45dcf5289b0388e6821.jpg",
    "Onion": "https://i.pinimg.com/736x/c1/f2/41/c1f241d44b6e38c9a2a9df7dec8666a7.jpg", 
    "Brinjal (Eggplant)": "https://i.pinimg.com/736x/33/66/14/336614ce156b2748d0a19df5eaf78ae6.jpg", 
    "Cauliflower": "https://i.pinimg.com/736x/e5/bf/11/e5bf11123c2952a5959a982fe2e05d95.jpg", 
    "Cabbage": "https://i.pinimg.com/736x/b1/2a/53/b12a532fa575f03b3be647bdf5ae0192.jpg", 
    "Okra (Lady Finger)": "https://i.pinimg.com/736x/87/48/0a/87480a3980de07e9ccb4d52029f15d2a.jpg", 
    "Cucumber": "https://i.pinimg.com/736x/be/59/4c/be594c454fa561b57f79462b679575ae.jpg", 
    "Carrot": "https://i.pinimg.com/736x/75/5a/a5/755aa59bb0cdeab41636d7a03f79b95c.jpg", 
    "Radish": "https://i.pinimg.com/736x/91/1f/b1/911fb1273f196de6c417923fb7bf5810.jpg", 
    "Bell Pepper": "https://i.pinimg.com/736x/c4/89/d7/c489d7627b31f4c386c4803a3da262f7.jpg", 
    "Chilli": "https://i.pinimg.com/736x/d2/7b/be/d27bbeebecac2536f7386144f03ed1f9.jpg", 
    "Turmeric": "https://i.pinimg.com/736x/d2/08/40/d208403ee2b1e1118a0ace0e3065c639.jpg", 
    "Ginger": "https://i.pinimg.com/736x/b2/77/69/b27769042ef98190cf3a82d759e344c0.jpg", 
    "Garlic": "https://i.pinimg.com/736x/7f/db/f0/7fdbf0e6bfc6d4b56546870acb8a8647.jpg", 
    "Coriander": "https://i.pinimg.com/736x/14/4e/1d/144e1d102c2a7f0db1cb900a18894dcd.jpg", 
    "Mango": "https://i.pinimg.com/736x/38/c3/97/38c397b039d71b4d35aca523e36e0c51.jpg", 
    "Banana": "https://i.pinimg.com/736x/6b/11/e9/6b11e9d088c19ba78390df8f09c04dc0.jpg", 
    "Grapes": "https://i.pinimg.com/736x/2a/9e/f3/2a9ef3385919f75bb6b9ca3cbe561ef5.jpg", 
    "Pomegranate": "https://i.pinimg.com/736x/72/23/7c/72237cf328a8d8ae7cf59d131c2ea6d1.jpg", 
    "Guava": "https://i.pinimg.com/736x/0f/50/73/0f50733420b2fdab2a8ce267d7b3d58b.jpg", 
    "Papaya": "https://i.pinimg.com/736x/5c/04/24/5c042450d9895780cbb022a86f100ff4.jpg", 
    "Watermelon": "https://i.pinimg.com/736x/f5/52/25/f5522551c5a750869e2453979df67264.jpg", 
    "Cotton": "https://i.pinimg.com/736x/3a/50/8a/3a508a9bb91d3a0ce07f5c94a54d5076.jpg", 
    "Sugarcane": "https://i.pinimg.com/736x/e3/53/31/e35331f9abfbd09c726081e1c6f72389.jpg", 
    "Soybean": "https://i.pinimg.com/736x/33/c1/56/33c156da7765d8f841ceaf75d214adb7.jpg", 
    "Groundnut": "https://i.pinimg.com/736x/32/c7/30/32c730d0461376a39e9afc01456892bf.jpg", 
    "Mustard": "https://i.pinimg.com/736x/c2/d9/cd/c2d9cdc15f805c56deadf19ed888fc4e.jpg", 
    "Sunflower": "https://i.pinimg.com/736x/20/de/7c/20de7cd15fb58d2c15841bb71eed8d5b.jpg", 
    "Default": "https://i.pinimg.com/736x/c1/17/ca/c117caed23b2575441ec516c06b2f6ec.jpg",
};

let allCrops = []; let allMarkets = []; let allPrices = [];

const generateData = () => {
    if (allCrops.length > 0) { console.log("Crop price data already generated."); return; }
    console.log("Generating new crop price data...");
    let cropIdCounter = 1; let marketIdCounter = 1; let priceIdCounter = 1;
    allCrops = CROP_NAMES.map(name => ({ id: cropIdCounter++, name: name, imageUrl: CROP_IMAGES[name] || CROP_IMAGES.Default, varieties: CROP_VARIETIES[name] }));
    for (const [state, cities] of Object.entries(STATES_MARKETS)) {
        cities.forEach(city => { allMarkets.push({ id: marketIdCounter++, name: `${city} APMC`, state: state, city: city }); });
    }
    const today = new Date();
    allCrops.forEach(crop => {
        const basePrice = 1000 + Math.random() * 8000;
        allMarkets.forEach(market => {
            if (Math.random() > 0.2) {
                for (let i = 0; i < 30; i++) {
                    const date = new Date(today); date.setDate(today.getDate() - i);
                    const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.4);
                    allPrices.push({ id: priceIdCounter++, cropId: crop.id, marketId: market.id, price: Math.round(price), unit: "Quintal", date: date.toISOString().split('T')[0] });
                }
            }
        });
    });
    console.log(`Generated ${allCrops.length} crops, ${allMarkets.length} markets, and ${allPrices.length} price points.`);
};

const getData = () => ({ allCrops, allMarkets, allPrices });

module.exports = { generateData, getData };