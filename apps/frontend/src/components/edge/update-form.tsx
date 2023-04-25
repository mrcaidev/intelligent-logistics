import { Button, Input } from "components/form";
import { useEdges } from "hooks/use-edges";
import { usePatch } from "hooks/use-mutation";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { Edge } from "shared-types";

type State = {
  cost: number;
};

const defaultState = {
  cost: 0,
};

type Action<T extends keyof State> = {
  type: T;
  payload: State[T];
};

function reducer<T extends keyof State>(state: State, action: Action<T>) {
  const { type, payload } = action;
  return { ...state, [type]: payload };
}

type Props = {
  id: string;
  onClose: () => void;
};

export function UpdateEdgeForm({ id, onClose }: Props) {
  const { edges, mutate } = useEdges();
  const edge = edges?.find((edge) => edge.id === id) as Edge;

  const { trigger, isMutating } = usePatch<State>("/edges/" + id);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "cost", payload: edge.cost });
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
        onChange={(e) => dispatch({ type: "cost", payload: +e.target.value })}
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
