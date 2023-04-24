import { Edge } from "shared-types";

/**
 * Returns a list of IDs of every node or edge
 * on the shortest path by order,
 * using Dijkstra's algorithm.
 *
 * @param edges The edges of a graph.
 * @param sourceId The ID of the source node.
 * @param targetId The ID of the target node.
 */
export function getShortestPath(
  edges: Edge[],
  sourceId: string,
  targetId: string
) {
  const unvisitedNodeIds = new Set<string>();
  for (const { sourceId, targetId } of edges) {
    unvisitedNodeIds.add(sourceId);
    unvisitedNodeIds.add(targetId);
  }

  if (!unvisitedNodeIds.has(sourceId) || !unvisitedNodeIds.has(targetId)) {
    return [];
  }

  const distances: Record<string, number> = {};
  for (const nodeId of unvisitedNodeIds) {
    distances[nodeId] = Infinity;
  }
  distances[sourceId] = 0;

  const previousNodeIds: Record<string, string> = {};

  while (unvisitedNodeIds.size > 0) {
    let minDistance = Infinity;
    let nearestNodeId = "";
    for (const nodeId of unvisitedNodeIds) {
      if (distances[nodeId]! < minDistance) {
        minDistance = distances[nodeId]!;
        nearestNodeId = nodeId;
      }
    }

    if (nearestNodeId === targetId) {
      break;
    }

    unvisitedNodeIds.delete(nearestNodeId);

    const neighbors: [string, number][] = [];
    for (const { sourceId, targetId, cost } of edges) {
      if (sourceId === nearestNodeId && unvisitedNodeIds.has(targetId)) {
        neighbors.push([targetId, cost]);
      } else if (targetId === nearestNodeId && unvisitedNodeIds.has(sourceId)) {
        neighbors.push([sourceId, cost]);
      }
    }

    for (const [neighborId, cost] of neighbors) {
      const newDistance = distances[nearestNodeId]! + cost;
      if (newDistance < distances[neighborId]!) {
        distances[neighborId] = newDistance;
        previousNodeIds[neighborId] = nearestNodeId;
      }
    }
  }

  if (unvisitedNodeIds.size === 0) {
    return [];
  }

  const pathIds = [targetId];
  let currentNodeId = targetId;
  let previousNodeId = previousNodeIds[targetId];
  while (previousNodeId) {
    const edge = edges.find(
      ({ sourceId, targetId }) =>
        (sourceId === currentNodeId && targetId === previousNodeId) ||
        (sourceId === previousNodeId && targetId === currentNodeId)
    );
    if (!edge) {
      return [];
    }
    pathIds.unshift(edge.id);
    pathIds.unshift(previousNodeId);
    currentNodeId = previousNodeId;
    previousNodeId = previousNodeIds[previousNodeId];
  }

  return pathIds;
}
