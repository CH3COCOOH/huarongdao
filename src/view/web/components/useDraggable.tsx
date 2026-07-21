import { useCallback, useRef } from "react";
import { useDragDrop } from "./drag-drop-context";

export function useDraggable(id: string) {
  const { onDragStart } = useDragDrop();
  const domRef = useRef<HTMLElement | null>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStart(id, e.clientX, e.clientY, domRef.current!);
    },
    [onDragStart, id],
  );

  const setDomRef = useCallback(
    (node: HTMLElement | null) => {
      if (domRef.current) {
        domRef.current.removeEventListener("pointerdown", onPointerDown);
      }
      domRef.current = node;
      if (node) {
        node.addEventListener("pointerdown", onPointerDown);
      }
    },
    [onPointerDown],
  );

  return { setDomRef };
}
