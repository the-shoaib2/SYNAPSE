import React, { useEffect, useState } from "react";
import { AutoPromptProcessor } from "./AutoPromptProcessor";
import { Canvas } from "./Canvas";
import "./Canvas.css";
import {
  categorizePrompt,
  optimizePrompt,
  selectSystemPrompt,
} from "./SystemPrompts";
import { PipelinePlan, VisualType } from "./types";

interface EnhancedCanvasProps {
  initialPanels?: any[];
  onContentAvailable?: (hasContent: boolean) => void;
  autoProcessPrompts?: boolean;
  showPromptProcessor?: boolean;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  initialPanels = [],
  onContentAvailable,
  autoProcessPrompts = true,
  showPromptProcessor = true,
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [processedInput, setProcessedInput] = useState<any>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [enhancedPipeline, setEnhancedPipeline] = useState<PipelinePlan | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-detect user input from various sources
  useEffect(() => {
    const detectUserInput = () => {
      const selectors = [
        ".user-message",
        '[data-message-role="user"]',
        ".thread-message:has(.user-input)",
        ".SynapseInputBox",
        'input[type="text"]',
        "textarea",
        ".chat-input",
        ".message-input",
      ];

      let detectedInput = "";
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          const text =
            lastElement.textContent ||
            (lastElement as HTMLInputElement).value ||
            "";
          if (text.trim() && text !== userInput) {
            detectedInput = text;
            break;
          }
        }
      }

      if (detectedInput) {
        setUserInput(detectedInput);
        if (autoProcessPrompts) {
          processUserInput(detectedInput);
        }
      }
    };

    // Check immediately and then periodically
    detectUserInput();
    const timer = setInterval(detectUserInput, 2000);
    return () => clearInterval(timer);
  }, [userInput, autoProcessPrompts]);

  // Process user input automatically
  const processUserInput = async (input: string) => {
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      // 1. Select appropriate system prompt
      const selectedPrompt = selectSystemPrompt(input);
      setSystemPrompt(selectedPrompt.prompt);

      // 2. Optimize the user input
      const optimized = optimizePrompt(input);

      // 3. Categorize the input
      const categories = categorizePrompt(input);

      // 4. Create enhanced pipeline with system prompt integration
      const enhanced = createEnhancedPipeline(
        input,
        selectedPrompt,
        categories,
      );
      setEnhancedPipeline(enhanced);

      // 5. Store processed input
      setProcessedInput({
        original: input,
        optimized: optimized.optimized,
        systemPrompt: selectedPrompt,
        categories,
        suggestedActions: optimized.suggestedActions,
      });

      // 6. Notify parent
      if (onContentAvailable) {
        onContentAvailable(true);
      }
    } catch (error) {
      console.error("Error processing user input:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create enhanced pipeline with system prompt integration
  const createEnhancedPipeline = (
    input: string,
    systemPrompt: any,
    categories: string[],
  ): PipelinePlan => {
    const basePipeline = {
      pipeline: [
        {
          id: "system_prompt_integration",
          stage: "System Prompt Integration",
          type: "system",
          engine: "llm:gpt-4",
          inputs: [input, systemPrompt.prompt],
          outputs: ["enhanced_analysis"],
          editable: false,
          visualType: "explanation" as VisualType,
          payload: {
            explain: `Enhanced analysis using ${systemPrompt.name} system prompt`,
            systemPrompt: systemPrompt.prompt,
          },
        },
        {
          id: "comprehensive_analysis",
          stage: "Comprehensive Analysis",
          type: "analysis",
          engine: "llm:gpt-4",
          inputs: ["enhanced_analysis"],
          outputs: ["analysis_results"],
          editable: false,
          visualType: "explanation" as VisualType,
          payload: {
            explain:
              "Comprehensive analysis based on system prompt requirements",
          },
        },
        {
          id: "visualization_generation",
          stage: "Multi-Format Visualization",
          type: "visualize",
          engine: "tool:canvas-renderer",
          inputs: ["analysis_results"],
          outputs: ["visualizations"],
          editable: true,
          visualType: "multi-panel" as VisualType,
          payload: {
            explain:
              "Generate multiple visualization formats based on analysis",
          },
        },
        {
          id: "interactive_elements",
          stage: "Interactive Elements",
          type: "interactive",
          engine: "tool:canvas-renderer",
          inputs: ["visualizations"],
          outputs: ["interactive_components"],
          editable: true,
          visualType: "interactive" as VisualType,
          payload: {
            explain: "Create interactive elements for user exploration",
          },
        },
        {
          id: "optimization_suggestions",
          stage: "Optimization & Improvements",
          type: "optimize",
          engine: "llm:gpt-4",
          inputs: ["analysis_results"],
          outputs: ["optimization_recommendations"],
          editable: true,
          visualType: "explanation" as VisualType,
          payload: {
            explain:
              "Provide optimization suggestions and improvement recommendations",
          },
        },
      ],
    };

    // Add category-specific stages
    if (categories.includes("php")) {
      basePipeline.pipeline.push({
        id: "php_specific_analysis",
        stage: "PHP-Specific Analysis",
        type: "analysis",
        engine: "llm:gpt-4",
        inputs: ["analysis_results"],
        outputs: ["php_insights"],
        editable: false,
        visualType: "explanation" as VisualType,
        payload: {
          explain: "PHP-specific best practices and optimization analysis",
        },
      });
    }

    if (categories.includes("performance-analysis")) {
      basePipeline.pipeline.push({
        id: "performance_profiling",
        stage: "Performance Profiling",
        type: "analysis",
        engine: "tool:performance-analyzer",
        inputs: ["analysis_results"],
        outputs: ["performance_metrics"],
        editable: false,
        visualType: "performance-graph" as VisualType,
        payload: {
          explain: "Detailed performance analysis and optimization insights",
        },
      });
    }

    if (categories.includes("security-analysis")) {
      basePipeline.pipeline.push({
        id: "security_assessment",
        stage: "Security Assessment",
        type: "analysis",
        engine: "tool:security-scanner",
        inputs: ["analysis_results"],
        outputs: ["security_report"],
        editable: false,
        visualType: "security-matrix" as VisualType,
        payload: {
          explain:
            "Comprehensive security analysis and vulnerability assessment",
        },
      });
    }

    return basePipeline;
  };

  // Handle processed input from AutoPromptProcessor
  const handleProcessedInput = (processed: any) => {
    setProcessedInput(processed);
    setSystemPrompt(processed.systemPrompt.prompt);

    // Create enhanced pipeline
    const enhanced = createEnhancedPipeline(
      processed.original,
      processed.systemPrompt,
      processed.categories,
    );
    setEnhancedPipeline(enhanced);
  };

  return (
    <div className="enhanced-canvas-container">
      {/* Auto Prompt Processor */}
      {showPromptProcessor && (
        <div className="prompt-processor-section">
          <AutoPromptProcessor
            userInput={userInput}
            onProcessed={handleProcessedInput}
            autoProcess={autoProcessPrompts}
          />
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="enhanced-processing-status">
          <div className="processing-content">
            <div className="spinner">🚀</div>
            <h3>Enhanced Canvas Processing</h3>
            <p>Integrating system prompts and optimizing your request...</p>
            <div className="processing-steps">
              <div className="step">1. Analyzing input type and context</div>
              <div className="step">2. Selecting optimal system prompt</div>
              <div className="step">3. Optimizing and enhancing request</div>
              <div className="step">
                4. Creating enhanced visualization pipeline
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Canvas with System Prompt Integration */}
      <div className="enhanced-canvas-content">
        {enhancedPipeline ? (
          <div className="enhanced-pipeline-info">
            <div className="pipeline-header">
              <h3>🎯 Enhanced Canvas Pipeline</h3>
              <p>Powered by intelligent system prompt integration</p>
            </div>

            <div className="system-prompt-display">
              <h4>🤖 Active System Prompt</h4>
              <div className="prompt-content">
                <strong>
                  {processedInput?.systemPrompt?.name ||
                    "Comprehensive Analysis"}
                </strong>
                <p>
                  {processedInput?.systemPrompt?.description ||
                    "Complete analysis covering all aspects"}
                </p>
              </div>
            </div>

            <div className="pipeline-stages">
              <h4>📋 Pipeline Stages</h4>
              <div className="stages-list">
                {enhancedPipeline.pipeline.map((stage, index) => (
                  <div key={stage.id} className="pipeline-stage">
                    <div className="stage-number">{index + 1}</div>
                    <div className="stage-info">
                      <h5>{stage.stage}</h5>
                      <p>{stage.payload?.explain}</p>
                      <div className="stage-meta">
                        <span className="type">{stage.type}</span>
                        <span className="engine">{stage.engine}</span>
                        <span className="visual-type">{stage.visualType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Main Canvas Component */}
        <Canvas
          initialPanels={initialPanels}
          onContentAvailable={onContentAvailable}
        />
      </div>

      {/* Follow-up Suggestions */}
      {processedInput && (
        <div className="follow-up-suggestions">
          <h4>💡 Suggested Next Steps</h4>
          <div className="suggestions-grid">
            {processedInput.suggestedActions.map(
              (action: unknown, index: number) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => {
                    const newInput = `${processedInput.original}\n\n${action}`;
                    setUserInput(newInput);
                    processUserInput(newInput);
                  }}
                >
                  {String(action)}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCanvas;
