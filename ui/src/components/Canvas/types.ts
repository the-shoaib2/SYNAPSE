// ------------------------------
// Canvas Panel Types (Extended)
// ------------------------------
export type CanvasPanelType =
  | "code-editor"
  | "output-console"
  | "flowchart"
  | "timeline"
  | "table"
  | "chart"
  | "pipeline"
  | "ast-tree"
  | "token-stream"
  | "ir-graph"
  | "assembly"
  | "graph"
  | "explanation"
  | "debugger"
  | "simulation"
  | "optimizer"
  | "metrics"
  | "dependency-graph"
  | "call-graph"
  | "memory-visual"
  | "register-visual"
  | "performance-graph"
  | "logs"
  | "notes"
  | "custom-widget"
  | "3d-visual"
  | "network-graph"
  | "heatmap"
  | "profiling"
  | "ai-chat"
  | "refactor-tool"
  | "unit-test-viewer"
  | "lint-results"
  | "coverage"
  | "version-control"
  | "diff-viewer"
  | "benchmark"
  | "optimization-suggestions"
  | "code-snapshot"
  | "simulation-steps"
  | "debugger-watch"
  | "thread-visual"
  | "memory-heap"
  | "register-table"
  | "execution-trace"
  | "custom-interactive";

// Canvas Panel Interface for useCanvasWindow hook
export interface CanvasPanel {
  id: string;
  type: CanvasPanelType;
  title?: string;
  description?: string;
  icon?: string;
  content?: any;
  config?: Record<string, any>;
  state: PanelState;
  data?: any;
  actions?: Array<{
    id: string;
    label: string;
    name?: string;
    description?: string;
    icon?: string;
    enabled: boolean;
    action: () => void;
  }>;
  onStateChange?: (state: PanelState) => void;
  onDataUpdate?: (data: any) => void;
  onAction?: (actionId: string) => void;
  onClose?: () => void;
  onResize?: (dimensions: { width: number; height: number }) => void;
  onMove?: (position: { x: number; y: number }) => void;
  dimensions?: {
    width: number;
    height: number;
    position?: { x: number; y: number };
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

// ------------------------------
// Panel State Extended
// ------------------------------
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
  lastUpdated?: number;
  focused?: boolean;
  collapsed?: boolean;
  isEditable?: boolean;
  isStreaming?: boolean;
  snapshotId?: string;
}

// ------------------------------
// Message Agent Types (Extended)
// ------------------------------
export type MessageAgentType =
  | "user"
  | "assistant"
  | "system"
  | "planner"
  | "parser"
  | "visualizer"
  | "explainer"
  | "simulator"
  | "optimizer"
  | "performance-analyzer"
  | "tester"
  | "refactorer"
  | "code-transformer"
  | "profiler";

// ------------------------------
// AI Agent Extended Types
// ------------------------------
export interface AIAgent {
  id: string;
  name?: string;
  type:
    | "planner"
    | "parser"
    | "visualizer"
    | "explainer"
    | "simulator"
    | "optimizer"
    | "performance-analyzer"
    | "tester"
    | "refactorer"
    | "code-transformer";
  model: string;
  version?: string;
  capabilities: string[];
  active?: boolean;
  lastRun?: number;
  metadata?: Record<string, any>;
  assignedStages?: string[];
  isStreaming?: boolean;
  autoExplain?: boolean;
  debug?: boolean;
  priority?: number;
}

// ------------------------------
// Pipeline Stage Extended
// ------------------------------
export type PipelineStatus =
  | "pending"
  | "running"
  | "completed"
  | "error"
  | "failed"
  | "skipped"
  | "aborted";

export interface PipelineStage {
  id: string;
  name?: string;
  stage: string;
  type: string;
  engine: string;
  inputs: string[];
  outputs: string[];
  editable: boolean;
  visualType: VisualType;
  payload: {
    visual?: any;
    explain?: string;
    runCommands?: string[];
    metadata?: Record<string, any>;
    logs?: string[];
    performance?: Record<string, number>;
    simulationState?: any;
    coverage?: any;
    snapshot?: string;
    metrics?: any;
    debugInfo?: any;
  };
  dependencies?: string[];
  status?: PipelineStatus;
  error?: string;
  createdAt?: number;
  updatedAt?: number;
  priority?: number;
  retries?: number;
  estimatedTime?: number;
  aiAssigned?: string;
  watchers?: string[];
  tags?: string[];
  // Legacy property for backward compatibility
  explanation?: string;
}

// ------------------------------
// Visualization Types (Extended)
// ------------------------------
export type VisualType =
  | "ast-tree"
  | "timeline"
  | "graph"
  | "code-editor"
  | "explanation"
  | "table"
  | "flowchart"
  | "assembly"
  | "ir-graph"
  | "token-stream"
  | "simulation"
  | "optimizer"
  | "dependency-graph"
  | "call-graph"
  | "memory-visual"
  | "register-visual"
  | "performance-graph"
  | "logs"
  | "notes"
  | "custom-widget"
  | "3d-visual"
  | "network-graph"
  | "heatmap"
  | "profiling"
  | "benchmark"
  | "execution-trace"
  | "diff-viewer"
  | "version-control"
  | "coverage"
  | "unit-test-viewer"
  | "optimization-suggestions"
  | "simulation-steps"
  | "debugger-watch"
  | "thread-visual"
  | "memory-heap"
  | "register-table";

// ------------------------------
// Canvas Event Types (Extended)
// ------------------------------
export interface CanvasEvent {
  type:
    | "panel-opened"
    | "panel-closed"
    | "panel-resized"
    | "panel-focused"
    | "panel-blurred"
    | "stage-updated"
    | "stage-started"
    | "stage-completed"
    | "stage-failed"
    | "ai-response"
    | "pipeline-completed"
    | "pipeline-started"
    | "pipeline-aborted"
    | "user-action"
    | "undo"
    | "redo"
    | "drag-drop"
    | "keyboard-input"
    | "mouse-hover"
    | "simulation-step"
    | "debug-step";
  payload?: any;
  timestamp?: number;
  agentId?: string;
  stageId?: string;
}

// ------------------------------
// Canvas Analytics (Extended)
// ------------------------------
export interface CanvasAnalytics {
  totalStages: number;
  stagesCompleted: number;
  stagesFailed: number;
  stagesSkipped: number;
  stagesAborted?: number;
  averageExecutionTime?: number;
  lastUpdated?: number;
  aiCalls?: Record<string, number>;
  panelUsage?: Record<string, number>;
  stageExecutionTimes?: Record<string, number>;
  memoryUsage?: Record<string, number>;
  cpuUsage?: Record<string, number>;
  simulationStats?: Record<string, any>;
  optimizationStats?: Record<string, any>;
  debugStats?: Record<string, any>;
}

// ------------------------------
// Graph / Node / Edge Extended
// ------------------------------
export interface NodeData {
  id: string;
  label: string;
  type: string;
  data?: any;
  position: { x: number; y: number };
  children?: string[];
  parent?: string;
  expanded?: boolean;
  metadata?: Record<string, any>;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: any;
  animated?: boolean;
  metadata?: Record<string, any>;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
  layout: "hierarchical" | "force" | "dagre" | "custom" | "3d";
}

// ------------------------------
// Canvas State and Configuration
// ------------------------------
export interface ExecutionStep {
  stageId: string;
  timestamp: number;
  status: "started" | "completed" | "failed";
  duration?: number;
  output?: any;
  error?: string;
}

export interface CanvasState {
  pipeline: PipelineStage[];
  activeStage: string | null;
  panelStates: Record<string, PanelState>;
  explanations: Record<string, string>;
  isExecuting: boolean;
  executionHistory: ExecutionStep[];
  aiAgents: AIAgent[];
}

export interface CanvasConfig {
  layout: "grid" | "flexible" | "custom";
  defaultPanelSize: { width: number; height: number };
  enableAnimations: boolean;
  theme: "light" | "dark" | "auto";
  aiIntegration: {
    enabled: boolean;
    agents: AIAgent[];
    autoExplain: boolean;
  };
}

// ------------------------------
// Pipeline Plan and Execution
// ------------------------------
export interface PipelinePlan {
  pipeline: PipelineStage[];
  metadata?: Record<string, any>;
  version?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface PipelineExecutionState {
  stageId: string;
  status: PipelineStatus;
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export interface PipelineEngine {
  executeStage(stage: PipelineStage, inputs: any[]): Promise<any>;
  canExecute(stage: PipelineStage): boolean;
  getRenderer(stage: PipelineStage): React.ComponentType<any>;
}
