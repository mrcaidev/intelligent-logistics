import { Button, Checkbox, Input, Option, Select } from "components/form";
import { useGraph } from "components/graph";
import { useGoods } from "hooks/use-goods";
import { useGraphs } from "hooks/use-graphs";
import { FormEventHandler, useReducer, useState } from "react";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";
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

type Props = {
  onClose: () => void;
};

export function CreateGoodForm({ onClose }: Props) {
  const { data: graphs } = useGraphs();
  const { mutate } = useGoods();
  const { nodes } = useGraph();

  const [form, dispatch] = useReducer(reducer, defaultState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const good = await fetcher<Good>("/goods", {
        method: "POST",
        body: JSON.stringify(form),
      });
      mutate((goods) => (goods ? [...goods, good] : [good]));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-100">
      <p className="pb-2 font-bold text-2xl">添加物品</p>
      <Input
        label="名称"
        name="name"
        value={form.name}
        required
        disabled={isSubmitting}
        onChange={(e) => dispatch({ type: "name", value: e.target.value })}
      />
      <Select
        label="出发地"
        name="source"
        value={form.source}
        placeholder="请选择出发地"
        required
        disabled={isSubmitting}
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
        disabled={isSubmitting}
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
        disabled={isSubmitting}
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
        disabled={isSubmitting}
        onChange={(e) => dispatch({ type: "isVip", value: e.target.checked })}
      />
      <div className="flex justify-end items-center gap-3 pt-2">
        <Button variant="ghost" icon={X} onClick={onClose}>
          取消
        </Button>
        <Button type="submit" icon={Check} isLoading={isSubmitting}>
          确认
        </Button>
      </div>
    </form>
  );
}
