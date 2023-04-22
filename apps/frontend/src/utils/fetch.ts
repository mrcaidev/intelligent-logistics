const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetcher<T>(url: string | URL, config?: RequestInit) {
  const input = new URL(url, import.meta.env.VITE_API_BASE_URL);
  const init = {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
    },
  };

  await sleep(500);

  const response = await fetch(input, init);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json.data as T;
}
