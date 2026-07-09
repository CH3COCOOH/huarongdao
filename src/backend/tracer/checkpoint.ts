import { GameStatusConstant } from "../constant/game_status";

export class Checkpoint {
  private layout: number[];
  private status: GameStatusConstant;
  private moveNum: number;

  constructor(layout: number[], status: GameStatusConstant, moveNum: number) {
    this.layout = layout;
    this.status = status;
    this.moveNum = moveNum;
  }

  public getLayout(): number[] {
    return this.layout;
  }

  public getStatus(): GameStatusConstant {
    return this.status;
  }

  public getMoveNum(): number {
    return this.moveNum;
  }
}
