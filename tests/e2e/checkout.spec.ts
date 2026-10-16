import { test, expect } from '../../src/fixtures/testBase';
import { TEST_CUSTOMERS, PRODUCT_CATALOG } from '../../src/data/testData';
import { UI_MESSAGES, ROUTES } from '../../src/constants';

test.describe('E2E Checkout Flow & Purchase Lifecycle', () => {
  test('TC-CHK-01: Complete end-to-end checkout journey with mathematical total verification', async ({
    loggedInPage,
  }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;
    const itemA = PRODUCT_CATALOG[0]; // $29.99
    const itemB = PRODUCT_CATALOG[1]; // $9.99
    const expectedSubtotal = parseFloat((itemA.price + itemB.price).toFixed(2));

    // 1. Add items to cart
    await inventoryPage.addItemToCart(itemA.name);
    await inventoryPage.addItemToCart(itemB.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // 2. Open Cart
    await inventoryPage.openCart();
    await cartPage.waitForReady();
    expect(await cartPage.getItemCount()).toBe(2);
    const cartItems = await cartPage.getAllItemNames();
    expect(cartItems).toContain(itemA.name);
    expect(cartItems).toContain(itemB.name);

    // 3. Initiate Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForReady();
    await checkoutPage.expectUrl(new RegExp(ROUTES.CHECKOUT_STEP_ONE));

    // 4. Fill Customer Information
    await checkoutPage.fillInformation(TEST_CUSTOMERS.validCustomer);
    await checkoutPage.continueToOverview();

    // 5. Overview & Price Breakdown Verification
    await checkoutPage.waitForOverviewReady();
    await checkoutPage.expectUrl(new RegExp(ROUTES.CHECKOUT_STEP_TWO));
    expect(await checkoutPage.getOverviewItemCount()).toBe(2);

    const actualSubtotal = await checkoutPage.getSubtotal();
    const actualTax = await checkoutPage.getTax();
    const actualTotal = await checkoutPage.getTotal();

    expect(actualSubtotal).toBe(expectedSubtotal);
    expect(actualTax).toBeGreaterThan(0);
    expect(actualTotal).toBe(parseFloat((actualSubtotal + actualTax).toFixed(2)));

    // 6. Finalize Order
    await checkoutPage.finishCheckout();

    // 7. Complete Page Verification
    await checkoutPage.waitForOrderComplete();
    await checkoutPage.expectUrl(new RegExp(ROUTES.CHECKOUT_COMPLETE));
    expect(await checkoutPage.getConfirmationHeader()).toBe(UI_MESSAGES.CHECKOUT_THANK_YOU);
    expect(await checkoutPage.getConfirmationText()).toContain('dispatched');

    // 8. Return Home and verify state clean
    await checkoutPage.backToHome();
    await inventoryPage.waitForReady();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('TC-CHK-02: Form validation - missing First Name displays error', async ({
    loggedInPage,
  }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;

    await inventoryPage.addItemToCart(PRODUCT_CATALOG[0].name);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(TEST_CUSTOMERS.emptyFirstName);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(UI_MESSAGES.CHECKOUT_FIRST_NAME_REQUIRED);
  });

  test('TC-CHK-03: Form validation - missing Last Name displays error', async ({
    loggedInPage,
  }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;

    await inventoryPage.addItemToCart(PRODUCT_CATALOG[0].name);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(TEST_CUSTOMERS.emptyLastName);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(UI_MESSAGES.CHECKOUT_LAST_NAME_REQUIRED);
  });

  test('TC-CHK-04: Form validation - missing Postal Code displays error', async ({
    loggedInPage,
  }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;

    await inventoryPage.addItemToCart(PRODUCT_CATALOG[0].name);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(TEST_CUSTOMERS.emptyPostalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage(UI_MESSAGES.CHECKOUT_POSTAL_CODE_REQUIRED);
  });

  test('TC-CHK-05: Modify cart contents before completing checkout', async ({
    loggedInPage,
  }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;
    const item1 = PRODUCT_CATALOG[0].name;
    const item2 = PRODUCT_CATALOG[1].name;

    await inventoryPage.addItemToCart(item1);
    await inventoryPage.addItemToCart(item2);
    await inventoryPage.openCart();
    await cartPage.waitForReady();

    // Remove one item in the cart
    await cartPage.removeItemByName(item1);
    expect(await cartPage.getItemCount()).toBe(1);

    // Proceed to checkout with remaining item
    await cartPage.proceedToCheckout();
    await checkoutPage.completeFullCheckoutJourney(TEST_CUSTOMERS.validCustomer);

    expect(await checkoutPage.getConfirmationHeader()).toBe(UI_MESSAGES.CHECKOUT_THANK_YOU);
  });

  test('TC-CHK-06: Cancel checkout step one returns user to Cart', async ({ loggedInPage }) => {
    const { inventoryPage, cartPage, checkoutPage } = loggedInPage;

    await inventoryPage.addItemToCart(PRODUCT_CATALOG[0].name);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.cancelCheckout();
    await cartPage.waitForReady();
    await cartPage.expectUrl(new RegExp(ROUTES.CART));
  });
});
