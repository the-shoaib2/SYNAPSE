// Canvas Agent Types for Multi-AI Agent Orchestration
import { ASTEdge, ASTNode, CanvasMessage } from "./CanvasMessageTypes";

// Missing type definitions
export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export interface ProgressUpdate {
  progress: number;
  message: string;
  details?: any;
  timestamp: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface ParseMetadata {
  language: string;
  parser: string;
  version: string;
  timestamp: number;
}

export interface ASTMetadata {
  language: string;
  parser: string;
  version: string;
  timestamp: number;
}

export interface AgentVisualizationMetadata {
  type: string;
  version: string;
  timestamp: number;
  config: Record<string, any>;
}

export interface Token {
  type: string;
  value: string;
  lineNumber: number;
  columnNumber: number;
  metadata?: Record<string, any>;
}

// Agent Base Interface
export interface CanvasAgent {
  id: string;
  name: string;
  type: AgentType;
  version: string;
  description: string;
  capabilities: AgentCapability[];
  status: AgentStatus;
  metadata: Record<string, any>;

  // Communication
  sendMessage(message: CanvasMessage): Promise<void>;
  receiveMessage(message: CanvasMessage): void;
  broadcastMessage(message: CanvasMessage): Promise<void>;

  // Lifecycle
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;

  // State Management
  getState(): AgentState;
  updateState(updates: Partial<AgentState>): void;

  // Error Handling
  handleError(error: AgentError): Promise<void>;
  getErrorHistory(): AgentError[];

  // Performance Monitoring
  getPerformanceMetrics(): PerformanceMetrics;
  getResourceUsage(): ResourceUsage;
}

// Agent Types
export type AgentType =
  | "planning"
  | "parser"
  | "compiler"
  | "visualization"
  | "editor-assistance"
  | "execution-engine"
  | "ai-annotator"
  | "orchestrator"
  | "system";

// Agent Capabilities
export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  parameters: CapabilityParameter[];
  examples: CapabilityExample[];
}

export interface CapabilityParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: string;
}

export interface CapabilityExample {
  name: string;
  description: string;
  input: any;
  output: any;
}

// Agent Status
export type AgentStatus =
  | "initializing"
  | "idle"
  | "busy"
  | "processing"
  | "error"
  | "offline"
  | "maintenance";

// Agent State
export interface AgentState {
  status: AgentStatus;
  lastActivity: number;
  messageCount: number;
  errorCount: number;
  performance: PerformanceMetrics;
  resources: ResourceUsage;
  configuration: AgentConfiguration;
}

// Agent Configuration
export interface AgentConfiguration {
  enabled: boolean;
  autoStart: boolean;
  maxConcurrentTasks: number;
  timeout: number;
  retryAttempts: number;
  logLevel: "debug" | "info" | "warn" | "error";
  customSettings: Record<string, any>;
}

// Agent Error
export interface AgentError {
  id: string;
  timestamp: number;
  type: string;
  message: string;
  details?: string;
  stackTrace?: string;
  severity: "low" | "medium" | "high" | "critical";
  recoverable: boolean;
  context: Record<string, any>;
}

// Performance Metrics
export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  successRate: number;
  errorRate: number;
  uptime: number;
  lastResponseTime: number;
  averageResponseTime: number;
  peakResponseTime: number;
}

// Resource Usage
export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: number;
}

// Planning Agent
export interface PlanningAgent extends CanvasAgent {
  type: "planning";

  // Planning specific methods
  createPlan(requirements: PlanningRequirements): Promise<ExecutionPlan>;
  updatePlan(
    planId: string,
    updates: Partial<ExecutionPlan>,
  ): Promise<ExecutionPlan>;
  executePlan(planId: string): Promise<ExecutionResult>;
  monitorProgress(planId: string): Promise<ProgressUpdate>;
}

export interface PlanningRequirements {
  goal: string;
  constraints: string[];
  resources: string[];
  timeline: TimeRange;
  priority: "low" | "medium" | "high" | "critical";
}

export interface ExecutionPlan {
  id: string;
  name: string;
  description: string;
  steps: ExecutionStep[];
  dependencies: Dependency[];
  estimatedDuration: number;
  status: "draft" | "approved" | "in-progress" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
}

export interface ExecutionStep {
  id: string;
  name: string;
  description: string;
  type: "task" | "decision" | "parallel" | "sequential";
  agent: string;
  parameters: Record<string, any>;
  estimatedDuration: number;
  dependencies: string[];
  status: "pending" | "running" | "completed" | "failed" | "skipped";
}

export interface Dependency {
  source: string;
  target: string;
  type: "before" | "after" | "parallel" | "conditional";
  condition?: string;
}

// Parser/Compiler Agent
export interface ParserAgent extends CanvasAgent {
  type: "parser";

  // Parsing specific methods
  parseCode(code: string, language: string): Promise<ParseResult>;
  generateAST(code: string, language: string): Promise<ASTResult>;
  validateSyntax(code: string, language: string): Promise<ValidationResult>;
  suggestFixes(
    code: string,
    language: string,
    errors: ParseError[],
  ): Promise<FixSuggestion[]>;
}

export interface ParseResult {
  success: boolean;
  ast: ASTNode[];
  tokens: Token[];
  errors: ParseError[];
  warnings: ParseWarning[];
  metadata: ParseMetadata;
}

export interface ASTResult {
  nodes: ASTNode[];
  edges: ASTEdge[];
  root: string;
  metadata: ASTMetadata;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ParseError[];
  warnings: ParseWarning[];
  suggestions: string[];
}

export interface ParseError {
  line: number;
  column: number;
  message: string;
  code: string;
  severity: "error" | "warning";
  suggestions: string[];
}

export interface ParseWarning {
  line: number;
  column: number;
  message: string;
  code: string;
  suggestions: string[];
}

export interface FixSuggestion {
  description: string;
  code: string;
  confidence: number;
  explanation: string;
}

// Visualization Agent
export interface VisualizationAgent extends CanvasAgent {
  type: "visualization";

  // Visualization specific methods
  createVisualization(
    data: any,
    type: AgentVisualizationType,
  ): Promise<VisualizationResult>;
  updateVisualization(id: string, data: any): Promise<VisualizationResult>;
  animateTransition(
    from: any,
    to: any,
    duration: number,
  ): Promise<AnimationResult>;
  exportVisualization(
    id: string,
    format: AgentExportFormat,
  ): Promise<AgentExportResult>;
}

export type AgentVisualizationType =
  | "graph"
  | "tree"
  | "timeline"
  | "table"
  | "chart"
  | "flow"
  | "network"
  | "custom";

export interface VisualizationResult {
  id: string;
  type: AgentVisualizationType;
  data: any;
  config: AgentVisualizationConfig;
  metadata: AgentVisualizationMetadata;
}

export interface AgentVisualizationConfig {
  layout: string;
  theme: string;
  animations: boolean;
  interactions: boolean;
  responsive: boolean;
  customSettings: Record<string, any>;
}

export interface AnimationResult {
  id: string;
  duration: number;
  frames: AnimationFrame[];
  status: "pending" | "running" | "completed" | "failed";
}

export interface AnimationFrame {
  timestamp: number;
  data: any;
  easing: string;
}

export type AgentExportFormat = "png" | "svg" | "pdf" | "json" | "html";

export interface AgentExportResult {
  format: AgentExportFormat;
  data: any;
  size: number;
  metadata: Record<string, any>;
}

// Editor Assistance Agent
export interface EditorAssistanceAgent extends CanvasAgent {
  type: "editor-assistance";

  // Editor assistance specific methods
  provideCompletions(context: EditorContext): Promise<CompletionSuggestion[]>;
  suggestRefactoring(
    code: string,
    context: EditorContext,
  ): Promise<RefactoringSuggestion[]>;
  detectIssues(code: string, context: EditorContext): Promise<IssueDetection[]>;
  generateDocumentation(
    code: string,
    context: EditorContext,
  ): Promise<DocumentationResult>;
}

export interface EditorContext {
  filePath: string;
  language: string;
  cursorPosition: Position;
  selectedText: string;
  surroundingCode: string;
  projectContext: ProjectContext;
}

export interface Position {
  line: number;
  character: number;
}

export interface ProjectContext {
  rootPath: string;
  dependencies: string[];
  configuration: Record<string, any>;
  recentFiles: string[];
}

export interface CompletionSuggestion {
  text: string;
  description: string;
  kind: string;
  sortText: string;
  insertText: string;
  range: Range;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface RefactoringSuggestion {
  name: string;
  description: string;
  kind: string;
  changes: TextChange[];
  preview: string;
}

export interface TextChange {
  range: Range;
  text: string;
}

export interface IssueDetection {
  type: string;
  message: string;
  range: Range;
  severity: "info" | "warning" | "error";
  suggestions: string[];
}

export interface DocumentationResult {
  summary: string;
  details: string;
  examples: string[];
  references: string[];
  format: "markdown" | "html" | "plaintext";
}

// Agent Orchestrator
export interface AgentOrchestrator extends CanvasAgent {
  type: "orchestrator";

  // Orchestration specific methods
  registerAgent(agent: CanvasAgent): Promise<void>;
  unregisterAgent(agentId: string): Promise<void>;
  getAgent(agentId: string): CanvasAgent | undefined;
  getAllAgents(): CanvasAgent[];

  // Task Management
  createTask(requirements: TaskRequirements): Promise<Task>;
  assignTask(taskId: string, agentId: string): Promise<void>;
  monitorTask(taskId: string): Promise<TaskStatus>;
  cancelTask(taskId: string): Promise<void>;

  // Communication
  broadcastToAgents(
    message: CanvasMessage,
    filter?: AgentFilter,
  ): Promise<void>;
  routeMessage(message: CanvasMessage): Promise<void>;
}

export interface TaskRequirements {
  type: string;
  description: string;
  requiredCapabilities: string[];
  priority: "low" | "medium" | "high" | "critical";
  estimatedDuration: number;
  dependencies: string[];
}

export interface Task {
  id: string;
  requirements: TaskRequirements;
  assignedAgent?: string;
  status: TaskStatus;
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export type TaskStatusType =
  | "pending"
  | "assigned"
  | "in-progress"
  | "completed"
  | "failed"
  | "cancelled";

export interface TaskStatus {
  status: TaskStatusType;
  progress: number;
  message: string;
  details?: any;
  timestamp: number;
}

export interface AgentFilter {
  types?: AgentType[];
  capabilities?: string[];
  status?: AgentStatus[];
  tags?: string[];
}
