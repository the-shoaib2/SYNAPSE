import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { CanvasLayoutType, CanvasMessage, CanvasPanelData } from "./types";

// Canvas State Interface
export interface CanvasState {
  panels: CanvasPanelData[];
  layout: CanvasLayoutType;
  activePanelId: string | null;
  messages: CanvasMessage[];
  isConnected: boolean;
}

// Canvas Actions
export type CanvasAction =
  | { type: "ADD_PANEL"; payload: CanvasPanelData }
  | { type: "REMOVE_PANEL"; payload: string }
  | {
      type: "UPDATE_PANEL";
      payload: { id: string; updates: Partial<CanvasPanelData> };
    }
  | { type: "SET_ACTIVE_PANEL"; payload: string | null }
  | { type: "UPDATE_LAYOUT"; payload: Partial<CanvasLayoutType> }
  | { type: "ADD_MESSAGE"; payload: CanvasMessage }
  | { type: "CLEAR_MESSAGES"; payload?: void }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean };

// Initial State
const initialState: CanvasState = {
  panels: [],
  layout: {
    type: "grid",
    columns: 2,
    rows: 2,
    panelPositions: {},
  },
  activePanelId: null,
  messages: [],
  isConnected: false,
};

// Canvas Reducer
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "ADD_PANEL":
      return {
        ...state,
        panels: [...state.panels, action.payload],
        activePanelId: action.payload.id,
      };

    case "REMOVE_PANEL":
      return {
        ...state,
        panels: state.panels.filter((panel) => panel.id !== action.payload),
        activePanelId:
          state.activePanelId === action.payload ? null : state.activePanelId,
      };

    case "UPDATE_PANEL":
      return {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id
            ? { ...panel, ...action.payload.updates }
            : panel,
        ),
      };

    case "SET_ACTIVE_PANEL":
      return {
        ...state,
        activePanelId: action.payload,
      };

    case "UPDATE_LAYOUT":
      return {
        ...state,
        layout: { ...state.layout, ...action.payload },
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
      };

    case "SET_CONNECTION_STATUS":
      return {
        ...state,
        isConnected: action.payload,
      };

    default:
      return state;
  }
}

// Canvas Context Interface
interface CanvasContextType {
  state: CanvasState;
  addPanel: (panel: CanvasPanelData) => void;
  removePanel: (id: string) => void;
  updatePanel: (id: string, updates: Partial<CanvasPanelData>) => void;
  setActivePanelId: (id: string | null) => void;
  updateLayout: (updates: Partial<CanvasLayoutType>) => void;
  addMessage: (message: CanvasMessage) => void;
  clearMessages: () => void;
  setConnectionStatus: (status: boolean) => void;

  // Computed values
  panels: CanvasPanelData[];
  layout: CanvasLayoutType;
  activePanelId: string | null;
  messages: CanvasMessage[];
  isConnected: boolean;
}

// Create Context
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Canvas Provider Props
interface CanvasProviderProps {
  children: ReactNode;
}

// Canvas Provider Component
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const addPanel = useCallback((panel: CanvasPanelData) => {
    dispatch({ type: "ADD_PANEL", payload: panel });
  }, []);

  const removePanel = useCallback((id: string) => {
    dispatch({ type: "REMOVE_PANEL", payload: id });
  }, []);

  const updatePanel = useCallback(
    (id: string, updates: Partial<CanvasPanelData>) => {
      dispatch({ type: "UPDATE_PANEL", payload: { id, updates } });
    },
    [],
  );

  const setActivePanelId = useCallback((id: string | null) => {
    dispatch({ type: "SET_ACTIVE_PANEL", payload: id });
  }, []);

  const updateLayout = useCallback((updates: Partial<CanvasLayoutType>) => {
    dispatch({ type: "UPDATE_LAYOUT", payload: updates });
  }, []);

  const addMessage = useCallback((message: CanvasMessage) => {
    dispatch({ type: "ADD_MESSAGE", payload: message });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  const setConnectionStatus = useCallback((status: boolean) => {
    dispatch({ type: "SET_CONNECTION_STATUS", payload: status });
  }, []);

  const contextValue: CanvasContextType = {
    state,
    addPanel,
    removePanel,
    updatePanel,
    setActivePanelId,
    updateLayout,
    addMessage,
    clearMessages,
    setConnectionStatus,

    // Computed values
    panels: state.panels,
    layout: state.layout,
    activePanelId: state.activePanelId,
    messages: state.messages,
    isConnected: state.isConnected,
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom Hook to use Canvas Context
export const useCanvasContext = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
