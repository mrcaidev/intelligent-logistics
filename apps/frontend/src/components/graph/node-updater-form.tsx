import { Button, Input } from "components/form";
import { useNodes } from "hooks/use-nodes";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { Node } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

type State = {
  name: string;
};

const defaultState = {
  name: "",
};

type Action<T extends keyof State> = {
  type: T;
  value: State[T];
};

function reducer<T extends keyof State>(state: State, action: Action<T>) {
  const { type, value } = action;
  return { ...state, [type]: value };
}

async function createNode(url: string, { arg }: { arg: State }) {
  return fetcher<never>(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  });
}

type Props = {
  id: string;
  onClose: () => void;
};

export function NodeUpdaterForm({ id, onClose }: Props) {
  const { nodes, mutate } = useNodes();
  const node = nodes?.find((node) => node.id === id) as Node;

  const { trigger, isMutating } = useSWRMutation("/nodes/" + id, createNode);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "name", value: node.name });
  }, [node.name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger(form);
    await mutate();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-100">
      <Input
        label="名称"
        name="name"
        value={form.name}
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "name", value: e.target.value })}
      />
      <div className="flex justify-end items-center gap-3">
        <Button colorScheme="gray" variant="dim" icon={X} onClick={onClose}>
          取消
        </Button>
        <Button type="submit" icon={Check} isLoading={isMutating}>
          确认
        </Button>
      </div>
    </form>
  );
}
