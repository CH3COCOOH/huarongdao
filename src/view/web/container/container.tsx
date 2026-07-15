import { useState } from "react";
import { Drawer } from "../components/drawer";
import { LevelSelector } from "./levelselector";
import { Board } from "./board/board";

export function Container() {
  const [isSideOpen, setIsSideOpen] = useState(false);
  return (
    <>
      <Drawer isOpen={isSideOpen} setIsOpen={setIsSideOpen}>
        <LevelSelector />
      </Drawer>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-start-4 lg:col-span-6">
          <Board setIsSideOpen={setIsSideOpen} />
        </div>
        <div className="hidden lg:block lg:col-start-10 lg:col-span-3">
          <LevelSelector />
        </div>
      </div>
    </>
  );
}
