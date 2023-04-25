export async function fetcher<T>(url: string | URL, config?: RequestInit) {
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
    return undefined as T;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json.data as T;
}

export function mutator<Arg = never, Result = never>(
  method: "POST" | "PATCH" | "DELETE"
) {
  return (url: string, { arg }: { arg: Arg }) =>
    fetcher<Result>(url, {
      method,
      body: JSON.stringify(arg),
    });
}
