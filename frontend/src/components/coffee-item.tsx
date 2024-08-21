import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import type { Coffee, Ingredients } from '../types';

type CoffeeItemProps = {
  coffee?: Coffee;
  ingredientList: { name: string, key: string }[];
  onAddToBasket: (coffee: Coffee, quantity: number) => void;
}

const CoffeeItem: React.FC<CoffeeItemProps> = ({ coffee, ingredientList = [], onAddToBasket }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [customizedCoffee, setCustomizedCoffee] = useState<Coffee>({
    key: coffee?.key || 'custom',
    name: coffee?.name || 'Custom Coffee',
    ingredients: coffee?.ingredients || {} as Ingredients,
    price: coffee?.price || 5,
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (coffee) {
      const loadImage = async () => {
        try {
          const imageModule = await import(`../assets/images/coffees/${coffee.key}.webp`);
          setImageSrc(imageModule.default);
        } catch (error) {
          const imageModule = await import(`../assets/images/coffees/flatWhite.webp`);
          setImageSrc(imageModule.default);
          console.error(`Image not found for key: ${coffee.key}`, error);
        }
      };
      loadImage();
    }
  }, [coffee]);

  const handleCustomizationChange = (key: string, value: number | null | undefined) => {
    setCustomizedCoffee({
      ...customizedCoffee,
      ingredients: {
        ...customizedCoffee.ingredients,
        [key]: value,
      },
    });
  };

  const handleAddToBasket = () => {
    onAddToBasket(customizedCoffee, quantity);
    setIsDialogVisible(false);
    setQuantity(1);
  };

  return (
    <>
      <div
        className="coffee-item border shadow flex flex-col bg-white rounded px-4 py-4 cursor-pointer"
        onClick={() => setIsDialogVisible(true)}
      >
        {customizedCoffee?.key === 'custom'
          ? <div className="flex flex-1 text-center items-center justify-center h-full"><i className="pi pi-pencil flex-1 text-4xl"></i></div>
          : <img src={imageSrc} alt={customizedCoffee.name} className="w-full h-auto" />
        }
        <div className="font-bold mt-2 coffee-name">{customizedCoffee.name}</div>
        <div className="font-bold mt-2 coffee-price">${customizedCoffee.price}</div>
      </div>

      <Dialog
        header={customizedCoffee.name}
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
      >
        <div className="">
          <div className="mb-4">
            <label className="block mb-2 font-bold">Quantity</label>
            <InputNumber
              value={quantity}
              onValueChange={(e) => setQuantity(e.value ?? 1)}
              min={1}
              showButtons
              buttonLayout="horizontal"
              className="text-center"
              decrementButtonClassName="border"
              incrementButtonClassName="border"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
          <Button label="Add to Basket" className="w-full add-to-basket" icon="pi pi-check" onClick={handleAddToBasket} />

          <div className="text-lg font-bold my-5 text-center">Customise Your Drink</div>
          {ingredientList.map((ingredient, i: number) => {
            return (
              <div key={i} className="mb-4">
                <label className="font-bold block mb-2">{ingredient.name}</label>
                <InputNumber
                  className="w-full"
                  value={customizedCoffee.ingredients?.[ingredient.key as keyof Ingredients] || 0}
                  onValueChange={(e) => handleCustomizationChange(ingredient.key, e.value)}
                  min={0}
                  max={100}
                  showButtons
                />
              </div>
            );
          })}
        </div>
      </Dialog>
    </>
  );
};

export default CoffeeItem;
