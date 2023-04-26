import {
  CreateEdgeButton,
  RemoveEdgeButton,
  UpdateEdgeButton,
} from "components/edge";
import { Button } from "components/form";
import {
  CreateNodeButton,
  RemoveNodeButton,
  UpdateNodeButton,
} from "components/node";
import { useGlobalState } from "contexts/global-state";
import { useEdges } from "hooks/use-edges";
import { useNodes } from "hooks/use-nodes";
import { Loader } from "react-feather";
import { GraphCanvas } from "reagraph";
import { theme } from "./theme";
import { useCanvas } from "./use-canvas";

export function Canvas() {
  const { dispatch } = useGlobalState();

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

  if (isNodesLoading || isEdgesLoading) {
    return (
      <div className="grid place-items-center h-full">
        <Loader size={36} className="animate-spin" />
      </div>
    );
  }

  if (!nodes || !edges) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">
          请
          <Button
            variant="link"
            onClick={() => dispatch({ type: "OPEN_SIDEBAR" })}
          >
            选择一张物流图
          </Button>
          以开始
        </p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">暂时没有节点</p>
      </div>
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
