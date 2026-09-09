import type { ApiErrorBody } from "@/types/api";

type ApiFetchOptions = RequestInit & {
  cookieHeader?: string;
  revalidate?: number | false;
  internal?: boolean;
};

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
  ) {
    super(body?.error.message ?? `API request failed with status ${status}.`);
  }
}

function getBrowserApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

function getServerApiUrl() {
  return process.env.API_INTERNAL_URL ?? getBrowserApiUrl();
}

function getBaseUrl(internal?: boolean) {
  if (typeof window === "undefined") {
    return internal === false ? getBrowserApiUrl() : getServerApiUrl();
  }
  return getBrowserApiUrl();
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { cookieHeader, revalidate = 300, internal, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }
  if (rest.body && !requestHeaders.has("Content-Type") && !(rest.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getBaseUrl(internal)}${path}`, {
    ...rest,
    headers: requestHeaders,
    credentials: rest.credentials ?? (typeof window === "undefined" ? undefined : "include"),
    cache: revalidate === false ? "no-store" : rest.cache,
    next: typeof window === "undefined" ? { revalidate: revalidate === false ? 0 : revalidate } : undefined,
  });

  if (!response.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    throw new ApiRequestError(response.status, body);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function safeApiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  try {
    return { data: await apiFetch<T>(path, options), error: null };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return { data: null, error: error.message, status: error.status };
    }
    return { data: null, error: "Falha inesperada ao consultar a API.", status: 500 };
  }
}

