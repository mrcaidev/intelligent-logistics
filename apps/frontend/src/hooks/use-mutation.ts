import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

export function useMutation<Arg, Result>(key: string, method: string) {
  return useSWRMutation(key, mutator(method)<Arg, Result>);
}

export function usePost<Arg, Result>(key: string) {
  return useMutation<Arg, Result>(key, "POST");
}

export function usePatch<Arg, Result = never>(key: string) {
  return useMutation<Arg, Result>(key, "PATCH");
}

export function useDelete<Arg = never, Result = never>(key: string) {
  return useMutation<Arg, Result>(key, "DELETE");
}

function mutator(method: string) {
  return <Arg, Result>(url: string, { arg }: { arg: Arg }) => {
    return fetcher<Result>(url, {
      method,
      body: JSON.stringify(arg),
    });
  };
}
