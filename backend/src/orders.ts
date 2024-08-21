import { Router, Request, Response } from 'express';
import type { Ingredients } from './ingredients';
import db from './db';

export type Order = {
  name: string,
  basket: Array<{ key: string, name: string, price: number, ingredients: Ingredients }>
}

const getOrders = async (req: Request, res: Response) => {
  const orders = await db.order.findMany();
  return res.status(200).json(orders);
}

const createOrder = async (req: Request, res: Response) => {
  try {
    const { name, basket }: Order = req.body;

    if (!name || !basket) {
      return res.status(400).json({ error: 'Name, and basket are required' });
    }

    const price = basket.reduce((acc, item) => acc + item.price, 0);

    const order = await db.order.create({
      data: {
        name,
        price,
        basket: basket,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const router = Router();

router.get('/orders', getOrders);
router.post('/orders', createOrder);

export default router;