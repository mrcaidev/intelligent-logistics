import { Edge } from "common";
import { useEdges } from "hooks/use-edges";
import { useGraphs } from "hooks/use-graphs";
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
  const { data: graphs } = useGraphs();
  const { data: edges, isLoading } = useEdges(graphs?.at(0)?.id);

  if (!edges || isLoading) {
    return <p>Loading...</p>;
  }

  const nodes = collectNodes(edges);

  return (
    <GraphCanvas
      nodes={nodes.map((label) => ({ id: label, label }))}
      edges={edges.map(({ id, source, target, cost }) => ({
        id,
        label: String(cost),
        source,
        target,
      }))}
      draggable
      edgeArrowPosition="none"
      edgeLabelPosition="natural"
      labelType="all"
      theme={theme}
    />
  );
}

function collectNodes(edges: Edge[]) {
  const nodes = new Set<string>();
  for (const { source, target } of edges) {
    nodes.add(source);
    nodes.add(target);
  }
  return Array.from(nodes);
}
