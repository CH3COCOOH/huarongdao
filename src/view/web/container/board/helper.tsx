import { ChangeEvent, useEffect, useState } from "react";

export function Helper({ setIsDev }: any) {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const closeHelper = () => setIsShow(false);
    window.addEventListener("mousedown", closeHelper);
    return () => window.removeEventListener("mousedown", closeHelper);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toLowerCase();
    setIsDev(val === "bfs");
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
      onMouseDown={(e) => {
        e.stopPropagation();
        setIsShow(true);
      }}
    >
      <img src="/help.svg" width={30} height={30} className="cursor-pointer" />
      <div
        className={`absolute z-10 flex flex-col gap-4 items-center rounded-xl p-3 border bg-white ${!isShow && "hidden"}`}
      >
        <div>移动大方格到出口</div>
        <img src="/demo.gif" />
        <input type="text" onChange={handleChange} className="border rounded-xl px-2" />
      </div>
    </div>
  );
}
