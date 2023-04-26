import { useGlobalState } from "contexts/global-state";
import { useEffect, useRef, useState } from "react";
import { InternalGraphEdge, InternalGraphNode } from "reagraph";

export function useCanvas() {
  const [actives, setActives] = useState<string[]>([]);

  const [menuStatus, setMenuStatus] = useState(0);

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

  const { activePath } = useGlobalState();
  const currentPathIndexRef = useRef(0);

  useEffect(() => {
    const change = () => {
      if (currentPathIndexRef.current >= activePath.length) {
        currentPathIndexRef.current = 0;
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
