# Shopify Product Fetcher

This Node.js script fetches products from a Shopify store based on a provided product name, lists the variants of these products, and sorts them by price.

## Prerequisites

- Node.js >=16 installed on your machine
- Shopify Admin API access token
- Store URL

## Installation

1. Clone the repository or download the code.
2. Navigate to the project directory.
3. Install the required packages:

    ```bash
    npm install
    ```

## Setup

1. Create a `.env` file in the root of your project and add the following environment variables:

    ```plaintext
    SHOPIFY_API_URL=https://MY_SHOPIFY_STORE.myshopify.com/ 
    ADMIN_TOKEN= MY_ADMIN_TOKEN
    ```

    Replace the values with your Shopify store URL and Admin API access token.

## Usage

Run the script with the following command:

```bash
node app.js --name <product-name>
