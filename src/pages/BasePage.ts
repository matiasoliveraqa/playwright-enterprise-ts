import { Page, Locator, expect } from '@playwright/test';
import { Logger, createLogger } from '../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;
  protected abstract readonly path: string;

  constructor(page: Page, contextName: string) {
    this.page = page;
    this.logger = createLogger(contextName);
  }

  /**
   * Navigates directly to the page's route path
   */
  async navigate(subPath: string = ''): Promise<void> {
    const target = `${this.path}${subPath}`;
    this.logger.info(`Navigating to: ${target}`);
    await this.page.goto(target);
    await this.waitForReady();
  }

  /**
   * Hook to verify page is ready and elements are loaded
   */
  abstract waitForReady(): Promise<void>;

  /**
   * Returns current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Asserts current page URL matches expected pattern or path
   */
  async expectUrl(expected: string | RegExp): Promise<void> {
    this.logger.debug(`Verifying page URL matches: ${expected.toString()}`);
    await expect(this.page).toHaveURL(expected);
  }

  /**
   * Asserts page title
   */
  async expectTitle(expected: string | RegExp): Promise<void> {
    this.logger.debug(`Verifying page title matches: ${expected.toString()}`);
    await expect(this.page).toHaveTitle(expected);
  }

  /**
   * Takes a full-page or element screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    this.logger.info(`Capturing screenshot: ${name}`);
    return await this.page.screenshot({
      path: `test-results/screenshots/${Date.now()}-${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Reusable helper to safely click locators with auto-scroll
   */
  protected async clickElement(locator: Locator, description: string): Promise<void> {
    this.logger.debug(`Clicking ${description}`);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  /**
   * Reusable helper to safely fill text into inputs
   */
  protected async fillInput(locator: Locator, value: string, description: string): Promise<void> {
    this.logger.debug(`Filling ${description}`);
    await locator.fill(value);
  }

  /**
   * Reusable helper to get trimmed text content
   */
  protected async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }
}
