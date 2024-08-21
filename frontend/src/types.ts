export type Ingredients = {
  sugar?: number,
  milk?: number,
  cream?: number,
  espressoShots?: number,
  foam?: number,
  hotWater?: number,
  caramel?: number,
};

export type Coffee = {
  key: string;
  name: string;
  ingredients?: Ingredients;
  price: number;
};

export type Order = {
  id: string;
  name: string;
  price: number;
  basket: Coffee[];
  createdAt: string;
  updatedAt: string;
}

export type Basket = { name: string, basket: BasketItem[] };

export type BasketItem = Coffee & { quantity: number };