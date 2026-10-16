/**
 * Application route endpoints
 */
export const ROUTES = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

/**
 * Inventory Sorting options
 */
export const SORT_OPTIONS = {
  NAME_AZ: 'az',
  NAME_ZA: 'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

/**
 * Expected UI text constants and error messages
 */
export const UI_MESSAGES = {
  LOGIN_LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  LOGIN_EMPTY_USERNAME: 'Epic sadface: Username is required',
  LOGIN_EMPTY_PASSWORD: 'Epic sadface: Password is required',
  LOGIN_INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  CHECKOUT_FIRST_NAME_REQUIRED: 'Error: First Name is required',
  CHECKOUT_LAST_NAME_REQUIRED: 'Error: Last Name is required',
  CHECKOUT_POSTAL_CODE_REQUIRED: 'Error: Postal Code is required',
  CHECKOUT_THANK_YOU: 'Thank you for your order!',
  CHECKOUT_ORDER_DISPATCH: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;

/**
 * Default timeouts in milliseconds
 */
export const TIMEOUTS = {
  ELEMENT: 10_000,
  PAGE_LOAD: 30_000,
  API_REQUEST: 15_000,
} as const;
