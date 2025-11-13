import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get all design requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('design_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create design request
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customer_name, customer_email, description, file_url } = req.body;
    
    const { data, error } = await supabase
      .from('design_requests')
      .insert([{
        customer_name,
        customer_email,
        description,
        file_url,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update design request with AI-generated design
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { ai_generated_design_url, status } = req.body;
    
    const { data, error } = await supabase
      .from('design_requests')
      .update({ ai_generated_design_url, status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
