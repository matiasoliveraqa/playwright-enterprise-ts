import { test, expect } from '../../src/fixtures/testBase';
import { API_TEST_USERS } from '../../src/data/testData';

interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone?: string;
  isDeleted?: boolean;
}

interface UserListResponse {
  users: UserDto[];
  total: number;
  skip: number;
  limit: number;
}

test.describe('Users Microservice API Contract & Validation Tests', () => {
  test('API-01: GET /users - Retrieve paginated user list with schema validation', async ({
    apiHelper,
  }) => {
    const response = await apiHelper.get<UserListResponse>('/users', {
      params: { limit: 10, skip: 0 },
    });

    apiHelper.assertStatusCode(response.status, 200);
    expect(response.responseTimeMs).toBeLessThan(5000);
    expect(response.headers['content-type']).toContain('application/json');

    const body = response.data;
    expect(body.users).toBeInstanceOf(Array);
    expect(body.users.length).toBe(10);
    expect(body.total).toBeGreaterThan(0);
    expect(body.skip).toBe(0);
    expect(body.limit).toBe(10);

    // Validate structure of first user item
    const firstUser = body.users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('email');
    expect(typeof firstUser.id).toBe('number');
  });

  test('API-02: GET /users/:id - Retrieve single user by ID', async ({ apiHelper }) => {
    const targetUserId = 1;
    const response = await apiHelper.get<UserDto>(`/users/${targetUserId}`);

    apiHelper.assertStatusCode(response.status, 200);
    expect(response.data.id).toBe(targetUserId);
    expect(response.data.firstName).toBeTruthy();
    expect(response.data.email).toContain('@');
  });

  test('API-03: GET /users/search - Search user by query string', async ({ apiHelper }) => {
    const query = 'Emily';
    const response = await apiHelper.get<UserListResponse>('/users/search', {
      params: { q: query },
    });

    apiHelper.assertStatusCode(response.status, 200);
    expect(response.data.users.length).toBeGreaterThan(0);

    const matches = response.data.users.some(
      u => u.firstName.toLowerCase().includes(query.toLowerCase()) ||
           u.lastName.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches).toBe(true);
  });

  test('API-04: POST /users/add - Create a new user with payload validation', async ({
    apiHelper,
  }) => {
    const payload = API_TEST_USERS.newValidUser;
    const response = await apiHelper.post<UserDto>('/users/add', payload);

    expect([200, 201]).toContain(response.status);
    expect(response.data.id).toBeDefined();
    expect(response.data.firstName).toBe(payload.firstName);
    expect(response.data.lastName).toBe(payload.lastName);
    expect(response.data.age).toBe(payload.age);
  });

  test('API-05: PUT /users/:id - Update existing user record', async ({ apiHelper }) => {
    const targetUserId = 1;
    const updatePayload = API_TEST_USERS.updatedUser;
    const response = await apiHelper.put<UserDto>(`/users/${targetUserId}`, updatePayload);

    apiHelper.assertStatusCode(response.status, 200);
    expect(response.data.id).toBe(targetUserId);
    expect(response.data.lastName).toBe(updatePayload.lastName);
    expect(response.data.age).toBe(updatePayload.age);
  });

  test('API-06: DELETE /users/:id - Remove user and confirm soft delete state', async ({
    apiHelper,
  }) => {
    const targetUserId = 1;
    const response = await apiHelper.delete<UserDto>(`/users/${targetUserId}`);

    apiHelper.assertStatusCode(response.status, 200);
    expect(response.data.id).toBe(targetUserId);
    expect(response.data.isDeleted).toBe(true);
  });

  test('API-07: GET /users/999999 - Return 404 for non-existent resource', async ({
    apiHelper,
  }) => {
    const nonExistentId = 999999;
    const response = await apiHelper.get<{ message?: string }>(`/users/${nonExistentId}`);

    apiHelper.assertStatusCode(response.status, 404);
  });

  test('API-08: Native Playwright request context validation (Raw API testing pattern)', async ({
    request,
  }) => {
    const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
    const response = await request.get(`${baseUrl}/users/1`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
    const json = await response.json();
    expect(json.id).toBe(1);
  });
});
