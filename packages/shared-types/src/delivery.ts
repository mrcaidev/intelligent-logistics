/**
 * An undirected weighed graph,
 * representing a logistics map.
 */
export type Graph = {
  id: string;
  name: string;
};

/**
 * An undirected weighed edge,
 * representing a road between two logistics centers.
 */
export type Edge = {
  id: string;
  source: string;
  target: string;
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
  source: string;
  target: string;
  isVip: boolean;
  graphId: string;
};
