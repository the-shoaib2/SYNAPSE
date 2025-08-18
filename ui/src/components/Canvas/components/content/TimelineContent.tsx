import React from "react";
import { CanvasPanel } from "../../types";

export interface TimelineContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`timeline-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Timeline</h3>
      </div>
      <div className="content-body">
        <p>Timeline visualization will be implemented here</p>
      </div>
    </div>
  );
};
