import React from "react";
import { CanvasPanelType } from "../../types";

export interface CallStackContentProps {
  panel: CanvasPanelType;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const CallStackContent: React.FC<CallStackContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`call-stack-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Call Stack</h3>
      </div>
      <div className="content-body">
        <p>Call stack visualization will be implemented here</p>
      </div>
    </div>
  );
};

