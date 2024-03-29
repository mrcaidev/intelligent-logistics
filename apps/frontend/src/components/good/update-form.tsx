import { Button, Checkbox, Input, Option, Select } from "components/form";
import { useGoods } from "hooks/use-goods";
import { useGraphs } from "hooks/use-graphs";
import { usePatch } from "hooks/use-mutation";
import { useNodes } from "hooks/use-nodes";
import { FormEvent, useEffect, useReducer } from "react";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";

type State = {
  name: string;
  sourceId: string;
  targetId: string;
  isVip: boolean;
  graphId: string;
};

const defaultState = {
  name: "",
  sourceId: "",
  targetId: "",
  isVip: false,
  graphId: "",
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

export function UpdateGoodForm({ id, onClose }: Props) {
  const { graphs } = useGraphs();
  const { nodes } = useNodes();
  const { goods, mutate } = useGoods();
  const { name, sourceId, targetId, isVip, graphId } = goods?.find(
    (good) => good.id === id
  ) as Good;

  const { trigger, isMutating } = usePatch<State>("/goods/" + id);

  const [form, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    dispatch({ type: "name", payload: name });
    dispatch({ type: "sourceId", payload: sourceId });
    dispatch({ type: "targetId", payload: targetId });
    dispatch({ type: "isVip", payload: isVip });
    dispatch({ type: "graphId", payload: graphId });
  }, [name, sourceId, targetId, isVip, graphId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger(form);
    await mutate();
    toast.success("成功修改物品：" + form.name);
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
        onChange={(e) => dispatch({ type: "name", payload: e.target.value })}
      />
      <Select
        label="起点"
        name="source"
        value={form.sourceId}
        placeholder="请选择起点"
        required
        disabled={isMutating}
        onChange={(e) =>
          dispatch({ type: "sourceId", payload: e.target.value })
        }
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
        onChange={(e) =>
          dispatch({ type: "targetId", payload: e.target.value })
        }
      >
        {nodes?.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
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
        onChange={(e) => dispatch({ type: "graphId", payload: e.target.value })}
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
        onChange={(e) => dispatch({ type: "isVip", payload: e.target.checked })}
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
