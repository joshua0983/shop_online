require('dotenv').config();

const express = require('express');
const path = require('path');
const apiKey = process.env.SHOPSTYLE_API_KEY;
const apiUsername = process.env.SHOPSTYLE_API_USERNAME;
const endpoint = 'https://api.shopstylecollective.com/api/v2/products'
const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.get('/search', (req, res) => {
    // Get search parameters from query string
    console.log('Received search request:', req.query);
    const query = req.query.query || '';
    const category = req.query.category || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Build URL parameters using free-text search parameter ("fts")
    const params = new URLSearchParams({
      pid: apiKey,
      fts: query,
      limit: limit,
      offset: offset
    });
    
    if (category) {
      params.append('category', category);
    }
    
    console.log(`\nFetching products for query "${query}" ${category ? 'in category "' + category + '"' : ''}`);
    console.log('Params:', params.toString());
    
    // Fetch products from the ShopStyle API
    fetch(`${endpoint}?${params.toString()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Map over the returned products to only return the desired fields
        if (data && data.products && data.products.length > 0) {
          const results = data.products.map(product => {
            const productName = product.name;
            let productImage = '';
            
            // Get the best quality image available
            if (product.image && product.image.sizes) {
              if (product.image.sizes.Best && product.image.sizes.Best.url) {
                productImage = product.image.sizes.Best.url;
              } else if (product.image.sizes.Original && product.image.sizes.Original.url) {
                productImage = product.image.sizes.Original.url;
              } else if (product.image.sizes.Large && product.image.sizes.Large.url) {
                productImage = product.image.sizes.Large.url;
              } else if (product.image.sizes.Medium && product.image.sizes.Medium.url) {
                productImage = product.image.sizes.Medium.url;
              }
            }
            
            const productCategories = product.categories 
              ? product.categories.map(cat => cat.name).join(', ')
              : 'No category info';
              
            return {
              name: productName,
              image: productImage,
              categories: productCategories
            };
          });
          console.log(`Results for "${query}"`);
          res.json({ products: results });
        } else {
          console.log("No products found.");
          res.json({ message: "No products found." });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
      });
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

