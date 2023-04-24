import { Button, Input } from "components/form";
import { useGraphs } from "hooks/use-graphs";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";
import { Graph } from "shared-types";
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

async function updateGraph(url: string, { arg }: { arg: State }) {
  return fetcher<Graph>(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  });
}

type Props = {
  graph: Graph;
  onClose: () => void;
};

export function UpdateGraphForm({ graph, onClose }: Props) {
  const { trigger, isMutating } = useSWRMutation(
    "/graphs/" + graph.id,
    updateGraph
  );
  const { mutate } = useGraphs();

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "name", value: graph.name });
  }, [graph.name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await trigger(form);
      await mutate();
      toast.success("成功修改方案：" + form.name);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      onClose();
    }
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
