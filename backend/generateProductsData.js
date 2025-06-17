const fs = require('fs');
const path = require('path');

const categories = {
  Fertilizers: {
    brands: ['AgroGrow', 'HarvestKing', 'TerraFertil', 'GreenBloom', 'NutriFarm'],
    names: ['NPK Blend', 'Urea Pellets', 'Bio-Organic Mix', 'Super Potash', 'Phosphate Booster'],
    adjectives: ['High-Yield', 'Slow-Release', 'Water-Soluble', 'Eco-Friendly', 'Concentrated']
  },
  Pesticides: {
    brands: ['PestGuard', 'BugOff', 'CropShield', 'MiteAway', 'FungiClear'],
    names: ['Neem Oil Extract', 'Insecticidal Soap', 'Broad-Spectrum Fungicide', 'Natural Herbicide', 'Spider Mite Control'],
    adjectives: ['Organic', 'Fast-Acting', 'Plant-Safe', 'Weather-Resistant', 'Systemic']
  },
  'Gardening Tools': {
    brands: ['GardenPro', 'TerraTools', 'EasyGrip', 'DuraSteel', 'YardMaster'],
    names: ['Hand Trowel', 'Pruning Shears', 'Weeder Fork', 'Leaf Rake', 'Watering Can', 'Digging Spade'],
    adjectives: ['Ergonomic', 'Heavy-Duty', 'Stainless Steel', 'Lightweight', 'Rust-Proof']
  },
  Seeds: {
    brands: ['SeedSupreme', 'HeirloomHarvest', 'SproutWell', 'QuickGrow', 'GardenGems'],
    names: ['Cherry Tomato', 'Marigold Flower', 'Hybrid Spinach', 'Heirloom Carrot', 'Italian Basil', 'Sweet Corn'],
    adjectives: ['Non-GMO', 'High-Germination', 'Organic', 'All-Season', 'Drought-Tolerant']
  }
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateProducts = (count) => {
  const products = [];
  const usedNames = new Set();
  let idCounter = 1;

  while (products.length < count) {
    const categoryName = getRandomElement(Object.keys(categories));
    const catData = categories[categoryName];
    
    const name = `${getRandomElement(catData.brands)} ${getRandomElement(catData.adjectives)} ${getRandomElement(catData.names)}`;
    
    if (usedNames.has(name)) continue;
    usedNames.add(name);

    const description = `Discover the power of ${name}. Specially formulated by ${name.split(' ')[0]} for modern farming and gardening. Ensures healthy growth and bountiful harvests.`;
    const price = parseFloat((Math.random() * (4500 - 150) + 150).toFixed(2));
    const discount = Math.floor(Math.random() * 20) + 5;
    const rating = parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1));
    const image = `https://picsum.photos/seed/${idCounter}/400/300`;

    products.push({
      id: idCounter++,
      name,
      category: categoryName,
      description,
      price,
      discount,
      rating,
      image,
    });
  }
  return products;
};

const products = generateProducts(500);
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

fs.writeFileSync(path.join(dataPath, 'products.json'), JSON.stringify(products, null, 2));
console.log('Successfully generated 500 unique products in data/products.json');