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

  if (edges.isLoading || !edges.data) {
    return (
      <div className="grid place-items-center h-full">
        <Loader size={36} className="animate-spin" />
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
