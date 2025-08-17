import { CanvasPosition } from "./CanvasTypes";

// Panel Types
export type PanelType =
  | "execution-trace"
  | "ast-visualizer"
  | "cfg-graph"
  | "variable-watch"
  | "call-stack"
  | "algorithm-simulation"
  | "code-editor"
  | "output-console"
  | "ai-annotations"
  | "timeline"
  | "table"
  | "graph"
  | "chart"
  | "custom";

// Panel Content Types
export type PanelContentType =
  | "text"
  | "code"
  | "graph"
  | "table"
  | "chart"
  | "timeline"
  | "image"
  | "video"
  | "webview"
  | "monaco-editor"
  | "custom";

// Panel State
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
  errorMessage?: string;
}

// Panel Data
export interface PanelData {
  content: any;
  contentType: PanelContentType;
  metadata?: Record<string, any>;
  timestamp: number;
  version: string;
}

// Panel Configuration
export interface PanelConfig {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontFamily?: string;
  showHeader: boolean;
  showToolbar: boolean;
  showStatusBar: boolean;
  enableSearch: boolean;
  enableFiltering: boolean;
  enableSorting: boolean;
  refreshInterval?: number;
  maxDataPoints?: number;
  autoScroll: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showTooltips: boolean;
}

// Panel Position and Size
export interface PanelDimensions {
  position: CanvasPosition;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  defaultWidth: number;
  defaultHeight: number;
  aspectRatio?: number;
}

// Panel Events
export interface PanelEvent {
  type: string;
  panelId: string;
  timestamp: number;
  data: any;
}

// Panel Actions
export interface PanelAction {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  enabled: boolean;
  visible: boolean;
  action: () => void;
}

// Main Panel Interface
export interface CanvasPanelType {
  id: string;
  type: PanelType;
  title: string;
  description?: string;
  icon?: string;

  // State
  state: PanelState;

  // Data
  data: PanelData;

  // Configuration
  config: PanelConfig;

  // Dimensions
  dimensions: PanelDimensions;

  // Actions
  actions: PanelAction[];

  // Events
  onDataUpdate?: (data: PanelData) => void;
  onStateChange?: (state: PanelState) => void;
  onAction?: (actionId: string) => void;
  onClose?: () => void;
  onResize?: (dimensions: PanelDimensions) => void;
  onMove?: (position: CanvasPosition) => void;

  // Metadata
  createdAt: number;
  updatedAt: number;
  version: string;
  tags: string[];
  category: string;

  // Dependencies
  dependencies?: string[];
  parentPanelId?: string;
  childPanelIds?: string[];

  // Custom properties
  customProps?: Record<string, any>;
}

// Panel Factory
export interface PanelFactory {
  createPanel(
    type: PanelType,
    config?: Partial<CanvasPanelType>,
  ): CanvasPanelType;
  getAvailablePanelTypes(): PanelType[];
  getPanelTypeInfo(type: PanelType): {
    name: string;
    description: string;
    icon: string;
    category: string;
    defaultConfig: Partial<CanvasPanelType>;
  };
}

// Panel Registry
export interface PanelRegistry {
  registerPanelType(type: PanelType, factory: () => CanvasPanelType): void;
  unregisterPanelType(type: PanelType): void;
  getPanelFactory(type: PanelType): (() => CanvasPanelType) | undefined;
  getAllRegisteredTypes(): PanelType[];
}

