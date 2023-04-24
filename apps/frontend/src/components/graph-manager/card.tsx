import clsx from "clsx";
import { useGlobalState } from "contexts/global-state";
import { Graph } from "shared-types";
import { GraphRemover } from "./remover";
import { GraphUpdater } from "./updater";

type Props = {
  graph: Graph;
};

export function GraphCard({ graph }: Props) {
  const { id, name } = graph;

  const { currentGraphId, setCurrentGraphId } = useGlobalState();

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => setCurrentGraphId(id)}
        className={clsx(
          "w-full px-4 py-3 rounded hover:bg-gray-300 text-start text-sm transition-colors",
          currentGraphId === id && "bg-gray-300"
        )}
      >
        {name}
      </button>
      <div className="hidden group-hover:flex items-center gap-2 absolute right-3 top-0 bottom-0">
        <GraphUpdater graph={graph} />
        <GraphRemover graph={graph} />
      </div>
    </div>
  );
}
