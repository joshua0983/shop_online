const express = require('express');
const apiKey = process.env.SHOPSTYLE_API_KEY;
const apiUsername = process.env.SHOPSTYLE_API_USERNAME;
const endpoint = 'https://api.shopstylecollective.com/api/v2/products'
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const params = new URLSearchParams({
    pid: apiKey,         
    query: 'clothing'    
  });

fetch(`${endpoint}?${params.toString()}`)
  .then(response => response.json())
  .then(data => {
    console.log('Products:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

