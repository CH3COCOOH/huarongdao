import { useRef } from "react";
import { useDragDrop } from "./drag-drop-context";

export function useDraggable(id: string) {
  const { onDragStart } = useDragDrop();
  const domRef = useRef<HTMLElement | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    onDragStart(id, e.clientX, e.clientY, domRef.current!);
  }

  const setDomRef = (node: HTMLElement | null) => {
    domRef.current = node;
  };

  return { onPointerDown, setDomRef };
}
