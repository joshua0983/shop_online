require('dotenv').config();

const express = require('express');
const path = require('path');
const apiKey = process.env.SHOPSTYLE_API_KEY;
const apiUsername = process.env.SHOPSTYLE_API_USERNAME;
const endpoint = 'https://api.shopstylecollective.com/api/v2/products'
const app = express();
const port = 3001;
const cors = require('cors');
const productCache = new Map();
const nameCache = new Set(); // Add a Set to track product names

const MAKEUP_CATEGORIES = [
    'beauty-makeup',           
    'beauty-face-makeup',       
    'beauty-eye-makeup',       
    'beauty-lip-makeup',       
    'beauty-makeup-tools',     
];

const MAKEUP_KEYWORDS = [
    'makeup', 'cosmetic', 'lipstick', 'mascara', 'foundation', 
    'eyeshadow', 'blush', 'bronzer', 'concealer', 'powder', 
    'eyeliner', 'brow', 'highlighter', 'contour', 'primer',
    'palette', 'beauty', 'makeover', 'cosmetics'
];

app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const isMakeupProduct = (product) => {
    const nameMatch = MAKEUP_KEYWORDS.some(keyword => 
        product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const categoryMatch = product.categories.some(category =>
        MAKEUP_KEYWORDS.some(keyword => 
            category.name.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    
    return nameMatch || categoryMatch;
};

// Modify the search endpoint's data processing
app.get('/search', (req, res) => {
    // Get search parameters from query string
    console.log('Received search request:', req.query);
    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Build URL parameters using free-text search parameter ("fts")
    const params = new URLSearchParams({
        pid: apiKey,
        fts: query,
        limit: limit,
        offset: offset,
        cat: 'beauty-makeup'  // Add this line to filter for makeup category
    });
    
    console.log(`\nFetching makeup products for query "${query}"`);
    console.log('Params:', params.toString());
    
    fetch(`${endpoint}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products && data.products.length > 0) {
                const results = data.products
                    .filter(product => isMakeupProduct(product)) // Add this filter
                    .map(product => {
                        if (productCache.has(product.id)) {
                            console.log(`Product ${product.id} already cached`);
                            return null;
                        }

                        if (nameCache.has(product.name)) {
                            console.log(`Product name "${product.name}" already exists`);
                            return null;
                        }

                        const productName = product.name;
                        let productImage = '';
                        
                        if (product.image && product.image.sizes) {
                            if (product.image.sizes.Best && product.image.sizes.Best.url) {
                                productImage = product.image.sizes.Best.url;
                            } else if (product.image.sizes.Original && product.image.sizes.Original.url) {
                                productImage = product.image.sizes.Original.url;
                            }
                        }
                        
                        const productCategories = product.categories 
                            ? product.categories.map(cat => cat.name).join(', ')
                            : 'No category info';
                            
                        const processedProduct = {
                            id: product.id,
                            name: productName,
                            image: productImage,
                            categories: productCategories
                        };

                        productCache.set(product.id, processedProduct);
                        nameCache.add(productName);
                        return processedProduct;
                    }).filter(Boolean);

                console.log(`Found ${results.length} unique makeup products for query "${query}"`);
                res.json({ products: results });
            } else {
                console.log("No makeup products found.");
                res.json({ message: "No makeup products found." });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        });
});

app.get('/trending/makeup', (req, res) => {
    const params = new URLSearchParams({
        pid: apiKey,
        cat: 'beauty-makeup',
        limit: 10,
        sort: 'Popular'
    });
  
    
    fetch(`${endpoint}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products && data.products.length > 0) {
                const results = data.products
                    .filter(product => isMakeupProduct(product))
                    .map(product => {
                        const productName = product.name;
                        let productImage = '';
                        
                        if (product.image && product.image.sizes) {
                            if (product.image.sizes.Best && product.image.sizes.Best.url) {
                                productImage = product.image.sizes.Best.url;
                            } else if (product.image.sizes.Original && product.image.sizes.Original.url) {
                                productImage = product.image.sizes.Original.url;
                            }
                        }
                        
                        return {
                            id: product.id,
                            name: productName,
                            image: productImage,
                            categories: product.categories.map(cat => cat.name).join(', ')
                        };
                    });
                
                res.json({ products: results });
            } else {
                res.json({ products: [] });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        });
});

app.get('/makeup-categories', (req, res) => {
    const categoriesEndpoint = 'https://api.shopstylecollective.com/api/v2/categories';
    const params = new URLSearchParams({ pid: apiKey });

    fetch(`${categoriesEndpoint}?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
          
            let makeupCats = [];
            if (data && data.categories) {
                // Try to find "Beauty" or "Makeup" as a main category
                const beauty = data.categories.find(cat =>
                    cat.name.toLowerCase().includes('beauty')
                );
                if (beauty && beauty.subcategories) {
                    // Find "Makeup" under Beauty
                    const makeup = beauty.subcategories.find(sub =>
                        sub.name.toLowerCase().includes('makeup')
                    );
                    if (makeup && makeup.subcategories) {
                        makeupCats = makeup.subcategories.map(sub => sub.name);
                    } else if (makeup) {
                        makeupCats = [makeup.name];
                    }
                }
            }
            res.json({ categories: makeupCats });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

