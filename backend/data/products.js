// ... (all the helper functions like getRandomElement, etc. remain the same) ...
const TOTAL_PRODUCTS_TO_GENERATE = 320;
// ... (productTemplates blueprint also remains the same) ...

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const productTemplates = { /* ... your full productTemplates object ... */ };

const generatedProducts = [];
const categories = Object.keys(productTemplates);

for (let i = 0; i < TOTAL_PRODUCTS_TO_GENERATE; i++) {
    const category = getRandomElement(categories);
    const template = productTemplates[category];

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

    // Generate discount as a decimal (e.g., 0.10, 0.25)
    const discountPercentage = getRandomElement([0, 0, 0, 0, 5, 5, 10, 10, 15, 20, 25]);
    
    const product = {
        name: productName,
        // UPDATED field name: imageUrl
        imageUrl: getRandomElement(template.images),
        description: description,
        category: category,
        price: price,
        // UPDATED discount format to decimal
        discount: discountPercentage / 100, 
        // UPDATED field name: stock
        stock: getRandomInt(0, 250), // Allow for some products to be out of stock
        rating: getRandomFloat(3.8, 5.0, 1)
    };
    
    generatedProducts.push(product);
}

module.exports = generatedProducts;