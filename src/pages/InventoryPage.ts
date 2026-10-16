import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, SortOption } from '../constants';

export class InventoryPage extends BasePage {
  protected readonly path = ROUTES.INVENTORY;

  // Header & Navigation
  readonly pageTitle: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly activeSortOption: Locator;

  // Side Menu
  readonly menuButton: Locator;
  readonly menuCloseButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly allItemsLink: Locator;

  // Inventory list
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;

  // Product detail view
  readonly backToProductsButton: Locator;
  readonly itemDetailName: Locator;
  readonly itemDetailPrice: Locator;

  constructor(page: Page) {
    super(page, 'InventoryPage');
    this.pageTitle = page.locator('.title');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');

    this.menuButton = page.locator('#react-burger-menu-btn');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"], #logout_sidebar_link');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"], #reset_sidebar_link');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"], #inventory_sidebar_link');

    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');

    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemDetailName = page.locator('[data-test="inventory-item-name"]');
    this.itemDetailPrice = page.locator('[data-test="inventory-item-price"]');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Returns a specific item card locator by exact product name
   */
  getItemCardByName(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
  }

  /**
   * Adds an item to the shopping cart by product name
   */
  async addItemToCart(productName: string): Promise<void> {
    this.logger.info(`Adding item to cart: "${productName}"`);
    const card = this.getItemCardByName(productName);
    const addButton = card.locator('button', { hasText: /Add to cart/i });
    await this.clickElement(addButton, `Add to Cart for ${productName}`);
  }

  /**
   * Removes an item from the shopping cart by product name
   */
  async removeItemFromCart(productName: string): Promise<void> {
    this.logger.info(`Removing item from cart: "${productName}"`);
    const card = this.getItemCardByName(productName);
    const removeButton = card.locator('button', { hasText: /Remove/i });
    await this.clickElement(removeButton, `Remove for ${productName}`);
  }

  /**
   * Checks whether the Add to Cart button for an item has transitioned to 'Remove'
   */
  async isItemInCartState(productName: string): Promise<boolean> {
    const card = this.getItemCardByName(productName);
    const removeButton = card.locator('button', { hasText: /Remove/i });
    return await removeButton.isVisible();
  }

  /**
   * Reads cart badge numeric count (or 0 if badge does not exist)
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.getText(this.shoppingCartBadge);
      return parseInt(text, 10);
    }
    return 0;
  }

  /**
   * Clicks shopping cart link to navigate to Cart page
   */
  async openCart(): Promise<void> {
    this.logger.info('Opening Cart from Inventory page');
    await this.clickElement(this.shoppingCartLink, 'shopping cart icon');
  }

  /**
   * Selects sorting criteria (az, za, lohi, hilo)
   */
  async selectSortOption(option: SortOption): Promise<void> {
    this.logger.info(`Selecting sort option: ${option}`);
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Retrieves list of all product names displayed on screen
   */
  async getAllItemNames(): Promise<string[]> {
    return await this.inventoryItemNames.allInnerTexts();
  }

  /**
   * Retrieves list of all item prices parsed as floating point numbers
   */
  async getAllItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allInnerTexts();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  /**
   * Opens single product detail page by clicking its name
   */
  async openProductDetails(productName: string): Promise<void> {
    this.logger.info(`Navigating to product detail: "${productName}"`);
    const nameLink = this.page.locator('[data-test="inventory-item-name"]', { hasText: productName });
    await this.clickElement(nameLink, `Product name link "${productName}"`);
    await expect(this.backToProductsButton).toBeVisible();
  }

  /**
   * Navigates back from product detail to inventory listing
   */
  async backToProducts(): Promise<void> {
    await this.clickElement(this.backToProductsButton, 'Back to products button');
    await this.waitForReady();
  }

  /**
   * Opens the sidebar menu
   */
  async openMenu(): Promise<void> {
    this.logger.debug('Opening sidebar menu');
    await this.clickElement(this.menuButton, 'burger menu button');
    await expect(this.logoutLink).toBeVisible();
  }

  /**
   * Logs out via sidebar menu
   */
  async logout(): Promise<void> {
    this.logger.info('Executing logout flow');
    await this.openMenu();
    await this.clickElement(this.logoutLink, 'logout menu item');
  }

  /**
   * Resets app state via sidebar menu
   */
  async resetAppState(): Promise<void> {
    this.logger.info('Resetting application state');
    await this.openMenu();
    await this.clickElement(this.resetAppStateLink, 'reset app state menu item');
    await this.clickElement(this.menuCloseButton, 'close sidebar menu button');
  }
}
