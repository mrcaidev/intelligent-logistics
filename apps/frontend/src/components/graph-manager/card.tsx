import clsx from "clsx";
import { useGraph } from "components/graph/context";
import { useGraphs } from "hooks/use-graphs";
import { Loader, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { Graph } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";
import { GraphUpdater } from "./updater";

async function removeGraph(url: string) {
  return fetcher(url, {
    method: "DELETE",
  });
}

export function GraphCard(graph: Graph) {
  const { id, name } = graph;

  const { graphId, setGraphId } = useGraph();
  const { mutate } = useGraphs();

  const { trigger: remove, isMutating: isRemoving } = useSWRMutation(
    graphId ? "/graphs/" + graphId : null,
    removeGraph
  );

  const handleClickRemoving = async () => {
    try {
      await remove();
      await mutate();
      toast.success("删除方案成功：" + name);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setGraphId(id)}
        className={clsx(
          "w-full px-4 py-3 rounded text-start text-sm hover:bg-gray-300 transition-colors",
          graphId === id && "bg-gray-300"
        )}
      >
        {name}
      </button>
      <div className="flex items-center gap-1 absolute right-3 top-0 bottom-0">
        <GraphUpdater graph={graph} />
        <button
          type="button"
          disabled={isRemoving}
          onClick={handleClickRemoving}
          className="p-1 text-gray-600 hover:text-red-700"
        >
          {isRemoving ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
