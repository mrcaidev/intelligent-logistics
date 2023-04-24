import { Button } from "components/form";
import { useGraphs } from "hooks/use-graphs";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { Graph } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function removeGraph(url: string) {
  return fetcher<never>(url, {
    method: "DELETE",
  });
}

type Props = {
  graph: Graph;
};

export function GraphRemover({ graph: { id, name } }: Props) {
  const { mutate } = useGraphs();

  const { trigger, isMutating } = useSWRMutation("/graphs/" + id, removeGraph);

  const handleClickRemoving = async () => {
    try {
      await trigger();
      await mutate();
      toast.success("删除方案成功：" + name);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button
      colorScheme="red"
      variant="link"
      size="small"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClickRemoving}
    >
      <span className="sr-only">删除方案</span>
    </Button>
  );
}
