import { Button, Checkbox, Input, Option, Select } from "components/form";
import { useGraph } from "components/graph";
import { useGraphs } from "hooks/use-graphs";
import { FormEventHandler, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

type State = {
  name: string;
  source: string;
  target: string;
  graphId: string;
  isVip: boolean;
};

const defaultState = {
  name: "",
  source: "",
  target: "",
  graphId: "",
  isVip: false,
};

type Action<T extends keyof State> = {
  type: T;
  value: State[T];
};

function reducer<T extends keyof State>(state: State, action: Action<T>) {
  const { type, value } = action;
  return { ...state, [type]: value };
}

async function createGood(url: string, { arg }: { arg: State }) {
  return fetcher<Good>(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

type Props = {
  onClose: () => void;
};

export function CreateGoodForm({ onClose }: Props) {
  const { data: graphs } = useGraphs();
  const { nodes, graphId } = useGraph();

  const { trigger, isMutating } = useSWRMutation("/goods", createGood);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "graphId", value: graphId });
  }, [graphId]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const good = await trigger(form);
      if (!good) {
        return;
      }
      toast.success("成功添加物品：" + good.name);
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
      <Select
        label="出发地"
        name="source"
        value={form.source}
        placeholder="请选择出发地"
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "source", value: e.target.value })}
      >
        {nodes.map((node) => (
          <Option key={node} value={node}>
            {node}
          </Option>
        ))}
      </Select>
      <Select
        label="目的地"
        name="target"
        value={form.target}
        placeholder="请选择目的地"
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "target", value: e.target.value })}
      >
        {nodes.map((node) => (
          <Option key={node} value={node}>
            {node}
          </Option>
        ))}
      </Select>
      <Select
        label="物流方案"
        name="graphId"
        value={form.graphId}
        placeholder="请选择物流方案"
        required
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "graphId", value: e.target.value })}
      >
        {graphs?.map((graph) => (
          <Option key={graph.id} value={graph.id}>
            {graph.name}
          </Option>
        ))}
      </Select>
      <Checkbox
        label="是否是 VIP 用户"
        name="isVip"
        checked={form.isVip}
        disabled={isMutating}
        onChange={(e) => dispatch({ type: "isVip", value: e.target.checked })}
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
