import axios from 'axios';
import type { Basket } from './types';

const baseUrl = import.meta.env.VITE_API_URL;

export const getAllCoffeeTypes = async () => {
  const response = await axios.get(`${baseUrl}/coffee-types`);
  return response;
}

export const getAllIngredients = async () => {
  const response = await axios.get(`${baseUrl}/ingredients`);
  return response;
}

export const getOrders = async () => {
  const response = await axios.get(`${baseUrl}/orders`);
  return response;
}

export const createOrder = async (basket: Basket) => {
  const response = await axios.post(`${baseUrl}/orders`, basket);
  return response;
}

export default {
  getAllCoffeeTypes,
  getAllIngredients,
  getOrders,
  createOrder,
}