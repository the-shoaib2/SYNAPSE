// Canvas Panel Types (string literals for panel types)
export type CanvasPanelType =
  | "code-editor"
  | "output-console"
  | "flowchart"
  | "timeline"
  | "table"
  | "chart"
  | "pipeline";

// Legacy Panel Type (for backward compatibility)
export type PanelType = CanvasPanelType;

// Panel State Interface
export interface PanelState {
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isPinned: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  isClosable: boolean;
  isLoading: boolean;
  hasError: boolean;
}

// Canvas Message Interface
export interface CanvasMessage {
  id: string;
  type: string;
  content: any;
  timestamp: number;
}

// Message Agent Type
export type MessageAgentType = "user" | "assistant" | "system";

// Canvas Panel Interface (for existing components)
export interface CanvasPanelData {
  id: string;
  type: CanvasPanelType;
  title: string;
  description: string;
  icon: string;
  state: {
    isVisible: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isPinned: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    isClosable: boolean;
    isLoading: boolean;
    hasError: boolean;
  };
  config: {
    title: string;
    showToolbar: boolean;
    [key: string]: any;
  };
  data: {
    content: any;
    [key: string]: any;
  };
  dimensions: {
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
  };
  actions: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
  }>;
  onDataUpdate: (data: any) => void;
  onAction: (actionId: string) => void;
  onClose: () => void;
  onResize: (dimensions: any) => void;
  onMove: (position: any) => void;
  createdAt: number;
  updatedAt: number;
}

// Canvas Position Interface
export interface CanvasPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Canvas Layout Type Interface
export interface CanvasLayoutType {
  type: "grid" | "flex" | "freeform";
  columns: number;
  rows: number;
  panelPositions: Record<string, CanvasPosition>;
  gap?: number;
  padding?: number;
}

// Pipeline Engine Types
export interface PipelineStage {
  id: string;
  stage: string;
  type: PipelineStageType;
  engine: string;
  inputs: string[];
  outputs: string[];
  editable: boolean;
  explanation: string;
}

export type PipelineStageType =
  | "analysis"
  | "transform"
  | "visualize"
  | "explain"
  | "execute"
  | "simulate"
  | "optimize"
  | "compile"
  | "parse"
  | "timeline"
  | "graph"
  | "tree"
  | "table"
  | "editor"
  | "custom";

export interface PipelinePlan {
  pipeline: PipelineStage[];
}

export interface PipelineExecutionState {
  stageId: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface PipelineEngine {
  executeStage(stage: PipelineStage, inputs: any[]): Promise<any>;
  canExecute(stage: PipelineStage): boolean;
  getRenderer(stage: PipelineStage): React.ComponentType<any>;
}
