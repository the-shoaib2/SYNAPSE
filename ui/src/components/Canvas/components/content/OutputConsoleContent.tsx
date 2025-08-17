import React from "react";
import { CanvasPanelType } from "../../types";

export interface OutputConsoleContentProps {
  panel: CanvasPanelType;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const OutputConsoleContent: React.FC<OutputConsoleContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`output-console-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Output Console</h3>
      </div>
      <div className="content-body">
        <p>Output console will be implemented here</p>
      </div>
    </div>
  );
};

