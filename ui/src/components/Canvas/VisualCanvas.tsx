import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import "./Canvas.css";
import {
  type VisualSystemPrompt,
  categorizeVisualPrompt,
  optimizeVisualPrompt,
  selectVisualSystemPrompt,
} from "./VisualSystemPrompts";
import type { PipelinePlan, VisualType } from "./types";

interface VisualCanvasProps {
  initialPanels?: any[];
  onContentAvailable?: (hasContent: boolean) => void;
  autoProcessPrompts?: boolean;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  initialPanels = [],
  onContentAvailable,
  autoProcessPrompts = true,
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [visualPipeline, setVisualPipeline] = useState<PipelinePlan | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualElements, setVisualElements] = useState<string[]>([]);

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
          processVisualInput(detectedInput);
        }
      }
    };

    // Check immediately and then periodically
    detectUserInput();
    const timer = setInterval(detectUserInput, 2000);
    return () => clearInterval(timer);
  }, [userInput, autoProcessPrompts]);

  // Process user input for visual-only output
  const processVisualInput = async (input: string) => {
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      // 1. Select appropriate visual system prompt
      const selectedPrompt = selectVisualSystemPrompt(input);

      // 2. Optimize the user input for visual output
      const optimized = optimizeVisualPrompt(input);

      // 3. Categorize the input
      const categories = categorizeVisualPrompt(input);

      // 4. Create visual-only pipeline
      const visual = createVisualPipeline(input, selectedPrompt, categories);
      setVisualPipeline(visual);

      // 5. Store visual elements to generate
      setVisualElements(optimized.visualOutputs);

      // 6. Notify parent
      if (onContentAvailable) {
        onContentAvailable(true);
      }
    } catch (error) {
      console.error("Error processing visual input:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create visual-only pipeline with zero text output
  const createVisualPipeline = (
    input: string,
    systemPrompt: VisualSystemPrompt,
    categories: string[],
  ): PipelinePlan => {
    const visualPipeline = {
      pipeline: [
        {
          id: "visual_analysis_start",
          stage: "Visual Analysis Initiation",
          type: "visual",
          engine: "visual:canvas-renderer",
          inputs: [input],
          outputs: ["visual_analysis_data"],
          editable: false,
          visualType: "analysis-dashboard",
          payload: {
            visual: "dashboard",
            explain: "Starting visual analysis with zero text output",
          },
        },
        {
          id: "structure_visualization",
          stage: "Code Structure Visualization",
          type: "visualize",
          engine: "visual:structure-renderer",
          inputs: ["visual_analysis_data"],
          outputs: ["structure_visuals"],
          editable: true,
          visualType: "ast-tree",
          payload: {
            visual: "ast-tree",
            explain: "Generate AST tree visualization",
          },
        },
        {
          id: "flow_visualization",
          stage: "Execution Flow Visualization",
          type: "visualize",
          engine: "visual:flow-renderer",
          inputs: ["structure_visuals"],
          outputs: ["flow_visuals"],
          editable: true,
          visualType: "flowchart",
          payload: {
            visual: "flowchart",
            explain: "Create execution flow diagram",
          },
        },
        {
          id: "performance_visualization",
          stage: "Performance Visualization",
          type: "visualize",
          engine: "visual:performance-renderer",
          inputs: ["flow_visuals"],
          outputs: ["performance_visuals"],
          editable: true,
          visualType: "performance-graph",
          payload: {
            visual: "performance-graph",
            explain: "Generate performance charts",
          },
        },
        {
          id: "quality_visualization",
          stage: "Code Quality Visualization",
          type: "visualize",
          engine: "visual:quality-renderer",
          inputs: ["performance_visuals"],
          outputs: ["quality_visuals"],
          editable: true,
          visualType: "quality-dashboard",
          payload: {
            visual: "quality-dashboard",
            explain: "Create quality scorecard",
          },
        },
      ],
    };

    // Add category-specific visual stages
    if (categories.includes("php")) {
      visualPipeline.pipeline.push({
        id: "php_visual_analysis",
        stage: "PHP Visual Analysis",
        type: "visualize",
        engine: "visual:php-renderer",
        inputs: ["quality_visuals"],
        outputs: ["php_visuals"],
        editable: false,
        visualType: "class-hierarchy",
        payload: {
          visual: "class-hierarchy",
          explain: "Generate PHP-specific visualizations",
        },
      });
    }

    if (categories.includes("performance-analysis")) {
      visualPipeline.pipeline.push({
        id: "performance_visual_profiling",
        stage: "Performance Visual Profiling",
        type: "visualize",
        engine: "visual:performance-profiler",
        inputs: ["quality_visuals"],
        outputs: ["performance_profiling_visuals"],
        editable: false,
        visualType: "performance-dashboard" as VisualType,
        payload: {
          visual: "performance-dashboard",
          explain: "Create comprehensive performance dashboard",
        },
      });
    }

    if (categories.includes("security-analysis")) {
      visualPipeline.pipeline.push({
        id: "security_visual_assessment",
        stage: "Security Visual Assessment",
        type: "visualize",
        engine: "visual:security-scanner",
        inputs: ["quality_visuals"],
        outputs: ["security_visuals"],
        editable: false,
        visualType: "security-matrix" as VisualType,
        payload: {
          visual: "security-matrix",
          explain: "Generate security assessment matrix",
        },
      });
    }

    return visualPipeline as PipelinePlan;
  };

  return (
    <div className="visual-canvas-container">
      {/* Visual Processing Status */}
      {isProcessing && (
        <div className="visual-processing-status">
          <div className="processing-content">
            <div className="spinner">🎨</div>
            <h3>Visual Canvas Processing</h3>
            <p>Generating pure visualizations with zero text output...</p>
            <div className="processing-steps">
              <div className="step">1. Analyzing input for visual elements</div>
              <div className="step">2. Selecting visual system prompt</div>
              <div className="step">3. Creating visual-only pipeline</div>
              <div className="step">
                4. Generating interactive visualizations
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Canvas Content */}
      <div className="visual-canvas-content">
        {visualPipeline ? (
          <div className="visual-pipeline-info">
            <div className="pipeline-header">
              <h3>🎨 Visual Canvas Pipeline</h3>
              <p>Pure visualizations - No text output</p>
            </div>

            <div className="visual-elements-display">
              <h4>🎯 Visual Elements to Generate</h4>
              <div className="visual-elements-grid">
                {visualElements.map((element, index) => (
                  <div key={index} className="visual-element">
                    <span className="element-icon">📊</span>
                    <span className="element-name">{element}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="visual-pipeline-stages">
              <h4>🎬 Visual Pipeline Stages</h4>
              <div className="stages-list">
                {visualPipeline.pipeline.map((stage, index) => (
                  <div key={stage.id} className="visual-pipeline-stage">
                    <div className="stage-number">{index + 1}</div>
                    <div className="stage-info">
                      <h5>{stage.stage}</h5>
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

      {/* Visual Element Generation Status */}
      {visualElements.length > 0 && (
        <div className="visual-elements-status">
          <h4>🎨 Generating Visual Elements</h4>
          <div className="elements-progress">
            {visualElements.map((element, index) => (
              <div key={index} className="element-progress">
                <div className="element-name">{element}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(index + 1) * 20}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {Math.min((index + 1) * 20, 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualCanvas;
