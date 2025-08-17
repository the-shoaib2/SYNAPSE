// Canvas Visualization Types for Dynamic Rendering

// Base Visualization Interface
export interface CanvasVisualization {
  id: string;
  type: VisualizationType;
  data: VisualizationData;
  config: VisualizationConfig;
  metadata: VisualizationMetadata;
  renderer: VisualizationRenderer;
}

// Visualization Types
export type VisualizationType =
  | "graph"
  | "tree"
  | "timeline"
  | "table"
  | "chart"
  | "flow"
  | "network"
  | "heatmap"
  | "scatter"
  | "bar"
  | "line"
  | "pie"
  | "custom";

// Visualization Data
export interface VisualizationData {
  nodes?: VisualizationNode[];
  edges?: VisualizationEdge[];
  series?: DataSeries[];
  categories?: string[];
  values?: number[];
  labels?: string[];
  metadata?: Record<string, any>;
}

// Visualization Node
export interface VisualizationNode {
  id: string;
  label: string;
  type: string;
  data: any;
  position?: Position2D;
  size?: Size2D;
  color?: string;
  shape?: NodeShape;
  metadata?: Record<string, any>;
  children?: string[];
  parent?: string;
}

// Visualization Edge
export interface VisualizationEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: string;
  weight?: number;
  color?: string;
  style?: EdgeStyle;
  metadata?: Record<string, any>;
}

// Data Series for Charts
export interface DataSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
  type?: "line" | "bar" | "scatter" | "area";
  metadata?: Record<string, any>;
}

export interface DataPoint {
  x: any;
  y: any;
  label?: string;
  color?: string;
  size?: number;
  metadata?: Record<string, any>;
}

// Position and Size
export interface Position2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

// Node Shapes
export type NodeShape =
  | "circle"
  | "rectangle"
  | "diamond"
  | "triangle"
  | "hexagon"
  | "star"
  | "custom";

// Edge Styles
export type EdgeStyle =
  | "solid"
  | "dashed"
  | "dotted"
  | "curved"
  | "straight"
  | "custom";

// Visualization Configuration
export interface VisualizationConfig {
  // Layout
  layout: LayoutConfig;

  // Styling
  theme: ThemeConfig;

  // Interactions
  interactions: InteractionConfig;

  // Animations
  animations: AnimationConfig;

  // Performance
  performance: PerformanceConfig;

  // Custom settings
  custom: Record<string, any>;
}

// Layout Configuration
export interface LayoutConfig {
  algorithm: LayoutAlgorithm;
  direction: "TB" | "BT" | "LR" | "RL";
  spacing: number;
  padding: number;
  hierarchical: boolean;
  compact: boolean;
  customSettings: Record<string, any>;
}

export type LayoutAlgorithm =
  | "force"
  | "hierarchical"
  | "grid"
  | "circular"
  | "random"
  | "custom";

// Theme Configuration
export interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  fonts: FontConfig;
  spacing: SpacingConfig;
  borders: BorderConfig;
  shadows: ShadowConfig;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface FontConfig {
  family: string;
  size: number;
  weight: string;
  color: string;
}

export interface SpacingConfig {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export interface BorderConfig {
  width: number;
  style: string;
  color: string;
  radius: number;
}

export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offset: { x: number; y: number };
}

// Interaction Configuration
export interface InteractionConfig {
  zoom: boolean;
  pan: boolean;
  select: boolean;
  hover: boolean;
  drag: boolean;
  resize: boolean;
  click: boolean;
  doubleClick: boolean;
  rightClick: boolean;
  keyboard: boolean;
  touch: boolean;
}

// Animation Configuration
export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  delay: number;
  repeat: boolean;
  reverse: boolean;
  customEasing?: string;
}

// Performance Configuration
export interface PerformanceConfig {
  maxNodes: number;
  maxEdges: number;
  enableVirtualization: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  renderQuality: "low" | "medium" | "high";
  updateThrottle: number;
}

// Visualization Metadata
export interface VisualizationMetadata {
  title: string;
  description?: string;
  author?: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  category: string;
  source: string;
  license?: string;
}

// Visualization Renderer
export interface VisualizationRenderer {
  // Core rendering
  render(): void;
  update(data: VisualizationData): void;
  resize(width: number, height: number): void;
  destroy(): void;

  // Event handling
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;

  // State management
  getState(): RendererState;
  setState(state: Partial<RendererState>): void;

  // Export
  export(format: ExportFormat): Promise<ExportResult>;
  screenshot(): Promise<string>;
}

// Renderer State
export interface RendererState {
  isRendered: boolean;
  isUpdating: boolean;
  hasError: boolean;
  errorMessage?: string;
  performance: RendererPerformance;
  interactions: InteractionState;
}

export interface RendererPerformance {
  renderTime: number;
  updateTime: number;
  frameRate: number;
  memoryUsage: number;
}

export interface InteractionState {
  isZoomed: boolean;
  isPanned: boolean;
  selectedElements: string[];
  hoveredElement?: string;
  dragState?: DragState;
}

export interface DragState {
  isDragging: boolean;
  elementId: string;
  startPosition: Position2D;
  currentPosition: Position2D;
  delta: Position2D;
}

// Export Format
export type ExportFormat = "png" | "svg" | "pdf" | "json" | "html";

export interface ExportResult {
  format: ExportFormat;
  data: any;
  size: number;
  metadata: Record<string, any>;
}

// Visualization Events
export interface VisualizationEvent {
  type: string;
  target: string;
  data: any;
  timestamp: number;
  source: string;
}

export interface NodeClickEvent extends VisualizationEvent {
  type: "node-click";
  data: {
    nodeId: string;
    position: Position2D;
    button: number;
    modifiers: string[];
  };
}

export interface EdgeClickEvent extends VisualizationEvent {
  type: "edge-click";
  data: {
    edgeId: string;
    position: Position2D;
    button: number;
    modifiers: string[];
  };
}

export interface ZoomEvent extends VisualizationEvent {
  type: "zoom";
  data: {
    scale: number;
    center: Position2D;
    delta: number;
  };
}

export interface PanEvent extends VisualizationEvent {
  type: "pan";
  data: {
    delta: Position2D;
    center: Position2D;
  };
}

// Visualization Factory
export interface VisualizationFactory {
  createVisualization(
    type: VisualizationType,
    config?: Partial<VisualizationConfig>,
  ): CanvasVisualization;
  getSupportedTypes(): VisualizationType[];
  getTypeInfo(type: VisualizationType): {
    name: string;
    description: string;
    icon: string;
    category: string;
    defaultConfig: Partial<VisualizationConfig>;
  };
}

// Visualization Registry
export interface VisualizationRegistry {
  registerType(
    type: VisualizationType,
    factory: () => CanvasVisualization,
  ): void;
  unregisterType(type: VisualizationType): void;
  getFactory(type: VisualizationType): (() => CanvasVisualization) | undefined;
  getAllRegisteredTypes(): VisualizationType[];
}

