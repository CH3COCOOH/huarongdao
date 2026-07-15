import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../../../backend/game";
import { Solver } from "../../../../backend/solver";
import { GameStatusConstant } from "../../../../backend/constant/game_status";
import { Helper } from "./helper";
import { Item } from "./item";
import { DragDropProvider, DragEndEvent, useDroppable } from "@dnd-kit/react";
import _ from "lodash";

export function Board({ setIsSideOpen }: any) {
  const params = useParams();

  const gameRef = useRef<Game | null>(null);
  const [layout, setLayout] = useState<number[] | null>(null);
  const [moveNum, setMoveNum] = useState(0);
  const [status, setStatus] = useState<GameStatusConstant | null>(null);

  const [isDev, setIsDev] = useState(false);
  const [auto, setAuto] = useState(false);
  const autoRef = useRef(false);

  const { ref: dropRef } = useDroppable({ id: "board" });

  useEffect(() => {
    gameRef.current = new Game(parseInt(params.level ?? "1"));
    update();
  }, [params.level]);

  function update() {
    const game = gameRef.current!;
    setLayout(game.getBoard().getLayout());
    setMoveNum(game.getMoveNum());
    setStatus(game.getStatus());
  }

  function undo() {
    if (autoRef.current) {
      return;
    }
    gameRef.current!.undo();
    update();
  }

  function redo() {
    if (autoRef.current) {
      return;
    }
    gameRef.current!.redo();
    update();
  }

  async function toAuto() {
    const game = gameRef.current!;
    const solver = new Solver(game.getBoard());
    const solution = solver.solve();
    if (!solution) {
      return;
    }
    setAuto(true);
    autoRef.current = true;

    while (autoRef.current && solution.length > 0) {
      const step = solution.shift()!;
      const [prev, cur] = step.split("->").map(Number);
      move(prev, cur);
      await sleep();
    }

    setAuto(false);
    autoRef.current = false;
  }

  function sleep() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  function stopAuto() {
    setAuto(false);
    autoRef.current = false;
  }

  function showLayout() {
    if (!layout) {
      return;
    }
    const result = [];
    for (let i = 0; i < layout.length; i++) {
      if (layout[i] <= 1) {
        continue;
      }
      result.push(<Item key={i} index={i} type={layout[i]} />);
    }
    return result;
  }

  function move(prev: number, cur: number) {
    const game = gameRef.current!;
    const isMoved = game.move(prev, cur);
    if (!isMoved) {
      return;
    }
    update();
  }

  function onDragEnd(e: DragEndEvent) {
    if (autoRef.current) {
      return;
    }
    const windowWidth = window.innerWidth;
    const itemSize = windowWidth >= 1024 ? 80 : 55;

    const deltaX = Math.round(e.operation.transform.x / itemSize);
    const deltaY = Math.round(e.operation.transform.y / itemSize);
    const srcIndex = e.operation.source?.id as number | undefined;
    if (srcIndex === undefined) {
      return;
    }
    const srcX = srcIndex % 4;
    const srcY = Math.floor(srcIndex / 4);

    const tgtX = _.clamp(srcX + deltaX, 0, 3);
    const tgtY = _.clamp(srcY + deltaY, 0, 4);
    const tgtIndex = tgtY * 4 + tgtX;
    move(srcIndex, tgtIndex);
  }

  let modeBtn;
  if (auto) {
    modeBtn = (
      <button
        onClick={(e) => {
          e.stopPropagation();
          stopAuto();
        }}
        className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
      >
        <img src="/stop.svg" width={30} height={30} className="mx-auto" />
      </button>
    );
  } else {
    modeBtn = (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toAuto();
        }}
        className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
      >
        <img src="/play.svg" width={30} height={30} className="mx-auto" />
      </button>
    );
  }

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <div ref={dropRef} className="flex flex-col gap-6 items-center">
        <div className="flex flex-row justify-center items-center gap-1 mt-12">
          <Helper setIsDev={setIsDev} />
          <h1 className="text-4xl text-gray-500">华&nbsp;&nbsp;容&nbsp;&nbsp;道</h1>
          <img
            className="lg:hidden"
            src="/menu.png"
            width={30}
            height={30}
            onClick={(e) => {
              e.stopPropagation();
              setIsSideOpen(true);
            }}
          />
          <div className="hidden lg:block w-7.5 h-7.5" />
        </div>
        <div className="relative">
          <img src="/huaboard.png" className="w-60.5 lg:w-88 h-74.25 lg:h-108" />
          <div className="absolute lg:top-4 lg:left-4 top-2.75 left-2.75 grid lg:grid-cols-[repeat(4,80px)] lg:grid-rows-[repeat(5,80px)] grid-cols-[repeat(4,55px)] grid-rows-[repeat(5,55px)]">
            {showLayout()}
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={undo}
            className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
          >
            <img src="/undo.svg" width={30} height={30} className="mx-auto" />
          </button>
          {isDev && modeBtn}
          <button
            onClick={redo}
            className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
          >
            <img src="/restart.svg" width={30} height={30} className="mx-auto" />
          </button>
        </div>
        <div className="flex justify-center">
          <p>步&nbsp;数: {moveNum}</p>
        </div>
        {status === GameStatusConstant.WIN && (
          <div className="text-2xl text-center text-green-500">胜&nbsp;利</div>
        )}
      </div>
    </DragDropProvider>
  );
}
