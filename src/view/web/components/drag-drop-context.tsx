import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ActiveContextType {
  dragId: string | null;
  offset: { x: number; y: number };
  onDragStart: (id: string, startX: number, startY: number, dom: HTMLElement) => void;
  registerDrop: (id: string, el: HTMLElement) => void;
  removeDrop: (id: string) => void;
}

const ActiveContext = createContext<ActiveContextType | null>(null);

export function DragDropContext({ children, onDrop }: any) {
  const dragId = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const [offsetState, setOffsetState] = useState({ x: 0, y: 0 });

  const dropRefs = useRef(new Map<string, HTMLElement>());
  const startCoordsRef = useRef({ x: 0, y: 0 });

  const registerDrop = useCallback((id: string, el: HTMLElement) => {
    dropRefs.current.set(id, el);
  }, []);
  const removeDrop = useCallback((id: string) => {
    dropRefs.current.delete(id);
  }, []);

  const detect = (clientX: number, clientY: number) => {
    for (const [id, el] of dropRefs.current.entries()) {
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return id;
      }
    }
    return null;
  };

  const onDragStart = useCallback(
    (id: string, clientX: number, clientY: number, domRef: HTMLElement) => {
      dragId.current = id;
      startCoordsRef.current = { x: clientX, y: clientY };

      const handlePointerMove = (e: PointerEvent) => {
        const dx = e.clientX - startCoordsRef.current.x;
        const dy = e.clientY - startCoordsRef.current.y;
        offset.current = { x: dx, y: dy };
        setOffsetState({ x: dx, y: dy });
      };

      const handlePointerUp = (e: PointerEvent) => {
        onDrop(dragId.current!, offset.current);

        dragId.current = null;
        offset.current = { x: 0, y: 0 };
        setOffsetState({ x: 0, y: 0 });

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [],
  );

  return (
    <ActiveContext.Provider
      value={{
        dragId: dragId.current,
        offset: offset.current,
        onDragStart,
        registerDrop,
        removeDrop,
      }}
    >
      {children}
    </ActiveContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(ActiveContext);
  if (!context) {
    throw new Error("ERROR! Not in DragDropContext");
  }
  return context;
}
