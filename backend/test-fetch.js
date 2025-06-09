require('dotenv').config({path:"./.env"}); 

const apiKey = process.env.SHOPSTYLE_API_KEY;
const endpoint = 'https://api.shopstylecollective.com/api/v2/products';

function searchProducts(query, category = '', limit = 10) {
  // Build the parameters
  const params = new URLSearchParams({
    pid: apiKey,
    fts: query,
    limit: limit
  });
  
  // Optionally add a category if provided
  if (category) {
    params.append('category', category);
  }
  
  console.log(`\nFetching products for query "${query}" ${category ? 'in category "' + category + '"' : ''}`);
  console.log('Params:', params.toString());
  
  // Make the API call
  fetch(`${endpoint}?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
        console.log(`Results for "${query}"${category ? ' in "' + category + '"' : ''}:`);
        if (data && data.products && data.products.length > 0) {
          data.products.forEach(product => {
            // Get the product name
            const productName = product.name;
            
            // Choose an image URL, preferring the "Large" size if available
            let productImage = '';
            if (product.image && product.image.sizes) {
              if (product.image.sizes.Large && product.image.sizes.Large.url) {
                productImage = product.image.sizes.Large.url;
              } else if (product.image.sizes.Original && product.image.sizes.Original.url) {
                productImage = product.image.sizes.Original.url;
              } else if (product.image.sizes.Medium && product.image.sizes.Medium.url) {
                productImage = product.image.sizes.Medium.url;
              }
            }
            
            // Get the categories as a comma-separated list
            const productCategories = product.categories 
              ? product.categories.map(cat => cat.name).join(', ')
              : 'No category info';
            
            console.log(`Name: ${productName}`);
            console.log(`Image: ${productImage}`);
            console.log(`Categories: ${productCategories}`);
            console.log('--------------------------');
          });
        } else {
          console.log("No products found.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Experiment with different queries and categories
  searchProducts('tinted moisturizer', ''); // Example: broader search term with category