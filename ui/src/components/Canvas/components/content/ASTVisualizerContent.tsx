import React from "react";
import { CanvasPanel } from "../../types";

export interface ASTVisualizerContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const ASTVisualizerContent: React.FC<ASTVisualizerContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`ast-visualizer-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>AST Visualizer</h3>
      </div>
      <div className="content-body">
        <p>AST visualization will be implemented here</p>
        <p>Content: {JSON.stringify((panel.data as any)?.content, null, 2)}</p>
      </div>
    </div>
  );
};
