import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../constants';

export class CartPage extends BasePage {
  protected readonly path = ROUTES.CART;

  // Header & Controls
  readonly pageTitle: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  // Cart Items
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartQuantities: Locator;

  constructor(page: Page) {
    super(page, 'CartPage');
    this.pageTitle = page.locator('.title');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');

    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartQuantities = page.locator('[data-test="item-quantity"]');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Returns count of line items currently present in the cart
   */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Returns all item names listed in the cart
   */
  async getAllItemNames(): Promise<string[]> {
    return await this.cartItemNames.allInnerTexts();
  }

  /**
   * Returns all item prices listed in the cart as numbers
   */
  async getAllItemPrices(): Promise<number[]> {
    const prices = await this.cartItemPrices.allInnerTexts();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Removes a specific item from the cart by its name
   */
  async removeItemByName(productName: string): Promise<void> {
    this.logger.info(`Removing "${productName}" from cart`);
    const item = this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    const removeBtn = item.locator('button', { hasText: /Remove/i });
    await this.clickElement(removeBtn, `Remove button for "${productName}"`);
  }

  /**
   * Returns to the inventory catalog
   */
  async continueShopping(): Promise<void> {
    this.logger.info('Returning to catalog via Continue Shopping');
    await this.clickElement(this.continueShoppingButton, 'Continue Shopping button');
  }

  /**
   * Proceeds to the checkout flow (Step One)
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Proceeding to checkout');
    await this.clickElement(this.checkoutButton, 'Checkout button');
  }

  /**
   * Asserts whether a specific product name is present in the cart
   */
  async expectItemInCart(productName: string): Promise<void> {
    const item = this.cartItemNames.filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  /**
   * Asserts cart is completely empty
   */
  async expectCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
}
