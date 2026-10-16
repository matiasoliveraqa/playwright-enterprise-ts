import { test, expect } from '../../src/fixtures/testBase';
import usersData from '../../src/data/users.json';
import { ROUTES, UI_MESSAGES } from '../../src/constants';

test.describe('Authentication & Session Management', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-AUTH-01: Successful login with standard active user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(usersData.standardUser.username, usersData.standardUser.password);

    await inventoryPage.waitForReady();
    await inventoryPage.expectUrl(new RegExp(ROUTES.INVENTORY));
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.shoppingCartLink).toBeVisible();
  });

  test('TC-AUTH-02: Prevent login with locked out user account', async ({ loginPage }) => {
    await loginPage.login(usersData.lockedOutUser.username, usersData.lockedOutUser.password);

    await loginPage.expectErrorMessage(UI_MESSAGES.LOGIN_LOCKED_OUT);
    await loginPage.expectUrl(new RegExp(ROUTES.LOGIN));
  });

  test('TC-AUTH-03: Reject login with invalid password credentials', async ({ loginPage }) => {
    await loginPage.login(usersData.invalidUser.username, usersData.invalidUser.password);

    await loginPage.expectErrorMessage(UI_MESSAGES.LOGIN_INVALID_CREDENTIALS);
  });

  test('TC-AUTH-04: Validate required field errors when username is blank', async ({ loginPage }) => {
    await loginPage.fillPassword(usersData.standardUser.password);
    await loginPage.clickLogin();

    await loginPage.expectErrorMessage(UI_MESSAGES.LOGIN_EMPTY_USERNAME);
  });

  test('TC-AUTH-05: Validate required field errors when password is blank', async ({ loginPage }) => {
    await loginPage.fillUsername(usersData.standardUser.username);
    await loginPage.clickLogin();

    await loginPage.expectErrorMessage(UI_MESSAGES.LOGIN_EMPTY_PASSWORD);
  });

  test('TC-AUTH-06: Error banner can be manually dismissed', async ({ loginPage }) => {
    await loginPage.clickLogin();
    await loginPage.expectErrorMessage(UI_MESSAGES.LOGIN_EMPTY_USERNAME);

    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('TC-AUTH-07: User can successfully log out from sidebar menu', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(usersData.standardUser.username, usersData.standardUser.password);
    await inventoryPage.waitForReady();

    await inventoryPage.logout();

    await loginPage.waitForReady();
    await loginPage.expectUrl(new RegExp(ROUTES.LOGIN));
    expect(await loginPage.isLoginFormVisible()).toBe(true);
  });

  test('TC-AUTH-08: Direct deep-link access to inventory without auth is blocked', async ({
    page,
    loginPage,
  }) => {
    // Attempt to bypass authentication directly via deep-link
    await page.goto(ROUTES.INVENTORY);

    await loginPage.expectUrl(new RegExp(ROUTES.LOGIN));
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in.");
  });
});
