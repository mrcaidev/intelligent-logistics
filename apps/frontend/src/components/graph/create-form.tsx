import { Button, Input } from "components/form";
import { usePost } from "hooks/use-mutation";
import { FormEvent, useReducer } from "react";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";
import { Graph } from "shared-types";

type State = {
  name: string;
};

const defaultState = {
  name: "",
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
  onClose: () => void;
};

export function CreateGraphForm({ onClose }: Props) {
  const { trigger, isMutating } = usePost<State, Graph>("/graphs");

  const [form, dispatch] = useReducer(reducer, defaultState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger(form);
    toast.success("成功添加方案：" + form.name);
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
