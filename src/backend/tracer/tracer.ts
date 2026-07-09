import { GameStatusConstant } from "../constant/game_status";
import { Checkpoint } from "./checkpoint";

export interface Tracer {
  undo(): Checkpoint | null;
  redo(): Checkpoint | null;
  resetHistory(): void;
  record(layout: number[], status: GameStatusConstant, moveNum: number): void;
  setInit(layout: number[], status: GameStatusConstant, moveNum: number): void;
}
