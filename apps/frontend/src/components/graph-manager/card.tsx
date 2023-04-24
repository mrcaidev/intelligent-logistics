import clsx from "clsx";
import { useGraph } from "components/graph/context";
import { Graph } from "shared-types";
import { GraphRemover } from "./remover";
import { GraphUpdater } from "./updater";

type Props = {
  graph: Graph;
};

export function GraphCard({ graph }: Props) {
  const { id, name } = graph;

  const { graphId, setGraphId } = useGraph();

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
        <GraphRemover graph={graph} />
      </div>
    </div>
  );
}
