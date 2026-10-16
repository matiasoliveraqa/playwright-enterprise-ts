import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../constants';

export class LoginPage extends BasePage {
  protected readonly path = ROUTES.LOGIN;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.loginLogo = page.locator('.login_logo');
  }

  async waitForReady(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username, 'username input');
  }

  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password, 'password input');
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'login button');
  }

  /**
   * High-level action to perform full login flow
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting login for user: ${username}`);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return await this.getText(this.errorMessage);
  }

  async expectErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async dismissError(): Promise<void> {
    if (await this.errorMessage.isVisible()) {
      await this.clickElement(this.errorCloseButton, 'dismiss error button');
      await expect(this.errorMessage).toBeHidden();
    }
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
