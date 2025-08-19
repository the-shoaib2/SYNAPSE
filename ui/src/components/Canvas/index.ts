// Main Canvas components
export { Canvas } from "./Canvas";
export { CanvasProvider, useCanvas } from "./CanvasContext";
export { CanvasLayout } from "./CanvasLayout";
export { CanvasRenderer } from "./CanvasRenderer";
export { CanvasWindow } from "./CanvasWindow";

// Enhanced Canvas with System Prompts
export { default as AutoPromptProcessor } from "./AutoPromptProcessor";
export { default as EnhancedCanvas } from "./EnhancedCanvas";

// Visual-Only Canvas (No Text Output)
export { default as VisualCanvas } from "./VisualCanvas";

// System Prompts and Optimization
export * from "./SystemPrompts";
export * from "./VisualSystemPrompts";

// Stage panel components
export { ASTTreePanel } from "./stages/ASTTreePanel";
export { EditorPanel } from "./stages/EditorPanel";
export { ExplanationPanel } from "./stages/ExplanationPanel";
export { FlowchartPanel } from "./stages/FlowchartPanel";
export { GraphPanel } from "./stages/GraphPanel";
export { TimelinePanel } from "./stages/TimelinePanel";

// Demo components
export { ASTDemo } from "./stages/ASTDemo";
export { FlowchartDemo } from "./stages/FlowchartDemo";
export { default as SystemPromptDemo } from "./SystemPromptDemo";
export { default as VisualCanvasDemo } from "./VisualCanvasDemo";

// Types
export type {
  AIAgent,
  CanvasConfig,
  CanvasMessage,
  CanvasPanel,
  CanvasPanelType,
  CanvasPosition,
  CanvasState,
  EdgeData,
  ExecutionStep,
  GraphData,
  MessageAgentType,
  NodeData,
  PanelType,
  PipelineStage,
  VisualType,
} from "./types";

// Utilities
export * from "./utils";
