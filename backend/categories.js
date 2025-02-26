require('dotenv').config(); // Load .env variables

const apiKey = process.env.SHOPSTYLE_API_KEY;
const categoriesEndpoint = 'https://api.shopstylecollective.com/api/v2/categories';

fetch(`${categoriesEndpoint}?pid=${apiKey}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // The response might be an array or an object with a 'categories' property.
    let categories = [];
    if (Array.isArray(data)) {
      categories = data;
    } else if (data.categories) {
      categories = data.categories;
    }
    console.log('Categories:');
    categories.forEach(cat => {
      console.log(`Name: ${cat.name}, ID: ${cat.id}`);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
