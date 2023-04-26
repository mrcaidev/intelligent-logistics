import {
  CreateEdgeButton,
  RemoveEdgeButton,
  UpdateEdgeButton,
} from "components/edge";
import {
  CreateNodeButton,
  RemoveNodeButton,
  UpdateNodeButton,
} from "components/node";
import { useEdges } from "hooks/use-edges";
import { useGraphs } from "hooks/use-graphs";
import { useNodes } from "hooks/use-nodes";
import { Loader } from "react-feather";
import { GraphCanvas } from "reagraph";
import { Ready } from "./ready";
import { theme } from "./theme";
import { useCanvas } from "./use-canvas";

export function Canvas() {
  const { graphs, isLoading: isGraphsLoading } = useGraphs();
  const { nodes, isLoading: isNodesLoading } = useNodes();
  const { edges, isLoading: isEdgesLoading } = useEdges();

  const {
    clickedEdgeId,
    clickedNodeId,
    actives,
    menuStatus,
    onCanvasClick,
    onNodeClick,
    onEdgeClick,
  } = useCanvas();

  if (isGraphsLoading || !graphs || isNodesLoading || isEdgesLoading) {
    return (
      <div className="grid place-items-center h-full">
        <Loader size={36} className="animate-spin" />
      </div>
    );
  }

  if (graphs.length === 0 || !nodes || !edges) {
    return <Ready />;
  }

  if (nodes.length === 0) {
    return (
      <>
        <div className="space-x-4 fixed top-6 left-6 z-10">
          <CreateNodeButton />
          <CreateEdgeButton />
        </div>
        <div className="grid place-items-center h-full">
          <p className="text-gray-600">暂时没有节点</p>
        </div>
      </>
    );
  }

  return (
    <>
      <GraphCanvas
        nodes={nodes.map(({ id, name }) => ({
          id,
          label: name,
        }))}
        edges={edges.map(({ id, sourceId, targetId, cost }) => ({
          id,
          label: String(cost),
          source: sourceId,
          target: targetId,
        }))}
        onCanvasClick={onCanvasClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        actives={actives}
        edgeArrowPosition="none"
        edgeLabelPosition="natural"
        labelType="all"
        layoutType="treeTd2d"
        theme={theme}
      />
      <div className="space-x-4 fixed top-6 left-6 z-10">
        <CreateNodeButton />
        <CreateEdgeButton />
      </div>
      {menuStatus === 1 && (
        <div className="space-x-4 absolute right-6 top-6 z-10">
          <UpdateNodeButton id={clickedNodeId} />
          <RemoveNodeButton id={clickedNodeId} />
        </div>
      )}
      {menuStatus === 2 && (
        <div className="space-x-4 absolute right-6 top-6 z-10">
          <UpdateEdgeButton id={clickedEdgeId} />
          <RemoveEdgeButton id={clickedEdgeId} />
        </div>
      )}
    </>
  );
}
