// Re-export all types from individual files
export * from "./CanvasPanelTypes";
export * from "./CanvasTypes";

// Re-export specific types to avoid conflicts
export type {
  AIAnnotationMessage,
  AlgorithmStepMessage,
  ASTUpdateMessage,
  CanvasMessage,
  CFGUpdateMessage,
  CommandMessage,
  ErrorMessage,
  ExecutionTraceMessage,
  HeartbeatMessage,
  MessageAgentType,
  MessageType,
  ResponseMessage,
  StatusMessage,
} from "./CanvasMessageTypes";

export type {
  AgentError,
  AgentOrchestrator,
  AgentState,
  AgentType as AgentTypeBase,
  CanvasAgent,
  EditorAssistanceAgent,
  ParserAgent,
  PerformanceMetrics,
  PlanningAgent,
  VisualizationAgent,
} from "./CanvasAgentTypes";

export type {
  AnimationConfig,
  ExportFormat as CanvasExportFormat,
  ExportResult as CanvasExportResult,
  CanvasVisualization,
  VisualizationType as CanvasVisualizationType,
  EdgeStyle,
  InteractionConfig,
  LayoutConfig,
  NodeShape,
  PerformanceConfig,
  ThemeConfig,
  VisualizationConfig,
  VisualizationData,
} from "./CanvasVisualizationTypes";
