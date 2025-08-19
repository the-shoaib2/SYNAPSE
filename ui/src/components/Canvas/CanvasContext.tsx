import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";
import {
  CanvasConfig,
  CanvasMessage,
  CanvasState,
  ExecutionStep,
  PanelState,
  PipelineStage,
} from "./types";

// Action types for the reducer
type CanvasAction =
  | { type: "SET_PIPELINE"; payload: PipelineStage[] }
  | {
      type: "UPDATE_STAGE";
      payload: { id: string; updates: Partial<PipelineStage> };
    }
  | { type: "SET_ACTIVE_STAGE"; payload: string | null }
  | {
      type: "UPDATE_PANEL_STATE";
      payload: { id: string; updates: Partial<PanelState> };
    }
  | {
      type: "SET_EXPLANATION";
      payload: { stageId: string; explanation: string };
    }
  | { type: "SET_EXECUTING"; payload: boolean }
  | { type: "ADD_EXECUTION_STEP"; payload: any }
  | { type: "SET_CONFIG"; payload: Partial<CanvasConfig> }
  | { type: "RESET_CANVAS" }
  | { type: "LOAD_PIPELINE_FROM_JSON"; payload: string };

// Initial state
const initialState: CanvasState = {
  pipeline: [],
  activeStage: null,
  panelStates: {},
  explanations: {},
  isExecuting: false,
  executionHistory: [],
  aiAgents: [],
};

// Default configuration
const defaultConfig: CanvasConfig = {
  layout: "grid",
  defaultPanelSize: { width: 400, height: 300 },
  enableAnimations: true,
  theme: "auto",
  aiIntegration: {
    enabled: true,
    agents: [
      {
        id: "planner",
        type: "planner",
        model: "gpt-4",
        capabilities: ["pipeline-generation", "stage-planning"],
      },
      {
        id: "parser",
        type: "parser",
        model: "gpt-4",
        capabilities: ["ast-generation", "ir-generation", "tokenization"],
      },
      {
        id: "visualizer",
        type: "visualizer",
        model: "gpt-4",
        capabilities: [
          "graph-generation",
          "timeline-creation",
          "visual-mapping",
        ],
      },
      {
        id: "explainer",
        type: "explainer",
        model: "gpt-4",
        capabilities: [
          "code-explanation",
          "algorithm-explanation",
          "stage-explanation",
        ],
      },
    ],
    autoExplain: true,
  },
};

// Reducer function
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "SET_PIPELINE":
      return {
        ...state,
        pipeline: action.payload,
        panelStates: action.payload.reduce(
          (acc, stage) => {
            acc[stage.id] = {
              isVisible: true,
              isMinimized: false,
              isMaximized: false,
              isPinned: false,
              isResizable: true,
              isDraggable: true,
              isClosable: true,
              isLoading: false,
              hasError: false,
              lastUpdated: Date.now(),
            };
            return acc;
          },
          {} as Record<string, PanelState>,
        ),
      };

    case "UPDATE_STAGE":
      return {
        ...state,
        pipeline: state.pipeline.map((stage: PipelineStage) =>
          stage.id === action.payload.id
            ? { ...stage, ...action.payload.updates }
            : stage,
        ),
      };

    case "SET_ACTIVE_STAGE":
      return {
        ...state,
        activeStage: action.payload,
      };

    case "UPDATE_PANEL_STATE":
      return {
        ...state,
        panelStates: {
          ...state.panelStates,
          [action.payload.id]: {
            ...state.panelStates[action.payload.id],
            ...action.payload.updates,
          },
        },
      };

    case "SET_EXPLANATION":
      return {
        ...state,
        explanations: {
          ...state.explanations,
          [action.payload.stageId]: action.payload.explanation,
        },
      };

    case "SET_EXECUTING":
      return {
        ...state,
        isExecuting: action.payload,
      };

    case "ADD_EXECUTION_STEP":
      return {
        ...state,
        executionHistory: [...state.executionHistory, action.payload],
      };

    case "SET_CONFIG":
      // Config is managed separately in the provider component
      return state;

    case "RESET_CANVAS":
      return initialState;

    case "LOAD_PIPELINE_FROM_JSON":
      try {
        const pipeline = JSON.parse(action.payload);
        return {
          ...state,
          pipeline,
          panelStates: pipeline.reduce(
            (acc: Record<string, PanelState>, stage: PipelineStage) => {
              acc[stage.id] = {
                isVisible: true,
                isMinimized: false,
                isMaximized: false,
                isPinned: false,
                isResizable: true,
                isDraggable: true,
                isClosable: true,
                isLoading: false,
                hasError: false,
                lastUpdated: Date.now(),
              };
              return acc;
            },
            {},
          ),
        };
      } catch (error) {
        console.error("Failed to parse pipeline JSON:", error);
        return state;
      }

    default:
      return state;
  }
}

// Context interface
interface CanvasContextType {
  state: CanvasState;
  config: CanvasConfig;
  dispatch: React.Dispatch<CanvasAction>;

  // Convenience methods
  setPipeline: (pipeline: PipelineStage[]) => void;
  updateStage: (id: string, updates: Partial<PipelineStage>) => void;
  setActiveStage: (id: string | null) => void;
  updatePanelState: (id: string, updates: Partial<PanelState>) => void;
  setExplanation: (stageId: string, explanation: string) => void;
  setExecuting: (executing: boolean) => void;
  addExecutionStep: (step: ExecutionStep) => void;
  resetCanvas: () => void;
  loadPipelineFromJSON: (json: string) => void;

  // AI integration methods
  executeStage: (stageId: string) => Promise<void>;
  regenerateStage: (stageId: string) => Promise<void>;
  explainStage: (stageId: string) => Promise<void>;

  // Utility methods
  getStageById: (id: string) => PipelineStage | undefined;
  getPanelState: (id: string) => PanelState | undefined;
  isStageCompleted: (id: string) => boolean;
  getStageDependencies: (id: string) => PipelineStage[];

  // Message handling methods
  addMessage: (message: CanvasMessage) => void;
  setConnectionStatus: (status: string) => void;

  // State access
  explanations: Record<string, string>;
}

// Create context
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Provider component
interface CanvasProviderProps {
  children: ReactNode;
  initialPipeline?: PipelineStage[];
  initialConfig?: Partial<CanvasConfig>;
}

export function CanvasProvider({
  children,
  initialPipeline = [],
  initialConfig = {},
}: CanvasProviderProps) {
  const [state, dispatch] = useReducer(canvasReducer, {
    ...initialState,
    pipeline: initialPipeline,
  });

  const [config, setConfig] = useState<CanvasConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  // Convenience methods
  const setPipeline = useCallback((pipeline: PipelineStage[]) => {
    dispatch({ type: "SET_PIPELINE", payload: pipeline });
  }, []);

  const updateStage = useCallback(
    (id: string, updates: Partial<PipelineStage>) => {
      dispatch({ type: "UPDATE_STAGE", payload: { id, updates } });
    },
    [],
  );

  const setActiveStage = useCallback((id: string | null) => {
    dispatch({ type: "SET_ACTIVE_STAGE", payload: id });
  }, []);

  const updatePanelState = useCallback(
    (id: string, updates: Partial<PanelState>) => {
      dispatch({ type: "UPDATE_PANEL_STATE", payload: { id, updates } });
    },
    [],
  );

  const setExplanation = useCallback((stageId: string, explanation: string) => {
    dispatch({ type: "SET_EXPLANATION", payload: { stageId, explanation } });
  }, []);

  const setExecuting = useCallback((executing: boolean) => {
    dispatch({ type: "SET_EXECUTING", payload: executing });
  }, []);

  const addExecutionStep = useCallback((step: ExecutionStep) => {
    dispatch({ type: "ADD_EXECUTION_STEP", payload: step });
  }, []);

  const resetCanvas = useCallback(() => {
    dispatch({ type: "RESET_CANVAS" });
  }, []);

  const loadPipelineFromJSON = useCallback((json: string) => {
    dispatch({ type: "LOAD_PIPELINE_FROM_JSON", payload: json });
  }, []);

  // AI integration methods
  const executeStage = useCallback(
    async (stageId: string) => {
      const stage = state.pipeline.find((s: PipelineStage) => s.id === stageId);
      if (!stage) return;

      setExecuting(true);
      addExecutionStep({
        stageId,
        timestamp: Date.now(),
        status: "started",
      });

      try {
        // TODO: Integrate with actual AI execution engine
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateStage(stageId, { status: "completed" });
        addExecutionStep({
          stageId,
          timestamp: Date.now(),
          status: "completed",
          duration: 1000,
        });
      } catch (error) {
        updateStage(stageId, {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        addExecutionStep({
          stageId,
          timestamp: Date.now(),
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setExecuting(false);
      }
    },
    [state.pipeline, setExecuting, addExecutionStep, updateStage],
  );

  const regenerateStage = useCallback(async (stageId: string) => {
    // TODO: Implement stage regeneration logic
    console.log("Regenerating stage:", stageId);
  }, []);

  const explainStage = useCallback(async (stageId: string) => {
    // TODO: Implement AI explanation logic
    console.log("Explaining stage:", stageId);
  }, []);

  // Utility methods
  const getStageById = useCallback(
    (id: string) => {
      return state.pipeline.find((stage: PipelineStage) => stage.id === id);
    },
    [state.pipeline],
  );

  const getPanelState = useCallback(
    (id: string) => {
      return state.panelStates[id];
    },
    [state.panelStates],
  );

  const isStageCompleted = useCallback(
    (id: string) => {
      const stage = getStageById(id);
      return stage?.status === "completed";
    },
    [getStageById],
  );

  const getStageDependencies = useCallback(
    (id: string) => {
      const stage = getStageById(id);
      if (!stage?.dependencies) return [];
      return stage.dependencies
        .map((depId: string) => getStageById(depId))
        .filter(Boolean) as PipelineStage[];
    },
    [getStageById],
  );

  // Message handling methods
  const addMessage = useCallback((message: CanvasMessage) => {
    // TODO: Implement message handling logic
    console.log("Adding message:", message);
  }, []);

  const setConnectionStatus = useCallback((status: string) => {
    // TODO: Implement connection status logic
    console.log("Setting connection status:", status);
  }, []);

  const contextValue: CanvasContextType = {
    state,
    config,
    dispatch,
    setPipeline,
    updateStage,
    setActiveStage,
    updatePanelState,
    setExplanation,
    setExecuting,
    addExecutionStep,
    resetCanvas,
    loadPipelineFromJSON,
    executeStage,
    regenerateStage,
    explainStage,
    getStageById,
    getPanelState,
    isStageCompleted,
    getStageDependencies,
    addMessage,
    setConnectionStatus,
    explanations: state.explanations,
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
}

// Hook to use the canvas context
export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

// Alias for backward compatibility
export const useCanvasContext = useCanvas;
