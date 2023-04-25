import { EdgeCreator } from "./edge-creator";
import { NodeCreator } from "./node-creator";

export function GraphController() {
  return (
    <div className="space-x-4 fixed top-6 left-6 z-10">
      <NodeCreator />
      <EdgeCreator />
    </div>
  );
}
