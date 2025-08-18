import React from "react";
import { CanvasPanel } from "../../types";

export interface ExecutionTraceContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const ExecutionTraceContent: React.FC<ExecutionTraceContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  const content = panel.data.content || [];

  const handleStepClick = (step: any) => {
    // TODO: Handle step selection
    console.log("Step clicked:", step);
  };

  return (
    <div
      className={`execution-trace-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Execution Trace</h3>
        <div className="controls">
          <button className="control-button" title="Play">
            ▶️
          </button>
          <button className="control-button" title="Pause">
            ⏸️
          </button>
          <button className="control-button" title="Step">
            ⏭️
          </button>
          <button className="control-button" title="Reset">
            🔄
          </button>
        </div>
      </div>

      <div className="trace-content">
        {content.length === 0 ? (
          <div className="empty-state">
            <p>No execution trace available</p>
            <p>Run a program to see execution steps</p>
          </div>
        ) : (
          <div className="trace-steps">
            {content.map((step: any, index: number) => (
              <div
                key={index}
                className={`trace-step ${step.isCurrent ? "current" : ""} ${step.isModified ? "modified" : ""}`}
                onClick={() => handleStepClick(step)}
              >
                <div className="step-header">
                  <span className="step-number">{step.lineNumber}</span>
                  <span className="step-function">{step.functionName}</span>
                  <span className="step-time">{step.timestamp}</span>
                </div>
                <div className="step-content">
                  <div className="step-code">{step.code}</div>
                  {step.variables && step.variables.length > 0 && (
                    <div className="step-variables">
                      {step.variables.map((variable: any, varIndex: number) => (
                        <div key={varIndex} className="variable">
                          <span className="variable-name">{variable.name}</span>
                          <span className="variable-value">
                            {variable.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="content-footer">
        <span className="status">
          {content.length > 0 ? `${content.length} steps` : "No steps"}
        </span>
        <span className="current-line">
          {content.find((step: any) => step.isCurrent)?.lineNumber || "N/A"}
        </span>
      </div>
    </div>
  );
};
