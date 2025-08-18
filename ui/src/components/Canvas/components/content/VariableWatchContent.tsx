import React from "react";
import { CanvasPanel } from "../../types";

export interface VariableWatchContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const VariableWatchContent: React.FC<VariableWatchContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`variable-watch-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Variable Watch</h3>
      </div>
      <div className="content-body">
        <p>Variable monitoring will be implemented here</p>
      </div>
    </div>
  );
};
