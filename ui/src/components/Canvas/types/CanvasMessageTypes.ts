// Canvas Message Types for Communication Protocol

// Base Message Interface
export interface CanvasMessage {
  id: string;
  agent: string;
  version: string;
  timestamp: string;
  type: string;
  payload: any;
  metadata?: Record<string, any>;
}

// Message Types
export type MessageType =
  | "execution-trace"
  | "ast-update"
  | "cfg-update"
  | "variable-update"
  | "call-stack-update"
  | "algorithm-step"
  | "visualization-update"
  | "ai-annotation"
  | "error"
  | "status"
  | "command"
  | "response"
  | "heartbeat";

// Agent Types
export type MessageAgentType =
  | "planning"
  | "parser"
  | "compiler"
  | "visualization"
  | "editor-assistance"
  | "execution-engine"
  | "ai-annotator"
  | "system";

// Execution Trace Messages
export interface ExecutionTraceMessage extends CanvasMessage {
  type: "execution-trace";
  payload: {
    lineNumber: number;
    functionName: string;
    variables: VariableState[];
    callStack: CallStackEntry[];
    timestamp: number;
    executionId: string;
  };
}

export interface VariableState {
  name: string;
  value: any;
  type: string;
  scope: string;
  lineNumber: number;
  isModified: boolean;
  previousValue?: any;
}

export interface CallStackEntry {
  functionName: string;
  lineNumber: number;
  fileName: string;
  variables: VariableState[];
  depth: number;
}

// AST Update Messages
export interface ASTUpdateMessage extends CanvasMessage {
  type: "ast-update";
  payload: {
    nodes: ASTNode[];
    edges: ASTEdge[];
    highlights: ASTHighlight[];
    metadata: {
      language: string;
      parser: string;
      version: string;
    };
  };
}

export interface ASTNode {
  id: string;
  type: string;
  value: string;
  lineNumber: number;
  columnNumber: number;
  children: string[];
  metadata: Record<string, any>;
}

export interface ASTEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
  metadata: Record<string, any>;
}

export interface ASTHighlight {
  nodeId: string;
  type: "current" | "modified" | "error" | "warning" | "info";
  color: string;
  message?: string;
}

// CFG Update Messages
export interface CFGUpdateMessage extends CanvasMessage {
  type: "cfg-update";
  payload: {
    nodes: CFGNode[];
    edges: CFGEdge[];
    entryPoint: string;
    exitPoints: string[];
    currentBlock: string;
    metadata: {
      language: string;
      optimization: string;
      version: string;
    };
  };
}

export interface CFGNode {
  id: string;
  type: "basic-block" | "decision" | "loop" | "function-call";
  label: string;
  instructions: string[];
  lineNumbers: number[];
  metadata: Record<string, any>;
}

export interface CFGEdge {
  id: string;
  source: string;
  target: string;
  type: "fallthrough" | "conditional" | "loop" | "function-call";
  condition?: string;
  label?: string;
  metadata: Record<string, any>;
}

// Algorithm Simulation Messages
export interface AlgorithmStepMessage extends CanvasMessage {
  type: "algorithm-step";
  payload: {
    stepNumber: number;
    stepName: string;
    description: string;
    data: any;
    visualization: MessageVisualizationData;
    annotations: AIAnnotation[];
    timestamp: number;
    executionId: string;
  };
}

export interface MessageVisualizationData {
  type: "graph" | "array" | "tree" | "table" | "timeline";
  data: any;
  highlights: Highlight[];
  animations: Animation[];
}

export interface Highlight {
  elementId: string;
  type: "current" | "modified" | "compared" | "result";
  color: string;
  message?: string;
}

export interface Animation {
  type: "fade" | "slide" | "scale" | "color" | "custom";
  duration: number;
  easing: string;
  data: any;
}

// AI Annotation Messages
export interface AIAnnotationMessage extends CanvasMessage {
  type: "ai-annotation";
  payload: {
    targetId: string;
    targetType: "node" | "edge" | "line" | "variable" | "step";
    annotation: AIAnnotation;
    priority: "low" | "medium" | "high" | "critical";
    category: string;
    tags: string[];
  };
}

export interface AIAnnotation {
  id: string;
  title: string;
  description: string;
  explanation: string;
  suggestions: string[];
  confidence: number;
  source: string;
  timestamp: number;
}

// Error Messages
export interface ErrorMessage extends CanvasMessage {
  type: "error";
  payload: {
    code: string;
    message: string;
    details?: string;
    stackTrace?: string;
    severity: "warning" | "error" | "critical";
    recoverable: boolean;
    suggestions: string[];
  };
}

// Status Messages
export interface StatusMessage extends CanvasMessage {
  type: "status";
  payload: {
    status: "idle" | "running" | "paused" | "completed" | "error";
    progress?: number;
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  };
}

// Command Messages
export interface CommandMessage extends CanvasMessage {
  type: "command";
  payload: {
    command: string;
    parameters: Record<string, any>;
    target: string;
    responseRequired: boolean;
    timeout?: number;
  };
}

// Response Messages
export interface ResponseMessage extends CanvasMessage {
  type: "response";
  payload: {
    requestId: string;
    success: boolean;
    data?: any;
    error?: string;
    metadata?: Record<string, any>;
  };
}

// Heartbeat Messages
export interface HeartbeatMessage extends CanvasMessage {
  type: "heartbeat";
  payload: {
    agentStatus: "online" | "offline" | "busy" | "error";
    capabilities: string[];
    load: number;
    memory: number;
    uptime: number;
  };
}

// Message Factory
export interface MessageFactory {
  createMessage(
    type: MessageType,
    agent: MessageAgentType,
    payload: any,
  ): CanvasMessage;
  parseMessage(rawMessage: string): CanvasMessage;
  validateMessage(message: CanvasMessage): boolean;
  getMessageSchema(type: MessageType): any;
}

// Message Handler
export interface MessageHandler {
  handleMessage(message: CanvasMessage): void;
  canHandleMessage(message: CanvasMessage): boolean;
  getSupportedMessageTypes(): MessageType[];
}

// Message Queue
export interface MessageQueue {
  enqueue(message: CanvasMessage): void;
  dequeue(): CanvasMessage | undefined;
  peek(): CanvasMessage | undefined;
  clear(): void;
  size(): number;
  isEmpty(): boolean;
}
