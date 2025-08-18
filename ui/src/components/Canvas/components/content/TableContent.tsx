import React from "react";
import { CanvasPanel } from "../../types";

export interface TableContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const TableContent: React.FC<TableContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div className={`table-content ${isActive ? "active" : ""} ${className}`}>
      <div className="content-header">
        <h3>Table</h3>
      </div>
      <div className="content-body">
        <p>Table visualization will be implemented here</p>
      </div>
    </div>
  );
};
