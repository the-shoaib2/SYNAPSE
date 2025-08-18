import React from "react";
import { CanvasPanel } from "../../types";

export interface AlgorithmSimulationContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const AlgorithmSimulationContent: React.FC<
  AlgorithmSimulationContentProps
> = ({ panel, isActive, onDataUpdate, onStateChange, className = "" }) => {
  return (
    <div
      className={`algorithm-simulation-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Algorithm Simulation</h3>
      </div>
      <div className="content-body">
        <p>Algorithm simulation will be implemented here</p>
      </div>
    </div>
  );
};
