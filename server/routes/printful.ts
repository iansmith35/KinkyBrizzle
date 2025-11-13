import { Router, Request, Response } from 'express';
import { createPrintfulProduct, createPrintfulOrder, getPrintfulProducts } from '../services/printful.js';

const router = Router();

// Get all Printful products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await getPrintfulProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Printful product
router.post('/products', async (req: Request, res: Response) => {
  try {
    const product = await createPrintfulProduct(req.body);
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Printful order
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const order = await createPrintfulOrder(req.body);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
