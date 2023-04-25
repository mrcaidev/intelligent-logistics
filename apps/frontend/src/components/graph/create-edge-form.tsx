import { Button, Input, Option, Select } from "components/form";
import { useGlobalState } from "contexts/global-state";
import { useEdges } from "hooks/use-edges";
import { useGraphs } from "hooks/use-graphs";
import { useNodes } from "hooks/use-nodes";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { Edge } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

type State = {
  sourceId: string;
  targetId: string;
  cost: number;
  graphId: string;
};

const defaultState = {
  sourceId: "",
  targetId: "",
  cost: 0,
  graphId: "",
};

type Action<T extends keyof State> = {
  type: T;
  value: State[T];
};

function reducer<T extends keyof State>(state: State, action: Action<T>) {
  const { type, value } = action;
  return { ...state, [type]: value };
}

async function createEdge(url: string, { arg }: { arg: State }) {
  return fetcher<Edge>(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

type Props = {
  onClose: () => void;
};

export function CreateEdgeForm({ onClose }: Props) {
  const { currentGraphId } = useGlobalState();
  const { graphs } = useGraphs();
  const { nodes } = useNodes();
  const { mutate } = useEdges();

  const { trigger, isMutating } = useSWRMutation("/edges", createEdge);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "graphId", value: currentGraphId });
  }, [currentGraphId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const edge = await trigger(form);
    if (!edge) {
      return;
    }
    await mutate();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-100">
      <Select
        label="起点"
        name="source"
        value={form.sourceId}
        placeholder="请选择起点"
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "sourceId", value: e.target.value })}
      >
        {nodes?.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
      <Select
        label="终点"
        name="target"
        value={form.targetId}
        placeholder="请选择终点"
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "targetId", value: e.target.value })}
      >
        {nodes?.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
      <Input
        label="费用"
        type="number"
        name="cost"
        value={form.cost}
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "cost", value: +e.target.value })}
      />
      <Select
        label="物流方案"
        name="graphId"
        value={form.graphId}
        placeholder="请选择物流方案"
        required
        disabled
      >
        {graphs?.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
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
