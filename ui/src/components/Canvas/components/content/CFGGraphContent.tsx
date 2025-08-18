import React from "react";
import { CanvasPanel } from "../../types";

export interface CFGGraphContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const CFGGraphContent: React.FC<CFGGraphContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`cfg-graph-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>CFG Graph</h3>
      </div>
      <div className="content-body">
        <p>Control Flow Graph visualization will be implemented here</p>
      </div>
    </div>
  );
};
