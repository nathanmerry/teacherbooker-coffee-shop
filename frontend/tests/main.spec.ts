import { test, expect } from '@playwright/test';

test('coffees should load from the database with the correct names and prices', async ({ page }) => {
  await page.goto('http://localhost:5174');

  await expect(page.locator('#shop')).toBeVisible();
  const coffeeItems = page.locator('.coffee-item');

  const coffees = ['Latte', 'Macchiato', 'Espresso', 'Americano', 'Flat White', 'Custom Coffee']
  const coffeeNames = await coffeeItems.evaluateAll(items =>
    items.map(item => item.querySelector('.coffee-name')?.textContent)
  );
  coffees.forEach(coffee => expect(coffeeNames).toContain(coffee));

  const prices = ['$4', '$4.5', '$3', '$3.5', '$4.2', '$5']
  const loadedPrices = await coffeeItems.evaluateAll(items =>
    items.map(item => item.querySelector('.coffee-price')?.textContent)
  );
  prices.forEach(price => expect(loadedPrices).toContain(price));
});

test('you should be able to customise coffees and place the order', async ({ page, request }) => {
  await page.goto('http://localhost:5174');

  const coffeeItems = page.locator('.coffee-item');

  await coffeeItems.first().click();

  const dialogTitle = page.locator('.p-dialog-title');
  await expect(dialogTitle).toBeVisible();
  await expect(dialogTitle).toHaveText('Latte')

  await page.locator('input.p-inputnumber-input').first().fill('10');
  await page.locator('input.p-inputnumber-input').nth(1).fill('10');

  await page.click('.add-to-basket');
  await page.locator('input.name-field').first().fill('some name');

  await page.waitForTimeout(500);

  let postRequestMade = false;
  let postRequestPayload: any | null = null;
  let postResponseStatus: number | null = null;
  let postResponseBody: any = null;

  page.on('request', async request => {
    if (request.url() === 'http://localhost:3132/orders' && request.method() === 'POST') {
      postRequestMade = true;
      postRequestPayload = request.postDataJSON();
    }
  });

  page.on('response', async response => {
    if (response.url() === 'http://localhost:3132/orders' && response.request().method() === 'POST') {
      postResponseStatus = response.status();
      postResponseBody = await response.json();
    }
  });

  await page.locator('button[aria-label="Place Order"]').click();

  await page.waitForTimeout(1000);

  expect(postRequestMade).toBe(true);
  expect(postRequestPayload).not.toBeNull();
  expect(postResponseStatus).toBe(201);
  expect(postResponseBody).not.toBeNull();

  expect(postRequestPayload).toEqual(expect.objectContaining({
    name: 'some name',
    basket: expect.arrayContaining([
      expect.objectContaining({
        key: 'latte',
        name: 'Latte',
        ingredients: expect.objectContaining({
          foam: 1,
          milk: 2,
          cream: 0,
          sugar: 10,
          espressoShots: 1
        }),
        price: 4
      })
    ])
  }));

  expect(postResponseBody).toEqual(expect.objectContaining({
    id: expect.any(String),
    name: 'some name',
    basket: expect.arrayContaining([
      expect.objectContaining({
        key: 'latte',
        name: 'Latte',
        price: 4,
        ingredients: expect.objectContaining({
          foam: 1,
          milk: 2,
          cream: 0,
          sugar: 10,
          espressoShots: 1
        })
      })
    ]),
    price: 40,
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  }));

  const orderId = postResponseBody.id;

  const response = await request.get('http://localhost:3132/orders');
  expect(response.status()).toBe(200);
  
  const orders = await response.json();
  const order = orders.find((order: any) => order.id === orderId);
  
  expect(order).toBeDefined();
  expect(order).toEqual(expect.objectContaining({
    id: orderId,
    name: 'some name',
    price: 40
  }));

  // could also test by fetching the backend and checking if the order is there
});

