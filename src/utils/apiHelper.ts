import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { createLogger, Logger } from './logger';

export interface ApiResponseWrapper<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  responseTimeMs: number;
  rawResponse: APIResponse;
}

export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;
  private readonly logger: Logger;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    this.baseUrl = baseUrl || process.env.API_BASE_URL || 'https://dummyjson.com';
    this.logger = createLogger('ApiHelper');
  }

  private resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return `${cleanBase}/${cleanEndpoint}`;
  }

  async get<T = unknown>(
    endpoint: string,
    options?: { params?: Record<string, string | number | boolean>; headers?: Record<string, string> }
  ): Promise<ApiResponseWrapper<T>> {
    const url = this.resolveUrl(endpoint);
    this.logger.debug(`GET request to: ${url}`);
    const start = Date.now();

    const response = await this.request.get(url, {
      params: options?.params,
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    const responseTimeMs = Date.now() - start;
    const data = await this.safeParseJson<T>(response);

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      data,
      responseTimeMs,
      rawResponse: response,
    };
  }

  async post<T = unknown>(
    endpoint: string,
    payload: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponseWrapper<T>> {
    const url = this.resolveUrl(endpoint);
    this.logger.debug(`POST request to: ${url}`);
    const start = Date.now();

    const response = await this.request.post(url, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    const responseTimeMs = Date.now() - start;
    const data = await this.safeParseJson<T>(response);

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      data,
      responseTimeMs,
      rawResponse: response,
    };
  }

  async put<T = unknown>(
    endpoint: string,
    payload: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponseWrapper<T>> {
    const url = this.resolveUrl(endpoint);
    this.logger.debug(`PUT request to: ${url}`);
    const start = Date.now();

    const response = await this.request.put(url, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    const responseTimeMs = Date.now() - start;
    const data = await this.safeParseJson<T>(response);

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      data,
      responseTimeMs,
      rawResponse: response,
    };
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponseWrapper<T>> {
    const url = this.resolveUrl(endpoint);
    this.logger.debug(`DELETE request to: ${url}`);
    const start = Date.now();

    const response = await this.request.delete(url, {
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    const responseTimeMs = Date.now() - start;
    const data = await this.safeParseJson<T>(response);

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      data,
      responseTimeMs,
      rawResponse: response,
    };
  }

  private async safeParseJson<T>(response: APIResponse): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      return (await response.text()) as unknown as T;
    }
  }

  assertStatusCode(actual: number, expected: number): void {
    expect(actual, `Expected status code ${expected} but received ${actual}`).toBe(expected);
  }
}
