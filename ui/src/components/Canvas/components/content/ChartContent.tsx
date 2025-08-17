import React from "react";
import { CanvasPanelType } from "../../types";

export interface ChartContentProps {
  panel: CanvasPanelType;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const ChartContent: React.FC<ChartContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div className={`chart-content ${isActive ? "active" : ""} ${className}`}>
      <div className="content-header">
        <h3>Chart</h3>
      </div>
      <div className="content-body">
        <p>Chart visualization will be implemented here</p>
      </div>
    </div>
  );
};

