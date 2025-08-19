import React from "react";
import { CanvasPanel } from "../types";
import { AIAnnotationsContent } from "./content/AIAnnotationsContent";
import { ASTVisualizerContent } from "./content/ASTVisualizerContent";
import { AlgorithmSimulationContent } from "./content/AlgorithmSimulationContent";
import { CFGGraphContent } from "./content/CFGGraphContent";
import { CallStackContent } from "./content/CallStackContent";
import { ChartContent } from "./content/ChartContent";
import { CodeEditorContent } from "./content/CodeEditorContent";
import { ExecutionTraceContent } from "./content/ExecutionTraceContent";
import { GraphContent } from "./content/GraphContent";
import { OutputConsoleContent } from "./content/OutputConsoleContent";
import { TableContent } from "./content/TableContent";
import { TimelineContent } from "./content/TimelineContent";
import { VariableWatchContent } from "./content/VariableWatchContent";

export interface PanelContentProps {
  panel: CanvasPanel;
  isActive: boolean;
  onDataUpdate: (data: any) => void;
  onStateChange: (state: any) => void;
  className?: string;
}

export const PanelContent: React.FC<PanelContentProps> = ({
  panel,
  isActive,
  onDataUpdate,
  onStateChange,
  className = "",
}) => {
  // Render content based on panel type
  const renderContent = () => {
    switch (panel.type) {
      case "execution-trace":
        return (
          <ExecutionTraceContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "ast-tree":
        return (
          <ASTVisualizerContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "ir-graph":
        return (
          <CFGGraphContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "debugger-watch":
        return (
          <VariableWatchContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "call-graph":
        return (
          <CallStackContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "simulation":
        return (
          <AlgorithmSimulationContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "code-editor":
        return (
          <CodeEditorContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "output-console":
        return (
          <OutputConsoleContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "ai-chat":
        return (
          <AIAnnotationsContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "timeline":
        return (
          <TimelineContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "table":
        return (
          <TableContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "graph":
        return (
          <GraphContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      case "chart":
        return (
          <ChartContent
            panel={panel}
            isActive={isActive}
            onDataUpdate={onDataUpdate}
            onStateChange={onStateChange}
          />
        );

      default:
        return (
          <div className="panel-content-default">
            <p>Unsupported panel type: {panel.type}</p>
            <p>
              Content: {JSON.stringify((panel.data as any)?.content, null, 2)}
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`panel-content ${isActive ? "active" : ""} ${className}`}>
      {renderContent()}
    </div>
  );
};
