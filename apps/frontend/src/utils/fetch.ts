export async function fetcher<T>(url: string, config?: RequestInit) {
  const input = new URL(url, import.meta.env.VITE_API_BASE_URL);
  const init = {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(input, init);

  if (response.status === 204) {
    return undefined as never;
  }

  const { data, error } = await response.json();

  if (!response.ok) {
    throw new Error(error);
  }

  return data as T;
}
