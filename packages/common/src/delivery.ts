/**
 * An undirected graph,
 * representing the logistics map.
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
};

/**
 * A good to be delivered.
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
