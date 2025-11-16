interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorText = await response.text().catch(() => response.statusText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const contentType = response.headers.get('content-type');
        let data: T;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json() as T;
        } else {
          const text = await response.text();
          data = text as unknown as T;
        }
        return {
          data,
          error: null,
          status: response.status,
        };
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError' || (error.message?.includes('HTTP 4'))) {
        return {
          data: null,
          error: error.message || 'Request failed',
          status: 0,
        };
      }
      if (attempt === retries) {
        return {
          data: null,
          error: lastError?.message || 'Request failed after retries',
          status: 0,
        };
      }
      // Jitter aleatorio para evitar thundering herd
      const base = retryDelay * Math.pow(2, attempt);
      const jitter = Math.floor(Math.random() * base * 0.5);
      const delay = base + jitter;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return {
    data: null,
    error: lastError?.message || 'Unknown error',
    status: 0,
  };
}
