// Core Canvas Types
export interface CanvasPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasLayoutType {
  type: "grid" | "freeform" | "tabs" | "split";
  columns: number;
  rows: number;
  panelPositions: Record<string, CanvasPosition>;
}

export interface CanvasTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
}

export interface CanvasConfig {
  theme: CanvasTheme;
  defaultLayout: CanvasLayoutType;
  maxPanels: number;
  enableAnimations: boolean;
  enableDragAndDrop: boolean;
  enableResizing: boolean;
}

// Canvas Events
export interface CanvasEvent {
  type: string;
  timestamp: number;
  data: any;
  source: string;
}

export interface CanvasDragEvent extends CanvasEvent {
  type: "drag";
  data: {
    panelId: string;
    position: CanvasPosition;
    delta: { x: number; y: number };
  };
}

export interface CanvasResizeEvent extends CanvasEvent {
  type: "resize";
  data: {
    panelId: string;
    oldSize: { width: number; height: number };
    newSize: { width: number; height: number };
  };
}

export interface CanvasFocusEvent extends CanvasEvent {
  type: "focus";
  data: {
    panelId: string;
    previousPanelId?: string;
  };
}

// Canvas State
export interface CanvasGlobalState {
  isFullscreen: boolean;
  isMinimized: boolean;
  isPinned: boolean;
  zIndex: number;
  opacity: number;
}

// Canvas Commands
export interface CanvasCommand {
  id: string;
  name: string;
  description: string;
  shortcut?: string;
  action: () => void;
  enabled: boolean;
  visible: boolean;
}

// Canvas History
export interface CanvasHistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  data: any;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CanvasHistory {
  entries: CanvasHistoryEntry[];
  currentIndex: number;
  maxEntries: number;
}

