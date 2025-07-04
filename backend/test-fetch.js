require('dotenv').config({path:"./.env"}); 

const apiKey = process.env.SHOPSTYLE_API_KEY;
const endpoint = 'https://api.shopstylecollective.com/api/v2/categories';

function getAllCategories() {
    const params = new URLSearchParams({
        pid: apiKey
    });

    console.log('\nFetching all categories');
    console.log('Params:', params.toString());

    fetch(`${endpoint}?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.categories) {
                console.log('\nAll Categories:');

                data.categories.forEach(category => {
                    console.log(`\n${category.name}`);
                    if (category.subcategories) {
                        category.subcategories.forEach(sub => {
                            console.log(`  ├─ ${sub.name}`);
                            if (sub.subcategories) {
                                sub.subcategories.forEach(subsub => {
                                    console.log(`  │  ├─ ${subsub.name}`);
                                });
                            }
                        });
                    }
                });
            } else {
                console.log("No categories found.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

getAllCategories();