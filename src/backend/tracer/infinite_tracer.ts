import { GameStatusConstant } from "../constant/game_status";
import { Checkpoint } from "./checkpoint";
import { Tracer } from "./tracer";

export class InfiniteTracer implements Tracer {
  private history: Checkpoint[];
  private initCkpt: Checkpoint | null;

  constructor() {
    this.history = [];
    this.initCkpt = null;
  }

  public undo(): Checkpoint | null {
    if (this.history.length === 0) {
      return null;
    }
    return this.history.pop()!;
  }

  public redo(): Checkpoint | null {
    return this.initCkpt;
  }

  public resetHistory(): void {
    this.history = [];
  }

  public record(layout: number[], status: GameStatusConstant, moveNum: number): void {
    const ckpt = new Checkpoint(layout, status, moveNum);
    this.history.push(ckpt);
  }

  public setInit(layout: number[], status: GameStatusConstant, moveNum: number): void {
    const ckpt = new Checkpoint(layout, status, moveNum);
    this.initCkpt = ckpt;
  }
}
