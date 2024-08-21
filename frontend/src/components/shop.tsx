import { useState, useRef, useEffect } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import api from '../api';
import CoffeeItem from './coffee-item';

import type { Coffee, Order, BasketItem } from '../types';

const Shop = () => {
  const [orderName, setOrderName] = useState<string>("");
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [placedOrder, setPlacedOrder] = useState<Order[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [ingredientList, setIngredientList] = useState<[]>([]);
  const [isLoadingCoffees, setIsLoadingCoffees] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const toast = useRef<Toast>(null);

  const handleAddToBasket = (coffee: Coffee, quantity: number) => {
    const itemsToAdd = Array(quantity).fill(coffee);
    setBasket((prevBasket) => [...prevBasket, ...itemsToAdd]);
  };

  const handlePlaceOrder = async () => {
    const parsedOrderName = orderName.trim();

    if (!parsedOrderName) {
      alert('Please enter your name');
      return;
    }

    try {
      await api.createOrder({ name: parsedOrderName, basket })
      setBasket([]);
      setOrderName('')
      await setOrders();
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Order placed successfully!' });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to place order. Please try again.' });
    }
  };

  const setOrders = async () => {
    setIsLoadingOrders(true);
    await api.getOrders().then((data) => {
      setPlacedOrder(data.data);
      setIsLoadingOrders(false);
    }).catch(() => {
      setIsLoadingOrders(false);
    });
  };

  useEffect(() => {
    setIsLoadingCoffees(true);
    api.getAllCoffeeTypes().then((data) => {
      setCoffees(data.data);
      setIsLoadingCoffees(false);
    }).catch(() => {
      setIsLoadingCoffees(false);
    });

    setOrders();

    api.getAllIngredients().then((data) => setIngredientList(data.data))
  }, []);

  const mappedBasket = Object.entries(
    basket.reduce((acc, item) => {
      acc[item.key] = acc[item.key]
        ? { ...acc[item.key], quantity: acc[item.key].quantity + 1 }
        : { ...item, quantity: 1 };
      return acc;
    }, {} as Record<string, BasketItem>)
  )

  return (
    <div id="shop" className="container py-10 mx-auto">
      <div className="flex gap-x-[20px]">
        <div className="w-[65%]">
          <h1 className="text-xl font-bold mb-4">Select Your Coffee</h1>
          {isLoadingCoffees ? (
            <div className="col-span-3 text-center">
              <i className="pi pi-spin pi-spinner text-4xl"></i>
              <p className="loading-coffees">Loading coffees...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {coffees.map((coffee, i) => (
                <CoffeeItem key={i} coffee={coffee} ingredientList={ingredientList} onAddToBasket={handleAddToBasket} />
              ))}
              <CoffeeItem
                key="custom"
                ingredientList={ingredientList}
                onAddToBasket={handleAddToBasket}
              />
            </div>
          )}
        </div>
        <div className="w-[35%]">
          <div className="sticky top-10 bg-white flex flex-col items-center rounded shadow p-6 h-screen overflow-y-auto">
            <div className="text-xl font-bold">Your Basket</div>
            {basket.length === 0 ? (
              <div className="mt-4 text-center">
                <i className="pi pi-shopping-cart text-6xl"></i>
                <p className="mt-4">Your Basket Is Empty</p>
              </div>
            ) : (
              <>
                <ul className="mt-4 w-full">
                  {mappedBasket.map(([, item], i) => (
                    <li key={i} className="flex justify-between border-b py-2">
                      <div>{item.name} x{item.quantity}</div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 w-full text-right font-bold">
                  Total: $
                  {basket.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </div>
                <InputText className="w-full my-4 name-field" placeholder="Please put your name here" onChange={(e) => setOrderName(e.target.value)} />
                <Button
                  onClick={handlePlaceOrder}
                  label="Place Order"
                  icon="pi pi-check"
                  className="mt-4 flex-shrink-0 w-full"
                />
              </>
            )}

            <div className="text-xl font-bold border-t mb-5 mt-5">Your Orders</div>

            {isLoadingOrders ? (
              <div className="text-center">
                <i className="pi pi-spin pi-spinner text-4xl"></i>
                <p>Loading orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {placedOrder.map((order, index) => (
                  <div key={order.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Order {index + 1}</h2>
                    <ul>
                      <li><strong>ID:</strong> {order.id}</li>
                      <li><strong>Name:</strong> {order.name}</li>
                      <li><strong>Price:</strong> ${order.price.toFixed(2)}</li>
                      <li><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</li>
                      <li><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</li>
                      <li className="mt-2"><strong>Basket:</strong></li>
                      <ul className="ml-4 mt-2">
                        {order.basket.map((item) => (
                          <li key={item.key} className="mb-2">
                            <div><strong>Drink:</strong> {item.name} (${item.price.toFixed(2)})</div>
                            <div><strong>Ingredients:</strong></div>
                            <ul className="ml-4">
                              {item.ingredients && Object.entries(item.ingredients).map(([ingredient, amount]) => (
                                <li key={ingredient}>
                                  {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: {amount}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Shop;