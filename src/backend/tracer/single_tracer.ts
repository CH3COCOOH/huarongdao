import { GameStatusConstant } from "../constant/game_status";
import { Checkpoint } from "./checkpoint";
import { Tracer } from "./tracer";

export class SingleTracer implements Tracer {
  private history: Checkpoint | null;
  private initCkpt: Checkpoint | null;

  constructor() {
    this.history = null;
    this.initCkpt = null;
  }

  public undo(): Checkpoint | null {
    const history = this.history;
    this.history = null;
    return history;
  }

  public redo(): Checkpoint | null {
    return this.initCkpt;
  }

  public resetHistory(): void {
    this.history = null;
  }

  public record(layout: number[], status: GameStatusConstant, moveNum: number) {
    const ckpt = new Checkpoint(layout, status, moveNum);
    this.history = ckpt;
  }

  public setInit(layout: number[], status: GameStatusConstant, moveNum: number) {
    const ckpt = new Checkpoint(layout, status, moveNum);
    this.initCkpt = ckpt;
  }
}
