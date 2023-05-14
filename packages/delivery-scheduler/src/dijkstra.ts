import { Edge } from "shared-types";

/**
 * Returns the IDs of every node or edge on the shortest path by order,
 * using Dijkstra's algorithm.
 */
export function getShortestPath(
  edges: Edge[],
  sourceId: string,
  targetId: string
) {
  // Mark all nodes as unvisited.
  const unvisitedNodeIds = new Set<string>();
  for (const { sourceId, targetId } of edges) {
    unvisitedNodeIds.add(sourceId);
    unvisitedNodeIds.add(targetId);
  }

  // If either the source or the target does not exist, return an empty list.
  if (!unvisitedNodeIds.has(sourceId) || !unvisitedNodeIds.has(targetId)) {
    return [];
  }

  // Initialize the distance from the source to every node.
  const distances: Record<string, number> = {};
  for (const nodeId of unvisitedNodeIds) {
    distances[nodeId] = Infinity;
  }
  distances[sourceId] = 0;

  // Record the previous node of every node on the shortest path to it.
  const previousNodeIds: Record<string, string> = {};

  // Keep exploring until all nodes are visited.
  while (unvisitedNodeIds.size > 0) {
    // Find the nearest unvisited node to the source.
    let minDistance = Infinity;
    let nearestNodeId = "";
    for (const nodeId of unvisitedNodeIds) {
      if (distances[nodeId]! < minDistance) {
        minDistance = distances[nodeId]!;
        nearestNodeId = nodeId;
      }
    }

    // If this node is the target, terminate the searching process.
    if (nearestNodeId === targetId) {
      break;
    }

    // Otherwise, mark this node as visited.
    unvisitedNodeIds.delete(nearestNodeId);

    // Find all the neighbors of this node.
    const neighbors: [string, number][] = [];
    for (const { sourceId, targetId, cost } of edges) {
      if (sourceId === nearestNodeId && unvisitedNodeIds.has(targetId)) {
        neighbors.push([targetId, cost]);
      } else if (targetId === nearestNodeId && unvisitedNodeIds.has(sourceId)) {
        neighbors.push([sourceId, cost]);
      }
    }

    // Update the shortest paths to its neighbors.
    for (const [neighborId, cost] of neighbors) {
      const newDistance = distances[nearestNodeId]! + cost;
      if (newDistance < distances[neighborId]!) {
        distances[neighborId] = newDistance;
        previousNodeIds[neighborId] = nearestNodeId;
      }
    }
  }

  // Rewind from the target to the source, and record the IDs along the way.
  const pathIds = [targetId];
  let currentNodeId = targetId;
  let previousNodeId = previousNodeIds[targetId];
  while (previousNodeId) {
    const edge = edges.find(
      ({ sourceId, targetId }) =>
        (sourceId === currentNodeId && targetId === previousNodeId) ||
        (sourceId === previousNodeId && targetId === currentNodeId)
    );
    pathIds.unshift(edge!.id);
    pathIds.unshift(previousNodeId);
    currentNodeId = previousNodeId;
    previousNodeId = previousNodeIds[previousNodeId];
  }

  return pathIds;
}
