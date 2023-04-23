import { Edge } from "common";

/**
 * Returns the shortest path between two nodes,
 * using Dijkstra's algorithm.
 */
export function getShortestPath(edges: Edge[], source: string, target: string) {
  const unvisitedNodes = new Set<string>();
  for (const { source, target } of edges) {
    unvisitedNodes.add(source);
    unvisitedNodes.add(target);
  }

  const distances: Record<string, number> = {};
  for (const node of unvisitedNodes) {
    distances[node] = Infinity;
  }
  distances[source] = 0;

  const previousNodes: Record<string, string> = {};

  while (unvisitedNodes.size > 0) {
    let minDistance = Infinity;
    let nearestNode = "";
    for (const node of unvisitedNodes) {
      if (distances[node]! < minDistance) {
        minDistance = distances[node]!;
        nearestNode = node;
      }
    }

    if (nearestNode === target) {
      break;
    }

    unvisitedNodes.delete(nearestNode);

    const neighbors: [string, number][] = [];
    for (const { source, target, cost } of edges) {
      if (source === nearestNode && unvisitedNodes.has(target)) {
        neighbors.push([target, cost]);
      } else if (target === nearestNode && unvisitedNodes.has(source)) {
        neighbors.push([source, cost]);
      }
    }

    for (const [neighbor, cost] of neighbors) {
      const newDistance = distances[nearestNode]! + cost;
      if (newDistance < distances[neighbor]!) {
        distances[neighbor] = newDistance;
        previousNodes[neighbor] = nearestNode;
      }
    }
  }

  if (unvisitedNodes.size === 0) {
    return { nodes: [], edges: [] };
  }

  const pathNodes = [target];
  let previousNode = previousNodes[target];
  while (previousNode) {
    pathNodes.unshift(previousNode);
    previousNode = previousNodes[previousNode];
  }

  const pathEdgeIds: string[] = [];
  for (const [index, node] of pathNodes.entries()) {
    if (index === 0) {
      continue;
    }

    const previousNode = pathNodes[index - 1];
    const edge = edges.find(
      ({ source, target }) =>
        (source === node && target === previousNode) ||
        (source === previousNode && target === node)
    );

    if (edge) {
      pathEdgeIds.push(edge.id);
    }
  }

  return { nodes: pathNodes, edges: pathEdgeIds };
}
