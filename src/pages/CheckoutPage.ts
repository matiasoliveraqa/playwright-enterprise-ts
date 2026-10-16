import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../constants';
import { CustomerInfo } from '../data/testData';

export class CheckoutPage extends BasePage {
  protected readonly path = ROUTES.CHECKOUT_STEP_ONE;

  // Step One: Your Information
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two: Overview
  readonly finishButton: Locator;
  readonly cancelOverviewButton: Locator;
  readonly summarySubtotalLabel: Locator;
  readonly summaryTaxLabel: Locator;
  readonly summaryTotalLabel: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly overviewItems: Locator;

  // Complete: Confirmation
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page, 'CheckoutPage');

    // Step One
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelOverviewButton = page.locator('[data-test="cancel"]');
    this.summarySubtotalLabel = page.locator('[data-test="subtotal-label"], .summary_subtotal_label');
    this.summaryTaxLabel = page.locator('[data-test="tax-label"], .summary_tax_label');
    this.summaryTotalLabel = page.locator('[data-test="total-label"], .summary_total_label');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"], .summary_value_label').first();
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"], .summary_value_label').nth(1);
    this.overviewItems = page.locator('[data-test="inventory-item"]');

    // Complete
    this.completeHeader = page.locator('[data-test="complete-header"], .complete-header');
    this.completeText = page.locator('[data-test="complete-text"], .complete-text');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('img.pony_express');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
  }

  // ==========================================
  // Step One Actions
  // ==========================================

  async fillInformation(customer: CustomerInfo): Promise<void> {
    this.logger.info(`Entering customer info: ${customer.firstName} ${customer.lastName}, ${customer.postalCode}`);
    await this.fillInput(this.firstNameInput, customer.firstName, 'first name');
    await this.fillInput(this.lastNameInput, customer.lastName, 'last name');
    await this.fillInput(this.postalCodeInput, customer.postalCode, 'postal code');
  }

  async continueToOverview(): Promise<void> {
    this.logger.info('Submitting customer info to proceed to overview');
    await this.clickElement(this.continueButton, 'Continue button');
  }

  async cancelCheckout(): Promise<void> {
    this.logger.info('Cancelling checkout step one');
    await this.clickElement(this.cancelButton, 'Cancel button');
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return await this.getText(this.errorMessage);
  }

  async expectErrorMessage(expected: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expected);
  }

  // ==========================================
  // Step Two Actions & Financial Calculations
  // ==========================================

  async waitForOverviewReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.getText(this.summarySubtotalLabel);
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.getText(this.summaryTaxLabel);
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.getText(this.summaryTotalLabel);
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getOverviewItemCount(): Promise<number> {
    return await this.overviewItems.count();
  }

  async finishCheckout(): Promise<void> {
    this.logger.info('Completing checkout order');
    await this.clickElement(this.finishButton, 'Finish button');
  }

  // ==========================================
  // Step Three: Complete Actions & Assertions
  // ==========================================

  async waitForOrderComplete(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
  }

  async getConfirmationHeader(): Promise<string> {
    await expect(this.completeHeader).toBeVisible();
    return await this.getText(this.completeHeader);
  }

  async getConfirmationText(): Promise<string> {
    await expect(this.completeText).toBeVisible();
    return await this.getText(this.completeText);
  }

  async backToHome(): Promise<void> {
    this.logger.info('Navigating back to inventory from complete page');
    await this.clickElement(this.backToProductsButton, 'Back Home button');
  }

  /**
   * Complete end-to-end checkout execution shortcut
   */
  async completeFullCheckoutJourney(customer: CustomerInfo): Promise<void> {
    await this.waitForReady();
    await this.fillInformation(customer);
    await this.continueToOverview();
    await this.waitForOverviewReady();
    await this.finishCheckout();
    await this.waitForOrderComplete();
  }
}
