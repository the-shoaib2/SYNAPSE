import React from "react";
import { CanvasPanel } from "../../types";

export interface AIAnnotationsContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const AIAnnotationsContent: React.FC<AIAnnotationsContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`ai-annotations-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>AI Annotations</h3>
      </div>
      <div className="content-body">
        <p>AI annotations will be implemented here</p>
      </div>
    </div>
  );
};
