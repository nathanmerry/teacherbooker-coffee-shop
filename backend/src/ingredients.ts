import { Router, Request, Response } from 'express';

const router = Router();

export type Ingredients = {
  sugar?: number,
  milk?: number,
  cream?: number,
  espressoShots?: number,
  foam?: number,
  hotWater?: number,
  caramel?: number,
}

const ingredients = [
  { key: 'sugar', name: 'Sugar' },
  { key: 'milk', name: 'Milk' },
  { key: 'cream', name: 'Cream' },
  { key: 'espressoShots', name: 'Espresso Shots' },
  { key: 'foam', name: 'Foam' },
  { key: 'hotWater', name: 'Hot Water' },
  { key: 'caramel', name: 'Caramel' }
]

router.get('/ingredients', (_: Request, res: Response) => {
  res.json(ingredients);
});

export default router;
