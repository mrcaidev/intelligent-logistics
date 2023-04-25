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
import { useGlobalState } from "contexts/global-state";
import { useEdges } from "hooks/use-edges";
import { useNodes } from "hooks/use-nodes";
import { useRef, useState } from "react";
import { Loader } from "react-feather";
import { GraphCanvas } from "reagraph";
import { Button } from "../form";
import { theme } from "./theme";
import { useActives } from "./use-actives";

export function Canvas() {
  const { dispatch } = useGlobalState();
  const { nodes, isLoading: isNodesLoading } = useNodes();
  const { edges, isLoading: isEdgesLoading } = useEdges();

  const actives = useActives();

  const [menuStatus, setMenuStatus] = useState(0);
  const clickedNodeIdRef = useRef("");
  const clickedEdgeIdRef = useRef("");

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
        onCanvasClick={() => setMenuStatus(0)}
        onNodeClick={({ id }) => {
          clickedNodeIdRef.current = id;
          setMenuStatus(1);
        }}
        onEdgeClick={({ id }) => {
          clickedEdgeIdRef.current = id;
          setMenuStatus(2);
        }}
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
          <UpdateNodeButton id={clickedNodeIdRef.current} />
          <RemoveNodeButton id={clickedNodeIdRef.current} />
        </div>
      )}
      {menuStatus === 2 && (
        <div className="space-x-4 absolute right-6 top-6 z-10">
          <UpdateEdgeButton id={clickedEdgeIdRef.current} />
          <RemoveEdgeButton id={clickedEdgeIdRef.current} />
        </div>
      )}
    </>
  );
}
