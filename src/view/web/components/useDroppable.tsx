import { useRef } from "react";
import { useDragDrop } from "./drag-drop-context";

export function useDroppable(id: string) {
  const { registerDrop, removeDrop } = useDragDrop();
  const elementRef = useRef<HTMLElement | null>(null);

  const setNodeRef = (node: HTMLElement | null) => {
    if (node) {
      elementRef.current = node;
      registerDrop(id, node);
    } else {
      removeDrop(id);
      elementRef.current = null;
    }
  };

  return setNodeRef;
}
