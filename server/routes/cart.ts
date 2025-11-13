import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get cart by session ID
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('session_id', req.params.sessionId);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { session_id, product_id, quantity, size, color } = req.body;
    
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', session_id)
      .eq('product_id', product_id)
      .eq('size', size)
      .eq('color', color)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ session_id, product_id, quantity, size, color }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', req.params.sessionId);

    if (error) throw error;
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
