import { GameStatusConstant } from "./constant/game_status";
import { levelMap } from "./level";
import { Tracer } from "./tracer/tracer";
import { SingleTracer } from "./tracer/single_tracer";
import { Board } from "./board";
import _ from "lodash";

export class Game {
  private board: Board;
  private moveNum: number;
  private status: GameStatusConstant;
  private level: number;
  private tracer: Tracer;

  constructor(level: number = 1) {
    const layout = levelMap.get(level);
    if (!layout) {
      throw new Error("ERROR! No such level!");
    }
    this.board = new Board(layout);
    this.moveNum = 0;
    this.status = GameStatusConstant.RUNNING;
    this.level = level;
    this.tracer = new SingleTracer();
    this.tracer.setInit(_.cloneDeep(layout), this.status, this.moveNum);
  }

  public move(prev: number, cur: number): boolean {
    if (this.status !== GameStatusConstant.RUNNING) {
      return false;
    }
    const board = this.board;

    if (!board.canMove(prev, cur)) {
      return false;
    }

    this.tracer.record(_.cloneDeep(this.board.getLayout()), this.status, this.moveNum);

    board.move(prev, cur);

    if (board.isWin()) {
      this.status = GameStatusConstant.WIN;
    }
    this.moveNum++;
    return true;
  }

  public undo(): void {
    if (this.moveNum === 0) {
      return;
    }
    if (this.status !== GameStatusConstant.RUNNING) {
      return;
    }

    const ckpt = this.tracer.undo();
    if (!ckpt) {
      return;
    }
    this.moveNum = ckpt.getMoveNum();
    this.status = ckpt.getStatus();
    this.board.setLayout(ckpt.getLayout());
  }

  public redo(): void {
    const ckpt = this.tracer.redo();
    if (!ckpt) {
      return;
    }
    this.moveNum = ckpt.getMoveNum();
    this.status = ckpt.getStatus();
    this.board.setLayout(_.cloneDeep(ckpt.getLayout()));
    this.tracer.resetHistory();
  }

  public getMoveNum(): number {
    return this.moveNum;
  }

  public getStatus(): GameStatusConstant {
    return this.status;
  }

  public getBoard(): Board {
    return this.board;
  }
}
