import { Button } from "components/form";
import { useGlobalState } from "contexts/global-state";
import { useGraphs } from "hooks/use-graphs";
import { useDelete } from "hooks/use-mutation";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";

type Props = {
  id: string;
};

export function RemoveGraphButton({ id }: Props) {
  const { dispatch } = useGlobalState();
  const { mutate } = useGraphs();

  const { trigger, isMutating } = useDelete("/graphs/" + id);

  const handleClick = async () => {
    await trigger();
    await mutate();
    dispatch({ type: "SET_CURRENT_GRAPH_ID", payload: "" });
    toast.success("删除方案成功");
  };

  return (
    <Button
      colorScheme="red"
      variant="link"
      size="small"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClick}
    >
      <span className="sr-only">删除方案</span>
    </Button>
  );
}
