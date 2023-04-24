import { Button, Input } from "components/form";
import { FormEvent, useReducer } from "react";
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

async function createGraph(url: string, { arg }: { arg: State }) {
  return fetcher<Graph>(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

type Props = {
  onClose: () => void;
};

export function CreateGraphForm({ onClose }: Props) {
  const { trigger, isMutating } = useSWRMutation("/graphs", createGraph);

  const [form, dispatch] = useReducer(reducer, defaultState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const graph = await trigger(form);
      if (!graph) {
        return;
      }
      toast.success("成功添加方案：" + graph.name);
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