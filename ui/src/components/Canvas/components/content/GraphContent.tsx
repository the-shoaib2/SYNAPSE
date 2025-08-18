import React from "react";
import { CanvasPanel } from "../../types";

export interface GraphContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const GraphContent: React.FC<GraphContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div className={`graph-content ${isActive ? "active" : ""} ${className}`}>
      <div className="content-header">
        <h3>Graph</h3>
      </div>
      <div className="content-body">
        <p>Graph visualization will be implemented here</p>
      </div>
    </div>
  );
};
