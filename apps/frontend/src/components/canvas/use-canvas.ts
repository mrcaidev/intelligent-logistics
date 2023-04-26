import { useGlobalState } from "contexts/global-state";
import { useEffect, useRef, useState } from "react";
import { InternalGraphEdge, InternalGraphNode } from "reagraph";

export function useCanvas() {
  const [menuStatus, setMenuStatus] = useState(0);

  const [actives, setActives] = useState<string[]>([]);

  const [clickedNodeId, setClickedNodeId] = useState("");
  const [clickedEdgeId, setClickedEdgeId] = useState("");

  const onCanvasClick = () => {
    setMenuStatus(0);
    setActives([]);
  };

  const onNodeClick = (node: InternalGraphNode) => {
    setMenuStatus(1);
    setActives([node.id]);
    setClickedNodeId(node.id);
  };

  const onEdgeClick = (edge: InternalGraphEdge) => {
    setMenuStatus(2);
    setActives([edge.id]);
    setClickedEdgeId(edge.id);
  };

  const { currentGraphId, activePath } = useGlobalState();

  useEffect(() => {
    if (!currentGraphId) {
      setMenuStatus(0);
      setActives([]);
      setClickedEdgeId("");
    }
  }, [currentGraphId]);

  const currentPathIndexRef = useRef(0);

  useEffect(() => {
    currentPathIndexRef.current = 0;

    const change = () => {
      if (currentPathIndexRef.current >= activePath.length) {
        setTimeout(() => setActives([]), 1500);
        return;
      }

      currentPathIndexRef.current++;
      setActives(activePath.slice(0, currentPathIndexRef.current));
      setTimeout(change, 500);
    };

    change();
  }, [activePath]);

  return {
    clickedNodeId,
    clickedEdgeId,
    actives,
    menuStatus,
    onCanvasClick,
    onNodeClick,
    onEdgeClick,
  };
}
