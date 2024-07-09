// DOTENV   
require('dotenv').config(); 
const axios = require('axios');


// CAPTURE THE PRODUCT NAME
const args = process.argv.slice(2);
if (args.length < 2 || args[0] !== '--name') {
    console.error('Usage: node app.js --name <product-name>');
    process.exit(1);
}
const productName = args[1];
const { SHOPIFY_API_URL, ADMIN_TOKEN } = process.env;
// CHECK IF SHOPIFY_API_URL AND ADMIN_TOKEN ARE PROVIDED        
if(!SHOPIFY_API_URL || !ADMIN_TOKEN) {
    console.error('SHOPIFY_API_URL and ADMIN_TOKEN must be provided in .env file : for more info Read Readme.md file   ');
    process.exit(1);

}




// get PRODUCTS
const getProducts = async (name, query) => {
    try {
        const response = await axios.post(
            SHOPIFY_API_URL+'/admin/api/2024-07/graphql.json',
            {
                query: query,
                variables: {
                    productName: name,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_TOKEN,
                },
            }
        );

        return response.data.data.products.edges;
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

// FORMAT AND SORT VARIANTS
const formatAndSortVariants = (products) => {
    const variants = [];
    products.forEach((product) => {
        const productTitle = product.node.title;
        product.node.variants.edges.forEach((variant) => {
            variants.push({
                productTitle,
                variantTitle: variant.node.title,
                price: parseFloat(variant.node.price),
            });
        });
    });

    return variants.sort((a, b) => a.price - b.price);
};

// DISPLAY VARIANTS
const displayVariants = (variants) => {
    variants.forEach((variant) => {
        console.log(`${variant.productTitle} - ${variant.variantTitle} - price $${variant.price.toFixed(2)}`);
    });
};


// MAIN FUNCTION
const main = async () => {
    try {
        const query = `
        query($productName: String!) {
            products(first: 10, query: $productName) {
            edges {
                node {
                title
                variants(first: 10) {
                    edges {
                    node {
                        title
                        price
                    }
                    }
                }
                }
            }
            }
        }
        `;
        const products = await getProducts(productName, query);
        const sortedVariants = formatAndSortVariants(products);
        displayVariants(sortedVariants);
    } catch (error) {
        console.error('Error:', error);
    }
};

main();
