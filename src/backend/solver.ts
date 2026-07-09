import { Board } from "./board";
import _ from "lodash";

export class Solver {
  private board: Board;
  constructor(board: Board) {
    this.board = _.cloneDeep(board);
  }

  // bfs
  public solve(): string[] | null {
    const board = this.board;
    const start = board.getLayout().join();

    const path = new Map<string, string>();
    path.set(start, "");
    const prompt = new Map<string, string>();
    prompt.set(start, "");
    const next: string[] = [];
    next.push(start);

    let cur: string;
    while (true) {
      if (next.length === 0) {
        return null;
      }
      cur = next.shift()!;
      const layout = cur.split(",").map(Number);
      board.setLayout(layout);
      if (board.isWin()) {
        return this.solutionToDirection(path, prompt, cur);
      }

      for (let f = 0; f < board.getLayout().length; f++) {
        const range = board.calcRange(f);
        for (const t of range) {
          const newLayout = this.move(f, t).join();
          if (!path.has(newLayout)) {
            next.push(newLayout);
            path.set(newLayout, cur);
            prompt.set(newLayout, `${f}->${t}`);
          }
        }
      }
    }
  }

  public solutionToDirection(
    path: Map<string, string>,
    prompt: Map<string, string>,
    end: string,
  ): string[] {
    let cur = end;
    const result = [];

    while (true) {
      const p = prompt.get(cur);
      if (!p) {
        break;
      }
      result.unshift(p);
      cur = path.get(cur)!;
    }
    return result;
  }

  public move(prev: number, cur: number): number[] {
    const layout = this.board.getLayout().slice();
    const itemType = layout[prev];
    if (itemType === 2) {
      layout[prev] = 0;
      layout[cur] = 2;
    } else if (itemType === 3) {
      layout[prev] = 0;
      layout[prev + 4] = 0;
      layout[cur] = 3;
      layout[cur + 4] = 1;
    } else if (itemType === 4) {
      layout[prev] = 0;
      layout[prev + 1] = 0;
      layout[cur] = 4;
      layout[cur + 1] = 1;
    } else if (itemType === 5) {
      layout[prev] = 0;
      layout[prev + 1] = 0;
      layout[prev + 4] = 0;
      layout[prev + 5] = 0;
      layout[cur] = 5;
      layout[cur + 1] = 1;
      layout[cur + 4] = 1;
      layout[cur + 5] = 1;
    }
    return layout;
  }
}
