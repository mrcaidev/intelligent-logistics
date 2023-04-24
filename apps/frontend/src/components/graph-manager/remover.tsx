import { useGraphs } from "hooks/use-graphs";
import { Loader, Trash2 } from "react-feather";
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
    <button
      type="button"
      disabled={isMutating}
      onClick={handleClickRemoving}
      className="p-1 text-gray-600 hover:text-red-700"
    >
      {isMutating ? (
        <Loader size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
