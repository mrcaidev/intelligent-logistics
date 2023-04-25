import { CreateEdgeButton } from "components/edge";
import { CreateNodeButton } from "components/node";

export function GraphController() {
  return (
    <div className="space-x-4 fixed top-6 left-6 z-10">
      <CreateNodeButton />
      <CreateEdgeButton />
    </div>
  );
}
