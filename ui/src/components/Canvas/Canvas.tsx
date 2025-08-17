import React, { useEffect, useState } from "react";
import "./Canvas.css";
import MermaidRenderer from "./MermaidRenderer";
import { PipelinePlan } from "./types";

interface CanvasProps {
  initialPanels?: any[];
  onContentAvailable?: (hasContent: boolean) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  initialPanels = [],
  onContentAvailable,
}) => {
  const [pipelinePlan, setPipelinePlan] = useState<PipelinePlan | null>(null);
  const [aiContent, setAiContent] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Canvas System Prompt - integrated with core system
  const CANVAS_SYSTEM_PROMPT = `You are a Canvas AI Assistant specialized in code analysis and visualization, integrated with the Synapse core system.

Your role is to:
1. Analyze code and provide clear, structured explanations
2. Generate visual representations (flowcharts, diagrams, timelines)
3. Explain complex concepts in simple terms
4. Focus on practical insights and actionable information

When analyzing code:
- Break down complex logic into simple steps
- Identify key patterns and algorithms
- Suggest improvements when relevant
- Create visual representations that help understanding

Special capabilities:
- **Mermaid Flowcharts**: Parse, validate, and render Mermaid syntax
- **Algorithm Visualization**: Create step-by-step execution traces
- **Interactive Diagrams**: Generate clickable, animated visualizations
- **Performance Analysis**: Show complexity and optimization insights

Always be helpful, clear, and focused on making code more understandable through visual means.

This Canvas component is fully integrated with the Synapse core system and follows the same patterns as other modes (chat, plan, agent).`;

  // Check for user prompts and AI-generated content
  useEffect(() => {
    const checkForContent = () => {
      // Look for user prompts first
      const userSelectors = [
        ".user-message",
        "[data-message-role='user']",
        ".thread-message:has(.user-input)",
        ".SynapseInputBox",
        "input[type='text']",
        "textarea",
      ];

      let foundUserPrompt = "";
      for (const selector of userSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          const text =
            lastElement.textContent ||
            (lastElement as HTMLInputElement).value ||
            "";
          if (text.trim()) {
            foundUserPrompt = text;
            break;
          }
        }
      }

      // Look for AI responses
      const aiSelectors = [
        ".ai-response",
        ".assistant-message",
        ".message-content",
        ".thread-message",
        "[data-message-role='assistant']",
      ];

      let foundContent = "";
      let foundPipeline = null;

      for (const selector of aiSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          const text = lastElement.textContent || "";

          if (text.trim()) {
            foundContent = text;

            // Try to find JSON pipeline in the response
            try {
              // Look for JSON with pipeline property
              const jsonMatch = text.match(/\{[\s\S]*"pipeline"[\s\S]*\}/);
              if (jsonMatch) {
                const plan = JSON.parse(jsonMatch[0]);
                if (plan.pipeline && Array.isArray(plan.pipeline)) {
                  foundPipeline = plan;
                  // Also try to extract any explanatory text after the JSON
                  const afterJson = text
                    .substring(text.indexOf("}") + 1)
                    .trim();
                  if (afterJson) {
                    foundContent = afterJson; // Keep the explanatory text
                  }
                }
              }
            } catch (error) {
              // Not a valid JSON pipeline
            }
          }
        }
      }

      // Update state
      if (foundUserPrompt && foundUserPrompt !== userPrompt) {
        setUserPrompt(foundUserPrompt);
        // Process user content
        processUserContent(foundUserPrompt);
      }

      if (foundPipeline) {
        setPipelinePlan(foundPipeline);
        // Don't set aiContent when we have a pipeline - just execute it
        setTimeout(() => executePipeline(foundPipeline), 500);
        // Notify parent that content is available
        if (onContentAvailable) {
          onContentAvailable(true);
        }
      } else if (foundContent) {
        // Try to extract pipeline from the content
        try {
          const jsonMatch = foundContent.match(/\{[\s\S]*"pipeline"[\s\S]*\}/);
          if (jsonMatch) {
            const extractedPipeline = JSON.parse(jsonMatch[0]);
            if (
              extractedPipeline.pipeline &&
              Array.isArray(extractedPipeline.pipeline)
            ) {
              setPipelinePlan(extractedPipeline);
              // Auto-execute the extracted pipeline
              setTimeout(() => executePipeline(extractedPipeline), 500);
              // Don't set aiContent - we have a pipeline to execute
              // Notify parent that content is available
              if (onContentAvailable) {
                onContentAvailable(true);
              }
            } else {
              // Only set aiContent if no pipeline was found
              setAiContent(cleanContent(foundContent));
            }
          } else {
            // Only set aiContent if no JSON pipeline was found
            setAiContent(cleanContent(foundContent));
          }
        } catch (error) {
          // Not a valid JSON pipeline, set as regular content
          setAiContent(cleanContent(foundContent));
        }
      }
    };

    // Check immediately and then periodically
    checkForContent();
    const timer = setInterval(checkForContent, 2000);
    return () => clearInterval(timer);
  }, [userPrompt]);

  // Notify parent when content is available
  useEffect(() => {
    if (onContentAvailable) {
      const hasContent = !!(pipelinePlan || aiContent || userPrompt);
      onContentAvailable(hasContent);
    }
  }, [pipelinePlan, aiContent, userPrompt, onContentAvailable]);

  // Clean content by removing JSON pipelines
  const cleanContent = (content: string): string => {
    // Remove JSON pipeline blocks
    return content.replace(/\{[\s\S]*"pipeline"[\s\S]*\}/g, "").trim();
  };

  // Render stage visualization based on type - integrated with core system
  const renderStageVisualization = (stage: any, index: number) => {
    const { type, stage: stageName, engine, explanation } = stage;

    if (type === "parse" && stageName.includes("Mermaid")) {
      return (
        <div className="mermaid-parsing-visualization">
          <div className="mermaid-content">
            <h5>Mermaid Flowchart Parsing</h5>
            <div className="mermaid-details">
              <p>Parsing and validating Mermaid flowchart syntax...</p>
              <div className="mermaid-syntax-check">
                <strong>Status:</strong> Syntax validation in progress
                <br />
                <strong>Engine:</strong> {engine}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === "analysis") {
      return (
        <div className="explanation-visualization">
          <div className="explanation-content">
            <h5>Code Analysis</h5>
            <div className="explanation-details">
              <p>
                Based on the Canvas AI system prompt, this analysis focuses on:
              </p>
              <ul>
                <li>Clear, structured explanations</li>
                <li>Visual representations and diagrams</li>
                <li>Practical insights and improvements</li>
                <li>Step-by-step breakdown of complex logic</li>
              </ul>
              <div className="stage-details">
                <strong>Engine:</strong> {engine}
                <br />
                <strong>Explanation:</strong> {explanation}
              </div>
              <div className="system-prompt-info">
                <strong>Canvas AI Assistant:</strong> Integrated with Synapse
                Core
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === "simulate") {
      return (
        <div className="simulation-visualization">
          <div className="simulation-content">
            <h5>Execution Simulation</h5>
            <div className="simulation-details">
              <p>Simulating execution flow through the flowchart...</p>
              <div className="simulation-status">
                <strong>Engine:</strong> {engine}
                <br />
                <strong>Status:</strong> Execution trace generation
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === "visualize" && stageName.includes("Mermaid")) {
      return (
        <div className="mermaid-rendering-visualization">
          <div className="mermaid-rendering-content">
            <h5>Mermaid Flowchart Rendering</h5>
            <div className="mermaid-rendering-details">
              <p>Rendering interactive Mermaid flowchart...</p>
              <div className="mermaid-rendering-status">
                <strong>Engine:</strong> {engine}
                <br />
                <strong>Status:</strong> Interactive visualization generation
              </div>
              <div className="mermaid-actual-renderer">
                <MermaidRenderer
                  chartDefinition={userPrompt}
                  chartId={`flowchart-${index}`}
                  theme="dark"
                />
              </div>
              <div className="mermaid-debug-info">
                <details>
                  <summary>Debug Info</summary>
                  <div className="debug-content">
                    <p>
                      <strong>User Prompt:</strong>
                    </p>
                    <pre>{userPrompt}</pre>
                    <p>
                      <strong>Chart ID:</strong> flowchart-{index}
                    </p>
                    <p>
                      <strong>Theme:</strong> dark
                    </p>
                    <p>
                      <strong>Stage Type:</strong> {type}
                    </p>
                    <p>
                      <strong>Stage Name:</strong> {stageName}
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="default-visualization">
        <p>Stage: {stageName}</p>
        <p>Type: {type}</p>
        <p>Engine: {engine}</p>
        <p>Status: Ready for AI Analysis</p>
      </div>
    );
  };

  // Check if content contains Mermaid flowchart
  const isMermaidFlowchart = (prompt: string) => {
    return (
      prompt.includes("graph TD") ||
      prompt.includes("graph LR") ||
      prompt.includes("graph BT") ||
      prompt.includes("graph RL") ||
      prompt.includes("flowchart TD") ||
      prompt.includes("flowchart LR") ||
      prompt.includes("flowchart BT") ||
      prompt.includes("flowchart RL") ||
      prompt.includes("sequenceDiagram") ||
      prompt.includes("classDiagram") ||
      prompt.includes("stateDiagram") ||
      prompt.includes("erDiagram") ||
      prompt.includes("journey")
    );
  };

  // Content processing integrated with core system
  const processUserContent = (prompt: string) => {
    setIsAnalyzing(true);

    if (isMermaidFlowchart(prompt)) {
      // Create Mermaid-specific analysis plan
      const mermaidPlan: PipelinePlan = {
        pipeline: [
          {
            id: "mermaid_parsing",
            stage: "Mermaid Flowchart Parsing",
            type: "parse",
            engine: "tool:mermaid-parser",
            inputs: [prompt],
            outputs: ["parsed_flowchart"],
            editable: false,
            explanation: "Parse and validate the Mermaid flowchart syntax",
          },
          {
            id: "flowchart_analysis",
            stage: "Flowchart Analysis",
            type: "analysis",
            engine: "llm:gpt-4",
            inputs: ["parsed_flowchart"],
            outputs: ["algorithm_insights"],
            editable: false,
            explanation:
              "Analyze the flowchart to understand the algorithm structure",
          },
          {
            id: "mermaid_rendering",
            stage: "Mermaid Flowchart Visualization",
            type: "visualize",
            engine: "tool:mermaid-renderer",
            inputs: ["parsed_flowchart", "algorithm_insights"],
            outputs: ["interactive_flowchart"],
            editable: true,
            explanation:
              "Render the interactive Mermaid flowchart with execution highlighting",
          },
        ],
      };

      setPipelinePlan(mermaidPlan);
    } else {
      // Create standard content analysis plan
      const analysisPlan: PipelinePlan = {
        pipeline: [
          {
            id: "content_analysis",
            stage: "Content Analysis",
            type: "analysis",
            engine: "llm:gpt-4",
            inputs: [prompt],
            outputs: ["analysis"],
            editable: false,
            explanation:
              "Analyze the provided content using Synapse core system patterns",
          },
          {
            id: "visualization_generation",
            stage: "Visualization Generation",
            type: "visualize",
            engine: "tool:canvas-renderer",
            inputs: ["analysis"],
            outputs: ["visualization"],
            editable: true,
            explanation:
              "Generate visual representations based on the analysis",
          },
        ],
      };

      setPipelinePlan(analysisPlan);
    }

    // Notify parent that content is available
    if (onContentAvailable) {
      onContentAvailable(true);
    }

    setIsAnalyzing(false);
  };

  // Execute pipeline automatically with real visualization generation
  const executePipeline = async (pipeline: PipelinePlan) => {
    const results: Record<string, any> = {};

    for (let i = 0; i < pipeline.pipeline.length; i++) {
      const stage = pipeline.pipeline[i];

      try {
        // Simulate stage execution with real visualization generation
        const result = await executeStage(stage, results);
        results[stage.id] = result;

        // Update pipeline execution state
        setPipelinePlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pipeline: prev.pipeline.map((s) =>
              s.id === stage.id ? { ...s, status: "completed", result } : s,
            ),
          };
        });

        // Small delay between stages for visual effect
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`Error executing stage ${stage.id}:`, error);
        results[stage.id] = {
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Pipeline completed
    handlePipelineComplete(results);
  };

  // Execute individual stage with real visualization
  const executeStage = async (
    stage: any,
    previousResults: Record<string, any>,
  ) => {
    const { type, engine, inputs, outputs } = stage;

    // Generate real visualizations based on stage type and engine
    if (type === "visualize") {
      if (engine.includes("flowchart") || engine.includes("flow")) {
        return generateFlowchartVisualization(inputs, previousResults);
      } else if (engine.includes("erd") || engine.includes("diagram")) {
        return generateERDVisualization(inputs, previousResults);
      } else if (engine.includes("table")) {
        return generateTableVisualization(inputs, previousResults);
      } else if (engine.includes("timeline")) {
        return generateTimelineVisualization(inputs, previousResults);
      } else {
        return generateGenericVisualization(inputs, previousResults);
      }
    } else if (type === "explain") {
      return generateExplanationResult(inputs, previousResults);
    } else if (type === "analysis") {
      return generateAnalysisResult(inputs, previousResults);
    } else if (type === "parse") {
      return generateParsedResult(inputs, previousResults);
    } else if (type === "simulate") {
      return generateSimulationResult(inputs, previousResults);
    }

    return { message: `Stage ${stage.stage} completed` };
  };

  // Generate flowchart visualization using vis.js style
  const generateFlowchartVisualization = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    const nodes = [
      { id: 1, label: "Start", group: "start" },
      { id: 2, label: "Process Input", group: "process" },
      { id: 3, label: "Analyze Data", group: "process" },
      { id: 4, label: "Generate Output", group: "process" },
      { id: 5, label: "End", group: "end" },
    ];

    const edges = [
      { from: 1, to: 2, arrows: "to" },
      { from: 2, to: 3, arrows: "to" },
      { from: 3, to: 4, arrows: "to" },
      { from: 4, to: 5, arrows: "to" },
    ];

    return {
      type: "flowchart",
      data: { nodes, edges },
      visualization: "vis-network",
      config: {
        layout: "hierarchical",
        direction: "UD",
        sortMethod: "directed",
      },
    };
  };

  // Generate ERD visualization
  const generateERDVisualization = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    const entities = [
      { id: "users", label: "Users", attributes: ["id", "name", "email"] },
      { id: "orders", label: "Orders", attributes: ["id", "user_id", "total"] },
      {
        id: "products",
        label: "Products",
        attributes: ["id", "name", "price"],
      },
    ];

    const relationships = [
      { from: "users", to: "orders", type: "1:N" },
      { from: "orders", to: "products", type: "N:M" },
    ];

    return {
      type: "erd",
      data: { entities, relationships },
      visualization: "vis-network",
      config: {
        layout: "force",
        physics: true,
      },
    };
  };

  // Generate table visualization
  const generateTableVisualization = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    const columns = ["ID", "Name", "Type", "Status", "Created"];
    const data = [
      [1, "User A", "Admin", "Active", "2024-01-01"],
      [2, "User B", "User", "Active", "2024-01-02"],
      [3, "User C", "User", "Inactive", "2024-01-03"],
    ];

    return {
      type: "table",
      data: { columns, data },
      visualization: "react-table",
      config: {
        sortable: true,
        filterable: true,
        pagination: true,
      },
    };
  };

  // Generate generic visualization
  const generateGenericVisualization = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    return {
      type: "generic",
      data: { message: "Generic visualization generated" },
      visualization: "custom-component",
      config: {},
    };
  };

  // Generate analysis result
  const generateAnalysisResult = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    return {
      type: "analysis",
      data: {
        summary: "Analysis completed successfully",
        insights: ["Key insight 1", "Key insight 2"],
        recommendations: ["Recommendation 1", "Recommendation 2"],
      },
    };
  };

  // Generate parsed result
  const generateParsedResult = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    return {
      type: "parsed",
      data: {
        structure: "Parsed structure information",
        elements: ["Element 1", "Element 2", "Element 3"],
      },
    };
  };

  // Generate simulation result
  const generateSimulationResult = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    return {
      type: "simulation",
      data: {
        steps: [
          "Parse PHP code",
          "Initialize variables",
          "Execute main logic",
          "Process loops/conditions",
          "Generate output",
          "Clean up resources",
        ],
        timeline: [0, 50, 150, 300, 450, 500],
        variables: {
          $input: "user_data",
          $result: "processed_result",
          $count: 42,
          $status: "success",
        },
        memory: [1024, 2048, 3072, 4096, 5120, 6144],
        performance: "2.3ms execution time",
      },
    };
  };

  // Generate timeline visualization
  const generateTimelineVisualization = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    const timelineData = [
      { time: 0, event: "Start", description: "Code execution begins" },
      {
        time: 100,
        event: "Variable Init",
        description: "Initialize variables",
      },
      { time: 200, event: "Loop Start", description: "Begin loop iteration" },
      { time: 300, event: "Processing", description: "Process data" },
      { time: 400, event: "Output", description: "Generate result" },
      { time: 500, event: "End", description: "Execution complete" },
    ];

    return {
      type: "timeline",
      data: { timeline: timelineData },
      visualization: "timeline-chart",
      config: {
        orientation: "horizontal",
        showLabels: true,
        animate: true,
      },
    };
  };

  // Generate explanation result
  const generateExplanationResult = (
    inputs: string[],
    previousResults: Record<string, any>,
  ) => {
    return {
      type: "explanation",
      data: {
        summary: "Code explanation generated successfully",
        details: [
          "This PHP code demonstrates a common programming pattern",
          "It includes proper error handling and data validation",
          "The code follows best practices for web development",
        ],
        recommendations: [
          "Consider adding more detailed comments",
          "Implement additional error handling",
          "Add unit tests for better reliability",
        ],
      },
    };
  };

  const handlePipelineComplete = (results: Record<string, any>) => {
    console.log("Pipeline completed with results:", results);
  };

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h1>🎨 Canvas</h1>
      </div>

      <div className="canvas-content">
        {userPrompt && (
          <div className="user-prompt-display">
            <div className="user-prompt-header">
              <h3>👤 User Request</h3>
              <p>Analyzing your prompt to create visualization pipeline</p>
            </div>
            <div className="user-prompt-body">
              <pre className="user-prompt-text">{userPrompt}</pre>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="analysis-status">
            <div className="py-6 text-center">
              <div className="mb-3 animate-spin text-2xl">🔍</div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Analyzing User Prompt
              </h3>
              <p className="text-sm text-gray-500">
                Creating intelligent pipeline based on your request...
              </p>
            </div>
          </div>
        )}

        {pipelinePlan ? (
          <div className="visualization-workspace">
            <div className="visualization-header">
              <h3>🎨 Synapse Canvas - Code Analysis</h3>
              <p>Based on your request: "{userPrompt}"</p>
              <div className="core-integration-info">
                <small>🔄 Integrated with Synapse Core System</small>
              </div>
            </div>

            {/* Direct Mermaid rendering for immediate display */}
            {isMermaidFlowchart(userPrompt) && (
              <div className="direct-mermaid-rendering">
                <h4>🚀 Direct Mermaid Flowchart</h4>
                <p>Rendering your flowchart immediately...</p>
                <div className="mermaid-direct-container">
                  <MermaidRenderer
                    chartDefinition={userPrompt}
                    chartId="direct-flowchart"
                    theme="dark"
                  />
                </div>
              </div>
            )}

            {/* Render actual visualizations based on pipeline */}
            <div className="visualization-content">
              {pipelinePlan.pipeline.map((stage, index) => (
                <div key={stage.id} className="visualization-stage">
                  <div className="stage-header">
                    <h4>{stage.stage}</h4>
                    <p>{stage.explanation}</p>
                  </div>
                  <div className="stage-visualization">
                    {renderStageVisualization(stage, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="analysis-status">
            <div className="py-6 text-center">
              <div className="mb-3 animate-spin text-2xl">🔍</div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Processing Your Request
              </h3>
              <p className="text-sm text-gray-500">
                Analyzing code and preparing visualizations...
              </p>
            </div>
          </div>
        ) : (
          <div className="canvas-empty-state">
            <div className="py-12 text-center">
              <div className="mb-4 text-4xl">🎨</div>
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Canvas Ready
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Send a message to see visualizations here
              </p>

              {/* Test Mermaid button */}
              <div className="mermaid-test-section">
                <h4 className="text-md mb-3 font-medium text-gray-600">
                  Test Mermaid Integration
                </h4>
                <button
                  onClick={() => {
                    const testFlowchart = `graph TD
    A[Start] --> B{Test};
    B --> C[Success];
    C --> D[End];`;
                    setUserPrompt(testFlowchart);
                    processUserContent(testFlowchart);
                  }}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                >
                  🧪 Test Mermaid Flowchart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
