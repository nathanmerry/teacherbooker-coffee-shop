import { Router, Request, Response } from 'express';
import db from './db';

const router = Router();

const getCoffeeTypes = async (_req: Request, res: Response) => {
  const coffeeTypes = await db.coffeeType.findMany();
  return res.status(200).json(coffeeTypes);
}

router.get('/coffee-types', getCoffeeTypes);

export default router;
