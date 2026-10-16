export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  descriptionSnippet: string;
}

export interface ApiUserPayload {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  gender: string;
  birthDate?: string;
  phone?: string;
}

export const TEST_CUSTOMERS = {
  validCustomer: {
    firstName: 'Alex',
    lastName: 'Morgan',
    postalCode: '90210',
  } as CustomerInfo,
  specialCharsCustomer: {
    firstName: 'Éléonore-Renée',
    lastName: "O'Connor-Smith",
    postalCode: 'H2X 1Y4',
  } as CustomerInfo,
  emptyFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  } as CustomerInfo,
  emptyLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
  } as CustomerInfo,
  emptyPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  } as CustomerInfo,
};

export const PRODUCT_CATALOG: ProductInfo[] = [
  {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    descriptionSnippet: 'carry.allTheThings() with the sleek',
  },
  {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    descriptionSnippet: "A red light isn't the desired state",
  },
  {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    descriptionSnippet: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  },
  {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    descriptionSnippet: "It's not every day that you come across a midweight quarter-zip fleece",
  },
  {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
    descriptionSnippet: 'Rib snaps at the bottom for easy change',
  },
  {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    descriptionSnippet: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard',
  },
];

export const API_TEST_USERS = {
  newValidUser: {
    firstName: 'Jane',
    lastName: 'Engineer',
    age: 31,
    email: 'jane.engineer@testmail.com',
    gender: 'female',
    phone: '+1-555-019-2834',
  } as ApiUserPayload,
  updatedUser: {
    firstName: 'Jane',
    lastName: 'Principal-Architect',
    age: 32,
    email: 'jane.architect@testmail.com',
    gender: 'female',
  } as Partial<ApiUserPayload>,
};
