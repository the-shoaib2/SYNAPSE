import { CanvasPanelType, CanvasPosition } from "../types";

export class LayoutGrid {
  private columns: number;
  private rows: number;

  constructor(columns: number, rows: number) {
    this.columns = Math.max(1, columns);
    this.rows = Math.max(1, rows);
  }

  public calculatePositions(
    panels: CanvasPanelType[],
  ): Record<string, CanvasPosition> {
    const positions: Record<string, CanvasPosition> = {};
    const cellWidth = 100 / this.columns;
    const cellHeight = 100 / this.rows;

    panels.forEach((panel, index) => {
      const row = Math.floor(index / this.columns);
      const col = index % this.columns;

      if (row < this.rows) {
        positions[panel.id] = {
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        };
      }
    });

    return positions;
  }

  public getGridDimensions(): { columns: number; rows: number } {
    return {
      columns: this.columns,
      rows: this.rows,
    };
  }

  public setGridDimensions(columns: number, rows: number): void {
    this.columns = Math.max(1, columns);
    this.rows = Math.max(1, rows);
  }

  public getCellDimensions(): { width: number; height: number } {
    return {
      width: 100 / this.columns,
      height: 100 / this.rows,
    };
  }

  public getCellPosition(row: number, col: number): CanvasPosition {
    const cellWidth = 100 / this.columns;
    const cellHeight = 100 / this.rows;

    return {
      x: col * cellWidth,
      y: row * cellHeight,
      width: cellWidth,
      height: cellHeight,
    };
  }

  public getCellIndex(x: number, y: number): { row: number; col: number } {
    const cellWidth = 100 / this.columns;
    const cellHeight = 100 / this.rows;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    return {
      row: Math.max(0, Math.min(row, this.rows - 1)),
      col: Math.max(0, Math.min(col, this.columns - 1)),
    };
  }

  public isPositionValid(position: CanvasPosition): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + position.width <= 100 &&
      position.y + position.height <= 100
    );
  }

  public snapToGrid(position: CanvasPosition): CanvasPosition {
    const cellWidth = 100 / this.columns;
    const cellHeight = 100 / this.rows;

    const snappedX = Math.round(position.x / cellWidth) * cellWidth;
    const snappedY = Math.round(position.y / cellHeight) * cellHeight;

    return {
      ...position,
      x: Math.max(0, Math.min(snappedX, 100 - position.width)),
      y: Math.max(0, Math.min(snappedY, 100 - position.height)),
    };
  }
}

