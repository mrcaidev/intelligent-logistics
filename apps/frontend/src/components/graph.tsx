import { useGlobalState } from "contexts/global-state";
import { useEdges } from "hooks/use-edges";
import { Loader } from "react-feather";
import { GraphCanvas, Theme, lightTheme } from "reagraph";

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
  const { activeIds } = useGlobalState();
  const { edges, nodes, isLoading } = useEdges();

  if (isLoading) {
    return (
      <div className="grid place-items-center h-full">
        <Loader size={36} className="animate-spin" />
      </div>
    );
  }

  if (!edges) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">请选择一张物流图以开始</p>
      </div>
    );
  }

  if (edges.length === 0) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">这张图暂时还没有节点</p>
      </div>
    );
  }

  return (
    <GraphCanvas
      nodes={nodes.map((label) => ({
        id: label,
        label,
      }))}
      edges={edges.map(({ id, source, target, cost }) => ({
        id,
        label: String(cost),
        source,
        target,
      }))}
      actives={activeIds}
      edgeArrowPosition="none"
      edgeLabelPosition="natural"
      labelType="all"
      layoutType="treeTd2d"
      theme={theme}
    />
  );
}
