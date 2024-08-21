import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";

// routes
import coffeeTypesRoutes from './coffee-types';
import ingredientsRoutes from './ingredients';
import ordersRoutes from './orders';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

app.use(coffeeTypesRoutes);
app.use(ingredientsRoutes);
app.use(ordersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export { app, prisma };
