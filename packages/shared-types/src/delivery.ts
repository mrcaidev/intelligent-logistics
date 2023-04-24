/**
 * An undirected weighed graph,
 * representing a logistics map.
 */
export type Graph = {
  id: string;
  name: string;
};

/**
 * A node in the graph,
 * representing a logistics center.
 */
export type Node = {
  id: string;
  name: string;
  graphId: string;
};

/**
 * An undirected weighed edge in the graph,
 * representing a route between two logistics centers.
 */
export type Edge = {
  id: string;
  sourceId: string;
  targetId: string;
  cost: number;
  graphId: string;
};

/**
 * A good to be delivered in the logistics system.
 */
export type Good = {
  id: string;
  name: string;
  createdAt: number;
  sourceId: string;
  targetId: string;
  isVip: boolean;
  graphId: string;
};
