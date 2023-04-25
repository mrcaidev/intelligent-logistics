import { Button, Input } from "components/form";
import { useEdges } from "hooks/use-edges";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { Edge } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

type State = {
  cost: number;
};

const defaultState = {
  cost: 0,
};

type Action<T extends keyof State> = {
  type: T;
  value: State[T];
};

function reducer<T extends keyof State>(state: State, action: Action<T>) {
  const { type, value } = action;
  return { ...state, [type]: value };
}

async function updateEdge(url: string, { arg }: { arg: State }) {
  return fetcher<never>(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  });
}

type Props = {
  id: string;
  onClose: () => void;
};

export function EdgeUpdaterForm({ id, onClose }: Props) {
  const { edges, mutate } = useEdges();
  const edge = edges?.find((edge) => edge.id === id) as Edge;

  const { trigger, isMutating } = useSWRMutation("/edges/" + id, updateEdge);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "cost", value: edge.cost });
  }, [edge.cost]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger(form);
    await mutate();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-100">
      <Input
        label="费用"
        type="number"
        name="cost"
        value={form.cost}
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "cost", value: +e.target.value })}
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
