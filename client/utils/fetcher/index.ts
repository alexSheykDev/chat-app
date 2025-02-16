import { cookies } from 'next/headers';

import COOKIES from '@/constants/cookies';
import getBackendUrl from '@/lib/helpers/getBackendUrl';
import IFetcher from '@/interfaces/fetcher';
import { TFetchOptions, THeaders } from '@/interfaces/fetcher/fetchOptions';
import { TUrl } from '@/interfaces/shared/url';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export default class Fetcher implements IFetcher {
  protected baseUrl: string | undefined;

  protected cookieData: RequestCookie | undefined;

  protected fetchHeaders: THeaders;

  protected responseHeaders: Headers | undefined;

  constructor() {
    this.baseUrl = getBackendUrl();
    this.fetchHeaders = this.headersData();
  }

  async init() {
    const cookieStore = await cookies();
    this.cookieData = cookieStore.get(COOKIES);
  }

  // Example usage of async factory
  static async create() {
    const instance = new Fetcher();
    await instance.init();
    return instance;
  }


  headersData() {
    return {
      cookie: `${COOKIES}=${this.cookieData?.value}`,
      'content-type': 'application/json',
    };
  }

  setCookie(cookieValue: string) {
    this.cookieData = {
      name: COOKIES,
      value: cookieValue,
    };
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setHeaders(headers: THeaders) {
    this.fetchHeaders = headers;
  }

  getResponseHeaders() {
    return this.responseHeaders;
  }

  async get(url: TUrl, options?: Partial<TFetchOptions>) {
    const opts: TFetchOptions = {
      method: 'GET',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies by default
      ...options,
    };

    return this.fetcher(url, opts);
  }

  async file(url: TUrl, data: FormData) {
    const options: TFetchOptions = {
      method: 'POST',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies
      body: data as never, // Stringify data for POST request
    };

    return this.fetcher(url, options);
  }

  async putFile(url: TUrl, data: Blob) {
    const options: TFetchOptions = {
      method: 'PUT',

      headers: { cookie: `${COOKIES}=${this.cookieData?.value}`, 'Content-Type': 'application/octet-stream' },
      credentials: 'include', // Include existing cookies
      body: data as never,
    };

    return this.fetcher(url, options);
  }

  async post(url: TUrl, data: never, options?: Partial<TFetchOptions>) {
    const opts: TFetchOptions = {
      method: 'POST',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies
      body: JSON.stringify(data), // Stringify data for POST request
      ...options,
    };

    return this.fetcher(url, opts);
  }

  async put(url: TUrl, data: never, options?: Partial<TFetchOptions>) {
    const opts: TFetchOptions = {
      method: 'PUT',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies
      body: JSON.stringify(data), // Stringify data for PUT request
      ...options,
    };

    return this.fetcher(url, opts);
  }

  async patch(url: TUrl, data: never, options?: Partial<TFetchOptions>) {
    const opts: TFetchOptions = {
      method: 'PATCH',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies
      body: JSON.stringify(data), // Stringify data for PUT request
      ...options,
    };

    return this.fetcher(url, opts);
  }

  async delete(url: TUrl, data?: never, options?: Partial<TFetchOptions>) {
    const opts: TFetchOptions = {
      method: 'DELETE',
      headers: this.headersData(),
      credentials: 'include', // Include existing cookies
      ...(data ? { body: JSON.stringify(data) } : {}),
      ...options,
    };

    return this.fetcher(url, opts);
  }

  async fetcher(url: TUrl, options: TFetchOptions) {
    const fullUrl = this.buildUrl(url);

    const fetchOptions: TFetchOptions = {
      cache: 'no-store',
      ...options,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: `Network response was not ok (status: ${response.status})`,
        },
      };
    }

    this.responseHeaders = response.headers;

    if (response.status === 204) {
      // No content to parse
      return null;
    }

    return response.json();
  }

  buildUrl(url: TUrl): TUrl {
    return url.startsWith('/') ? `${this.baseUrl}${url}` : url; // Prepend base URL if needed
  }
}
