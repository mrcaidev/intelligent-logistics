/**
 * An edge in a graph, which has two ends and a weight.
 */
type Edge = {
  from: string;
  to: string;
  weight: number;
};

/**
 * The shortest path between two nodes,
 * represented by every node in the path and the total weight.
 */
type ShortestPath = {
  path: string[];
  weight: number;
};

/**
 * The shortest paths from each node to each other node.
 */
type ShortestPaths = Record<string, Record<string, ShortestPath>>;

/**
 * Represents the map of logistics centers and the roads between them.
 */
export class Graph {
  /**
   * The shortest paths from each node to each other node.
   */
  private shortestPaths: ShortestPaths = {};

  constructor(private edges: Edge[]) {
    this.shortestPaths = Graph.calculateShortestPaths(edges);
  }

  /**
   * Returns the shortest path between two nodes.
   */
  public getShortestPath(from: string, to: string) {
    return this.shortestPaths[from]![to]!;
  }

  /**
   * Updates an edge between two nodes,
   * or creates it if it does not exist.
   */
  public setEdge(from: string, to: string, weight: number) {
    const edge = this.edges.find(
      (edge) => edge.from === from && edge.to === to
    );

    if (edge) {
      edge.weight = weight;
    } else {
      this.edges.push({ from, to, weight });
    }

    this.shortestPaths = Graph.calculateShortestPaths(this.edges);
  }

  /**
   * Calculates the shortest paths from each node to each other node,
   * using Floyd-Warshall algorithm.
   */
  private static calculateShortestPaths(edges: Edge[]) {
    const nodes = Graph.collectNodesFromEdges(edges);

    const paths: ShortestPaths = {};

    for (const from of nodes) {
      paths[from] = {};
      for (const to of nodes) {
        paths[from]![to] = {
          path: [from, to],
          weight: from === to ? 0 : Infinity,
        };
      }
    }

    for (const { from, to, weight } of edges) {
      paths[from]![to]!.weight = weight;
    }

    for (const middle of nodes) {
      for (const from of nodes) {
        for (const to of nodes) {
          if (from === to) {
            continue;
          }

          const newWeight =
            paths[from]![middle]!.weight + paths[middle]![to]!.weight;

          if (newWeight >= paths[from]![to]!.weight) {
            continue;
          }

          paths[from]![to] = {
            weight: newWeight,
            path: [
              ...paths[from]![middle]!.path,
              ...paths[middle]![to]!.path.slice(1),
            ],
          };
        }
      }
    }

    return paths;
  }

  /**
   * Collects every node that appears in the given edges.
   */
  private static collectNodesFromEdges(edges: Edge[]) {
    return [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))];
  }
}
