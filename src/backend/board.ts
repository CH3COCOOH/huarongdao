export class Board {
  private layout: number[];

  constructor(layout: number[]) {
    this.layout = layout;
  }

  public move(prev: number, cur: number): boolean {
    if (!this.canMove(prev, cur)) {
      return false;
    }

    const layout = this.layout;
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
    return true;
  }

  public canMove(prev: number, cur: number): boolean {
    const range = this.calcRange(prev);
    return range.has(cur);
  }

  public calcRange(prev: number): Set<number> {
    const itemType = this.layout[prev];
    if (itemType === 2) {
      return this.calcRange2(prev, new Set());
    } else if (itemType === 3) {
      return this.calcRange3(prev, new Set());
    } else if (itemType === 4) {
      return this.calcRange4(prev, new Set());
    } else if (itemType === 5) {
      return this.calcRange5(prev, new Set());
    }
    return new Set();
  }

  public calcRange2(prev: number, result: Set<number>): Set<number> {
    const layout = this.layout;

    if (!result.has(prev - 1) && prev % 4 !== 0 && layout[prev - 1] === 0) {
      result.add(prev - 1);
      this.calcRange2(prev - 1, result);
    }
    if (!result.has(prev - 4) && prev > 3 && layout[prev - 4] === 0) {
      result.add(prev - 4);
      this.calcRange2(prev - 4, result);
    }
    if (!result.has(prev + 1) && prev % 4 !== 3 && layout[prev + 1] === 0) {
      result.add(prev + 1);
      this.calcRange2(prev + 1, result);
    }
    if (!result.has(prev + 4) && prev < 16 && layout[prev + 4] === 0) {
      result.add(prev + 4);
      this.calcRange2(prev + 4, result);
    }

    return result;
  }

  public calcRange3(prev: number, result: Set<number>): Set<number> {
    const layout = this.layout;

    if (!result.has(prev - 1) && prev % 4 !== 0) {
      if (layout[prev - 1] === 0 && layout[prev + 3] === 0) {
        result.add(prev - 1);
        this.calcRange3(prev - 1, result);
      }
    }
    if (!result.has(prev - 4) && prev > 3) {
      if (layout[prev - 4] === 0) {
        result.add(prev - 4);
        this.calcRange3(prev - 4, result);
      }
    }
    if (!result.has(prev + 1) && prev % 4 !== 3) {
      if (layout[prev + 1] === 0 && layout[prev + 5] === 0) {
        result.add(prev + 1);
        this.calcRange3(prev + 1, result);
      }
    }
    if (!result.has(prev + 4) && prev < 12) {
      if (layout[prev + 8] === 0) {
        result.add(prev + 4);
        this.calcRange3(prev + 4, result);
      }
    }

    return result;
  }

  public calcRange4(prev: number, result: Set<number>): Set<number> {
    const layout = this.layout;

    if (!result.has(prev - 1) && prev % 4 !== 0) {
      if (layout[prev - 1] === 0) {
        result.add(prev - 1);
        this.calcRange4(prev - 1, result);
      }
    }
    if (!result.has(prev - 4) && prev > 3) {
      if (layout[prev - 4] === 0 && layout[prev - 3] === 0) {
        result.add(prev - 4);
        this.calcRange4(prev - 4, result);
      }
    }
    if (!result.has(prev + 1) && prev % 4 <= 1) {
      if (layout[prev + 2] === 0) {
        result.add(prev + 1);
        this.calcRange4(prev + 1, result);
      }
    }
    if (!result.has(prev + 4) && prev < 16) {
      if (layout[prev + 4] === 0 && layout[prev + 5] === 0) {
        result.add(prev + 4);
        this.calcRange4(prev + 4, result);
      }
    }

    return result;
  }

  public calcRange5(prev: number, result: Set<number>): Set<number> {
    const layout = this.layout;

    if (!result.has(prev - 1) && prev % 4 !== 0) {
      if (layout[prev - 1] === 0 && layout[prev + 3] === 0) {
        result.add(prev - 1);
        this.calcRange5(prev - 1, result);
      }
    }
    if (!result.has(prev - 4) && prev > 3) {
      if (layout[prev - 4] === 0 && layout[prev - 3] === 0) {
        result.add(prev - 4);
        this.calcRange5(prev - 4, result);
      }
    }
    if (!result.has(prev + 1) && prev % 4 <= 1) {
      if (layout[prev + 2] === 0 && layout[prev + 6] === 0) {
        result.add(prev + 1);
        this.calcRange5(prev + 1, result);
      }
    }
    if (!result.has(prev + 4) && prev < 12) {
      if (layout[prev + 8] === 0 && layout[prev + 9] === 0) {
        result.add(prev + 4);
        this.calcRange5(prev + 4, result);
      }
    }

    return result;
  }

  public isWin(): boolean {
    return this.layout[13] === 5;
  }

  public setLayout(layout: number[]): void {
    this.layout = layout;
  }

  public getLayout(): number[] {
    return this.layout;
  }
}
