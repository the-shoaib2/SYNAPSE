import React from "react";
import { CanvasPanelType } from "../../types";

export interface CodeEditorContentProps {
  panel: CanvasPanelType;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const CodeEditorContent: React.FC<CodeEditorContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  return (
    <div
      className={`code-editor-content ${isActive ? "active" : ""} ${className}`}
    >
      <div className="content-header">
        <h3>Code Editor</h3>
      </div>
      <div className="content-body">
        <p>Monaco editor will be implemented here</p>
      </div>
    </div>
  );
};

