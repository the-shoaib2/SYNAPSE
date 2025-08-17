import React, { useEffect, useRef } from "react";
import { useCanvasContext } from "./CanvasContext";
import { CanvasMessage, MessageAgentType } from "./types";

export const CanvasMessageHandler: React.FC = () => {
  const { addMessage, setConnectionStatus } = useCanvasContext();
  const messageQueueRef = useRef<CanvasMessage[]>([]);
  const isProcessingRef = useRef(false);

  // Handle incoming messages from backend
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message: CanvasMessage = event.data;

        if (message && message.type && message.agent) {
          // Validate message structure
          if (message) {
            // Add to message queue
            messageQueueRef.current.push(message);

            // Process queue if not already processing
            if (!isProcessingRef.current) {
              processMessageQueue();
            }
          } else {
            console.warn("Invalid message received:", message);
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Listen for messages from VS Code extension
    window.addEventListener("message", handleMessage);

    // Set connection status
    setConnectionStatus(true);

    return () => {
      window.removeEventListener("message", handleMessage);
      setConnectionStatus(false);
    };
  }, [setConnectionStatus]);

  // Process message queue
  const processMessageQueue = async () => {
    if (isProcessingRef.current || messageQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    try {
      while (messageQueueRef.current.length > 0) {
        const message = messageQueueRef.current.shift();
        if (message) {
          await processMessage(message);
        }
      }
    } catch (error) {
      console.error("Error processing message queue:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Process individual message
  const processMessage = async (message: CanvasMessage) => {
    try {
      // Add message to Canvas context
      addMessage(message);

      // Handle message based on type
      switch (message.type) {
        case "execution-trace":
          await handleExecutionTraceMessage(message);
          break;
        case "ast-update":
          await handleASTUpdateMessage(message);
          break;
        case "cfg-update":
          await handleCFGUpdateMessage(message);
          break;
        case "variable-update":
          await handleVariableUpdateMessage(message);
          break;
        case "call-stack-update":
          await handleCallStackUpdateMessage(message);
          break;
        case "algorithm-step":
          await handleAlgorithmStepMessage(message);
          break;
        case "visualization-update":
          await handleVisualizationUpdateMessage(message);
          break;
        case "ai-annotation":
          await handleAIAnnotationMessage(message);
          break;
        case "error":
          await handleErrorMessage(message);
          break;
        case "status":
          await handleStatusMessage(message);
          break;
        case "command":
          await handleCommandMessage(message);
          break;
        case "response":
          await handleResponseMessage(message);
          break;
        case "heartbeat":
          await handleHeartbeatMessage(message);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  // Message handlers
  const handleExecutionTraceMessage = async (message: CanvasMessage) => {
    console.log("Processing execution trace message:", message);
    // TODO: Update execution trace panel
  };

  const handleASTUpdateMessage = async (message: CanvasMessage) => {
    console.log("Processing AST update message:", message);
    // TODO: Update AST visualizer panel
  };

  const handleCFGUpdateMessage = async (message: CanvasMessage) => {
    console.log("Processing CFG update message:", message);
    // TODO: Update CFG graph panel
  };

  const handleVariableUpdateMessage = async (message: CanvasMessage) => {
    console.log("Processing variable update message:", message);
    // TODO: Update variable watch panel
  };

  const handleCallStackUpdateMessage = async (message: CanvasMessage) => {
    console.log("Processing call stack update message:", message);
    // TODO: Update call stack panel
  };

  const handleAlgorithmStepMessage = async (message: CanvasMessage) => {
    console.log("Processing algorithm step message:", message);
    // TODO: Update algorithm simulation panel
  };

  const handleVisualizationUpdateMessage = async (message: CanvasMessage) => {
    console.log("Processing visualization update message:", message);
    // TODO: Update visualization panels
  };

  const handleAIAnnotationMessage = async (message: CanvasMessage) => {
    console.log("Processing AI annotation message:", message);
    // TODO: Update AI annotations panel
  };

  const handleErrorMessage = async (message: CanvasMessage) => {
    console.error("Error message received:", message);
    // TODO: Display error in appropriate panel
  };

  const handleStatusMessage = async (message: CanvasMessage) => {
    console.log("Status message received:", message);
    // TODO: Update status display
  };

  const handleCommandMessage = async (message: CanvasMessage) => {
    console.log("Command message received:", message);
    // TODO: Execute command
  };

  const handleResponseMessage = async (message: CanvasMessage) => {
    console.log("Response message received:", message);
    // TODO: Handle response
  };

  const handleHeartbeatMessage = async (message: CanvasMessage) => {
    console.log("Heartbeat message received:", message);
    // TODO: Update agent status
  };

  // Validate message structure
  const validateMessage = (message: CanvasMessage): boolean => {
    return !!(
      message.id &&
      message.agent &&
      message.version &&
      message.timestamp &&
      message.type &&
      message.payload
    );
  };

  // Send message to backend
  const sendMessage = (message: CanvasMessage) => {
    try {
      // Send message to VS Code extension
      if ((window as any).vscode) {
        (window as any).vscode.postMessage(message);
      } else {
        console.warn("VS Code API not available");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Send command to specific agent
  const sendCommand = (
    agent: MessageAgentType,
    command: string,
    parameters: any = {},
  ) => {
    const message: CanvasMessage = {
      id: generateMessageId(),
      agent: "canvas",
      version: "1.0",
      timestamp: new Date().toISOString(),
      type: "command",
      payload: {
        command,
        parameters,
        target: agent,
        responseRequired: true,
        timeout: 5000,
      },
    };

    sendMessage(message);
  };

  // Generate unique message ID
  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Request execution trace
  const requestExecutionTrace = (filePath: string, language: string) => {
    sendCommand("execution-engine", "startTrace", { filePath, language });
  };

  // Request AST generation
  const requestASTGeneration = (code: string, language: string) => {
    sendCommand("parser", "generateAST", { code, language });
  };

  // Request CFG generation
  const requestCFGGeneration = (code: string, language: string) => {
    sendCommand("compiler", "generateCFG", { code, language });
  };

  // Request algorithm simulation
  const requestAlgorithmSimulation = (algorithm: string, data: any) => {
    sendCommand("execution-engine", "simulateAlgorithm", { algorithm, data });
  };

  // Request AI annotation
  const requestAIAnnotation = (context: any) => {
    sendCommand("ai-annotator", "generateAnnotation", { context });
  };

  // Expose methods to window for external access
  useEffect(() => {
    (window as any).CanvasAPI = {
      sendMessage,
      sendCommand,
      requestExecutionTrace,
      requestASTGeneration,
      requestCFGGeneration,
      requestAlgorithmSimulation,
      requestAIAnnotation,
    };

    return () => {
      delete (window as any).CanvasAPI;
    };
  }, []);

  return null; // This component doesn't render anything
};
