require('dotenv').config(); // Load .env variables

const apiKey = process.env.SHOPSTYLE_API_KEY;
const endpoint = 'https://api.shopstylecollective.com/api/v2/products';

function searchProducts(query, category = '', limit = 10) {
  // Build the parameters
  const params = new URLSearchParams({
    pid: apiKey,
    query: query,
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
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Experiment with different queries and categories
searchProducts('pleated skirt', 'womens-skirts'); // With a category (if 'womens-skirts' is valid)
searchProducts('pleated skirt');                   // Without specifying a category
searchProducts('skirt', 'womens-skirts');          // A broader search term with category
searchProducts('pleated', 'womens-skirts');        // Trying a shorter query
