import clsx from "clsx";
import { useGlobalState } from "contexts/global-state";
import { Map } from "react-feather";
import { Graph } from "shared-types";
import { RemoveGraphButton } from "./remove-button";
import { UpdateGraphButton } from "./update-button";

export function GraphCard({ id, name }: Graph) {
  const { currentGraphId, dispatch } = useGlobalState();

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => dispatch({ type: "SET_CURRENT_GRAPH_ID", payload: id })}
        className={clsx(
          "flex items-center gap-3 w-full px-4 py-3 rounded border border-gray-300 hover:bg-gray-300 text-sm transition-colors",
          currentGraphId === id && "bg-gray-300"
        )}
      >
        <Map size={16} />
        {name}
      </button>
      <div className="hidden group-hover:flex items-center gap-2 absolute right-3 top-0 bottom-0">
        <UpdateGraphButton id={id} />
        <RemoveGraphButton id={id} />
      </div>
    </div>
  );
}
