export type TFetchOptions_Draft = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'; // Supported HTTP methods
    headers?: HeadersInit; // Headers object or an initializer object
    body?: BodyInit | null; // Request body (string, Blob, FormData, URLSearchParams, etc.)
    cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'; // Cache behavior
    mode?: 'cors' | 'no-cors' | 'same-origin'; // Request mode (CORS handling)
    credentials?: 'omit' | 'same-origin' | 'include'; // Include cookies
    redirect?: 'follow' | 'error' | 'manual'; // Redirect handling
    referrer?: ReferrerPolicy; // Referrer policy
    referrerPolicy?: ReferrerPolicy; // Another way to specify referrer policy (alias)
    signal?: AbortSignal | null; // Abort signal for cancellation
  };
  
  export type THeaders = { [key: string]: string | number | null | boolean | undefined };
  
  export type TFetchOptions = {
    method: string;
    headers: THeaders;
    cookies?: Record<string, string>;
    body?: string;
    credentials?: string;
    cache?: string;
    next?: {
      tags?: string[];
      revalidate?: number;
    };
  };
  