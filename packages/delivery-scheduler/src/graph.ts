/**
 * An edge in a graph, which has two ends and a cost.
 */
type Edge = {
  from: string;
  to: string;
  cost: number;
};

/**
 * The shortest path between two nodes,
 * represented by every node in the path and the total cost.
 */
type ShortestPath = {
  path: string[];
  cost: number;
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
  public setEdge(from: string, to: string, cost: number) {
    const edge = this.edges.find(
      (edge) => edge.from === from && edge.to === to
    );

    if (edge) {
      edge.cost = cost;
    } else {
      this.edges.push({ from, to, cost });
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
          cost: from === to ? 0 : Infinity,
        };
      }
    }

    for (const { from, to, cost } of edges) {
      paths[from]![to]!.cost = cost;
      paths[to]![from]!.cost = cost;
    }

    for (const middle of nodes) {
      for (const [fromIndex, from] of nodes.entries()) {
        for (const to of nodes.slice(fromIndex + 1)) {
          const newWeight =
            paths[from]![middle]!.cost + paths[middle]![to]!.cost;

          if (newWeight >= paths[from]![to]!.cost) {
            continue;
          }

          paths[from]![to] = {
            path: [
              ...paths[from]![middle]!.path,
              ...paths[middle]![to]!.path.slice(1),
            ],
            cost: newWeight,
          };
          paths[to]![from] = {
            path: [
              ...paths[to]![middle]!.path,
              ...paths[middle]![from]!.path.slice(1),
            ],
            cost: newWeight,
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
