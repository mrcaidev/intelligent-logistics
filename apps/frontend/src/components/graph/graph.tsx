import { useGlobalState } from "contexts/global-state";
import { useEdges } from "hooks/use-edges";
import { useNodes } from "hooks/use-nodes";
import { useEffect, useRef, useState } from "react";
import { Loader } from "react-feather";
import { GraphCanvas, Theme, lightTheme } from "reagraph";
import { Button } from "../form";

const theme: Theme = {
  ...lightTheme,
  canvas: {
    background: "#f3f4f6",
    fog: "#f3f4f6",
  },
  node: {
    ...lightTheme.node,
    label: {
      ...lightTheme.node.label,
      stroke: "#f3f4f6",
    },
  },
  edge: {
    ...lightTheme.edge,
    label: {
      ...lightTheme.edge.label,
      stroke: "#f3f4f6",
    },
  },
};

export function Graph() {
  const { activeIds, setIsSidebarOpen } = useGlobalState();
  const { nodes, isLoading: isNodesLoading } = useNodes();
  const { edges, isLoading: isEdgesLoading } = useEdges();

  const progressRef = useRef(0);
  const [actives, setActives] = useState<string[]>([]);

  useEffect(() => {
    progressRef.current = 0;

    const fn = () => {
      if (progressRef.current >= activeIds.length) {
        setTimeout(() => setActives([]), 1500);
        return;
      }
      progressRef.current++;
      setActives(activeIds.slice(0, progressRef.current));
      setTimeout(fn, 500);
    };

    fn();
  }, [activeIds]);

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
          <Button variant="link" onClick={() => setIsSidebarOpen(true)}>
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
      actives={actives}
      edgeArrowPosition="none"
      edgeLabelPosition="natural"
      labelType="all"
      layoutType="treeTd2d"
      theme={theme}
    />
  );
}
