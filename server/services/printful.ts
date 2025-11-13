import axios from 'axios';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || '';
const PRINTFUL_API_BASE = 'https://api.printful.com';

const printfulClient = axios.create({
  baseURL: PRINTFUL_API_BASE,
  headers: {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export interface PrintfulProductData {
  name: string;
  description: string;
  designUrl: string;
}

export async function createPrintfulProduct(productData: PrintfulProductData) {
  try {
    // 1. Upload design file
    const fileUpload = await printfulClient.post('/files', {
      url: productData.designUrl,
      filename: `${productData.name.replace(/\s/g, '_')}.png`
    });

    const fileId = fileUpload.data.result.id;

    // 2. Create a product (example: t-shirt)
    // Product ID 71 is Bella+Canvas 3001 Unisex T-Shirt
    const product = await printfulClient.post('/store/products', {
      sync_product: {
        name: productData.name,
        thumbnail: productData.designUrl
      },
      sync_variants: [
        {
          retail_price: '24.99',
          variant_id: 4012, // White, S
          files: [
            {
              id: fileId,
              type: 'default'
            }
          ]
        },
        {
          retail_price: '24.99',
          variant_id: 4013, // White, M
          files: [
            {
              id: fileId,
              type: 'default'
            }
          ]
        },
        {
          retail_price: '24.99',
          variant_id: 4014, // White, L
          files: [
            {
              id: fileId,
              type: 'default'
            }
          ]
        }
      ]
    });

    return {
      id: product.data.result.id,
      name: product.data.result.sync_product.name,
      variants: product.data.result.sync_variants
    };
  } catch (error: any) {
    console.error('Printful API error:', error.response?.data || error.message);
    throw new Error(`Printful API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function createPrintfulOrder(orderData: any) {
  try {
    const response = await printfulClient.post('/orders', orderData);
    return response.data.result;
  } catch (error: any) {
    console.error('Printful order error:', error.response?.data || error.message);
    throw new Error(`Printful order error: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function getPrintfulProducts() {
  try {
    const response = await printfulClient.get('/store/products');
    return response.data.result;
  } catch (error: any) {
    console.error('Printful get products error:', error.response?.data || error.message);
    throw new Error(`Printful error: ${error.message}`);
  }
}
