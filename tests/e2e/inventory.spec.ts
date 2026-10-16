import { test, expect } from '../../src/fixtures/testBase';
import { SORT_OPTIONS } from '../../src/constants';
import { PRODUCT_CATALOG } from '../../src/data/testData';

test.describe('Inventory Catalog & Product Interactions', () => {
  test('TC-INV-01: Display all catalog items with valid metadata', async ({ loggedInPage }) => {
    const { inventoryPage } = loggedInPage;

    const names = await inventoryPage.getAllItemNames();
    expect(names.length).toBe(PRODUCT_CATALOG.length);

    for (const expectedProduct of PRODUCT_CATALOG) {
      expect(names).toContain(expectedProduct.name);
    }
  });

  test('TC-INV-02: Add product to cart updates badge count and button state', async ({
    loggedInPage,
  }) => {
    const { inventoryPage } = loggedInPage;
    const targetProduct = PRODUCT_CATALOG[0].name; // Sauce Labs Backpack

    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.addItemToCart(targetProduct);

    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    expect(await inventoryPage.isItemInCartState(targetProduct)).toBe(true);
  });

  test('TC-INV-03: Remove product directly from inventory view', async ({ loggedInPage }) => {
    const { inventoryPage } = loggedInPage;
    const targetProduct = PRODUCT_CATALOG[1].name; // Sauce Labs Bike Light

    await inventoryPage.addItemToCart(targetProduct);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeItemFromCart(targetProduct);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    expect(await inventoryPage.isItemInCartState(targetProduct)).toBe(false);
  });

  test('TC-INV-04: Add multiple products to cart simultaneously', async ({ loggedInPage }) => {
    const { inventoryPage } = loggedInPage;
    const itemsToAdd = [PRODUCT_CATALOG[0].name, PRODUCT_CATALOG[1].name, PRODUCT_CATALOG[2].name];

    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCart(item);
    }

    expect(await inventoryPage.getCartBadgeCount()).toBe(itemsToAdd.length);
  });

  test('TC-INV-05: Sort catalog by Name (A to Z) and Name (Z to A)', async ({ loggedInPage }) => {
    const { inventoryPage } = loggedInPage;

    // Default or explicitly A to Z
    await inventoryPage.selectSortOption(SORT_OPTIONS.NAME_AZ);
    const namesAsc = await inventoryPage.getAllItemNames();
    const sortedAscExpected = [...namesAsc].sort((a, b) => a.localeCompare(b));
    expect(namesAsc).toEqual(sortedAscExpected);

    // Sort Z to A
    await inventoryPage.selectSortOption(SORT_OPTIONS.NAME_ZA);
    const namesDesc = await inventoryPage.getAllItemNames();
    const sortedDescExpected = [...namesAsc].sort((a, b) => b.localeCompare(a));
    expect(namesDesc).toEqual(sortedDescExpected);
  });

  test('TC-INV-06: Sort catalog by Price (Low to High) and Price (High to Low)', async ({
    loggedInPage,
  }) => {
    const { inventoryPage } = loggedInPage;

    // Price Low to High
    await inventoryPage.selectSortOption(SORT_OPTIONS.PRICE_LOW_HIGH);
    const pricesAsc = await inventoryPage.getAllItemPrices();
    const expectedAsc = [...pricesAsc].sort((a, b) => a - b);
    expect(pricesAsc).toEqual(expectedAsc);

    // Price High to Low
    await inventoryPage.selectSortOption(SORT_OPTIONS.PRICE_HIGH_LOW);
    const pricesDesc = await inventoryPage.getAllItemPrices();
    const expectedDesc = [...pricesDesc].sort((a, b) => b - a);
    expect(pricesDesc).toEqual(expectedDesc);
  });

  test('TC-INV-07: Navigate into product details and return to catalog', async ({
    loggedInPage,
  }) => {
    const { inventoryPage } = loggedInPage;
    const targetProduct = PRODUCT_CATALOG[0];

    await inventoryPage.openProductDetails(targetProduct.name);
    await expect(inventoryPage.itemDetailName).toHaveText(targetProduct.name);
    await expect(inventoryPage.itemDetailPrice).toContainText(targetProduct.price.toFixed(2));

    await inventoryPage.backToProducts();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('TC-INV-08: Reset application state clears cart contents', async ({ loggedInPage }) => {
    const { inventoryPage } = loggedInPage;

    await inventoryPage.addItemToCart(PRODUCT_CATALOG[0].name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.resetAppState();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
