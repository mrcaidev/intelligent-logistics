import { Button, Input } from "components/form";
import { usePost } from "hooks/use-mutation";
import { FormEvent, useReducer } from "react";
import { Check, X } from "react-feather";
import { Node } from "shared-types";

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

type Props = {
  onClose: () => void;
};

export function NodeCreatorForm({ onClose }: Props) {
  const { trigger, isMutating } = usePost<State, Node>("/nodes");

  const [form, dispatch] = useReducer(reducer, defaultState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const node = await trigger(form);
    if (!node) {
      return;
    }
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
