import { Loader } from "react-feather";
import { GraphCanvas, Theme, lightTheme } from "reagraph";
import { useGraph } from "./context";

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
  const { edges, nodes, activeIds } = useGraph();

  if (edges.isLoading) {
    return (
      <div className="grid place-items-center h-full">
        <Loader size={36} className="animate-spin" />
      </div>
    );
  }

  if (!edges.data) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">还没有物流方案……</p>
      </div>
    );
  }

  if (edges.data.length === 0) {
    return (
      <div className="grid place-items-center h-full">
        <p className="text-gray-600">这张图暂时还没有节点……</p>
      </div>
    );
  }

  return (
    <GraphCanvas
      nodes={nodes.map((label) => ({
        id: label,
        label,
      }))}
      edges={edges.data.map(({ id, source, target, cost }) => ({
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
