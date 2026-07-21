import { useDraggable } from "../../components/useDraggable";

const colorMap: Record<number, string> = {
  2: "bg-yellow-400",
  3: "bg-violet-400",
  4: "bg-red-400",
  5: "bg-blue-900",
};

export function Item({ index, type }: any) {
  const { setDomRef } = useDraggable(`${index}`);

  const h = Math.floor(index / 4) + 1;
  const w = (index % 4) + 1;

  let colSpan = 0;
  let rowSpan = 0;
  if (type === 2) {
    colSpan = 1;
    rowSpan = 1;
  } else if (type === 3) {
    colSpan = 1;
    rowSpan = 2;
  } else if (type === 4) {
    colSpan = 2;
    rowSpan = 1;
  } else if (type === 5) {
    colSpan = 2;
    rowSpan = 2;
  }
  return (
    <div
      ref={setDomRef}
      style={{ gridColumn: `${w} / span ${colSpan}`, gridRow: `${h} / span ${rowSpan}` }}
      className={`touch-none border-2 rounded-sm ${colorMap[type]}`}
    />
  );
}
