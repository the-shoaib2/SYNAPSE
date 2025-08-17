import React, { useState } from "react";
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { BinarySearchVisualizer } from "./BinarySearchVisualizer";
import { CodeParser } from "./CodeParser";
import { CompilationVisualizer } from "./CompilationVisualizer";
import { LexerVisualizer } from "./LexerVisualizer";
import { MermaidRenderer } from "./MermaidRenderer";
import { ProjectAnalyzer } from "./ProjectAnalyzer";
import "./SmartVisualizationEngine.css";

interface VisualizationRequest {
  type:
    | "code-analysis"
    | "compilation"
    | "lexer"
    | "binary-search"
    | "project-structure";
  content: string;
  language?: string;
  context?: any;
}

interface VisualizationResult {
  type: string;
  data: any;
  animation: "fade-in" | "slide-up" | "zoom-in" | "flow";
  duration: number;
}

interface SmartEngineConfig {
  enableAI: boolean;
  autoOptimize: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  theme: "light" | "dark" | "auto";
}

export const SmartVisualizationEngine: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentVisualization, setCurrentVisualization] =
    useState<VisualizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [engineConfig, setEngineConfig] = useState<SmartEngineConfig>({
    enableAI: true,
    autoOptimize: true,
    animationSpeed: "normal",
    theme: "auto",
  });

  // AI Prompt Optimization
  const optimizePrompt = async (userInput: string): Promise<string> => {
    if (!engineConfig.enableAI) return userInput;

    // AI-powered prompt enhancement
    const enhancedPrompt = await enhanceUserPrompt(userInput);
    return enhancedPrompt;
  };

  const enhanceUserPrompt = async (input: string): Promise<string> => {
    // Simulate AI enhancement - in real implementation, call your AI service
    const enhancements = {
      "code analysis":
        "Analyze the code structure, show control flow, highlight key functions, and display execution path with step-by-step visualization",
      compilation:
        "Show compilation phases: preprocessing, compilation, assembly, linking. Display AST, symbol table, and optimization steps",
      lexer:
        "Visualize lexical analysis: tokenization, regular expressions, finite automata, and symbol table construction",
      "binary search":
        "Interactive binary search visualization with step-by-step execution, showing comparisons and array state changes",
      "project structure":
        "Analyze project architecture, dependencies, file relationships, and technology stack with interactive diagrams",
    };

    // Detect intent and enhance
    for (const [key, enhancement] of Object.entries(enhancements)) {
      if (input.toLowerCase().includes(key)) {
        return `${input}\n\nEnhanced Analysis: ${enhancement}`;
      }
    }

    return input;
  };

  // Smart Visualization Router
  const routeVisualization = async (
    request: VisualizationRequest,
  ): Promise<VisualizationResult> => {
    setIsProcessing(true);

    try {
      const optimizedPrompt = await optimizePrompt(request.content);

      switch (request.type) {
        case "code-analysis":
          return await handleCodeAnalysis(request.content, request.language);
        case "compilation":
          return await handleCompilation(request.content, request.language);
        case "lexer":
          return await handleLexerAnalysis(request.content);
        case "binary-search":
          return await handleBinarySearch(request.content);
        case "project-structure":
          return await handleProjectAnalysis(request.context);
        default:
          return await handleGenericVisualization(request.content);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Code Analysis Handler
  const handleCodeAnalysis = async (
    code: string,
    language?: string,
  ): Promise<VisualizationResult> => {
    const parser = new CodeParser();
    const ast = await parser.parse(code, language || "auto");

    // Create ReactFlow nodes and edges from AST
    const flowNodes: Node[] = ast.nodes.map((node, index) => ({
      id: node.id,
      type: "codeNode",
      position: { x: index * 200, y: index * 100 },
      data: {
        label: node.type,
        code: node.code,
        description: node.description,
      },
      style: {
        opacity: 0,
        transform: "scale(0.8)",
        transition: "all 0.5s ease",
      },
    }));

    const flowEdges: Edge[] = ast.edges.map((edge, index) => ({
      id: `e${index}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      style: {
        opacity: 0,
        strokeWidth: 2,
        transition: "all 0.5s ease",
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Animate nodes in sequence
    setTimeout(() => animateNodes(flowNodes), 100);

    return {
      type: "code-flow",
      data: { nodes: flowNodes, edges: flowEdges, ast },
      animation: "fade-in",
      duration: 800,
    };
  };

  // Compilation Handler
  const handleCompilation = async (
    code: string,
    language?: string,
  ): Promise<VisualizationResult> => {
    const compiler = new CompilationVisualizer();
    const phases = await compiler.analyzeCompilation(code, language);

    return {
      type: "compilation-phases",
      data: phases,
      animation: "slide-up",
      duration: 1000,
    };
  };

  // Lexer Handler
  const handleLexerAnalysis = async (
    code: string,
  ): Promise<VisualizationResult> => {
    const lexer = new LexerVisualizer();
    const tokens = await lexer.analyze(code);

    return {
      type: "lexer-tokens",
      data: tokens,
      animation: "zoom-in",
      duration: 600,
    };
  };

  // Binary Search Handler
  const handleBinarySearch = async (
    code: string,
  ): Promise<VisualizationResult> => {
    const visualizer = new BinarySearchVisualizer();
    const steps = await visualizer.visualize(code);

    return {
      type: "binary-search-steps",
      data: steps,
      animation: "flow",
      duration: 1200,
    };
  };

  // Project Analysis Handler
  const handleProjectAnalysis = async (
    context: any,
  ): Promise<VisualizationResult> => {
    const analyzer = new ProjectAnalyzer();
    const structure = await analyzer.analyze(context);

    return {
      type: "project-structure",
      data: structure,
      animation: "fade-in",
      duration: 900,
    };
  };

  // Generic Visualization Handler
  const handleGenericVisualization = async (
    content: string,
  ): Promise<VisualizationResult> => {
    // Auto-detect content type and apply best visualization
    if (content.includes("graph") || content.includes("flowchart")) {
      return {
        type: "mermaid",
        data: content,
        animation: "fade-in",
        duration: 500,
      };
    }

    if (content.includes("function") || content.includes("class")) {
      return await handleCodeAnalysis(content);
    }

    // Default to D3.js visualization
    return {
      type: "d3-generic",
      data: content,
      animation: "slide-up",
      duration: 700,
    };
  };

  // Animation System
  const animateNodes = (nodes: Node[]) => {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  style: { ...n.style, opacity: 1, transform: "scale(1)" },
                }
              : n,
          ),
        );
      }, index * 100);
    });

    // Animate edges
    setTimeout(
      () => {
        setEdges((eds) =>
          eds.map((edge) => ({
            ...edge,
            style: { ...edge.style, opacity: 1 },
          })),
        );
      },
      nodes.length * 100 + 200,
    );
  };

  // Example Prompts Handler
  const handleExamplePrompt = async (promptType: string) => {
    const examples = {
      "code-analysis": {
        type: "code-analysis" as const,
        content: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}`,
        language: "javascript",
      },
      compilation: {
        type: "compilation" as const,
        content: `#include <stdio.h>
int main() {
  printf("Hello World");
  return 0;
}`,
        language: "c",
      },
      lexer: {
        type: "lexer" as const,
        content: "int x = 42 + 10;",
        language: "c",
      },
      "binary-search": {
        type: "binary-search" as const,
        content: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
        language: "javascript",
      },
      "project-structure": {
        type: "project-structure" as const,
        content: "Analyze current project structure",
        context: { projectPath: process.cwd() },
      },
    };

    const request = examples[promptType as keyof typeof examples];
    if (request) {
      const result = await routeVisualization(request);
      setCurrentVisualization(result);
    }
  };

  return (
    <div className="smart-visualization-engine">
      {/* Engine Controls */}
      <div className="engine-controls">
        <h2>🧠 Smart Visualization Engine</h2>
        <div className="control-panel">
          <label>
            <input
              type="checkbox"
              checked={engineConfig.enableAI}
              onChange={(e) =>
                setEngineConfig((prev) => ({
                  ...prev,
                  enableAI: e.target.checked,
                }))
              }
            />
            Enable AI Optimization
          </label>
          <label>
            <input
              type="checkbox"
              checked={engineConfig.autoOptimize}
              onChange={(e) =>
                setEngineConfig((prev) => ({
                  ...prev,
                  autoOptimize: e.target.checked,
                }))
              }
            />
            Auto-Optimize Prompts
          </label>
          <select
            value={engineConfig.animationSpeed}
            onChange={(e) =>
              setEngineConfig((prev) => ({
                ...prev,
                animationSpeed: e.target.value as any,
              }))
            }
            aria-label="Animation Speed"
          >
            <option value="slow">Slow Animation</option>
            <option value="normal">Normal Animation</option>
            <option value="fast">Fast Animation</option>
          </select>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="example-prompts">
        <h3>🎯 Example Prompts (Click to Test)</h3>
        <div className="prompt-buttons">
          <button onClick={() => handleExamplePrompt("code-analysis")}>
            1. Code Analysis & Flow
          </button>
          <button onClick={() => handleExamplePrompt("compilation")}>
            2. Compilation Phases
          </button>
          <button onClick={() => handleExamplePrompt("lexer")}>
            3. Lexer & Tokenization
          </button>
          <button onClick={() => handleExamplePrompt("binary-search")}>
            4. Binary Search Visualization
          </button>
          <button onClick={() => handleExamplePrompt("project-structure")}>
            5. Project Structure Analysis
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>🧠 AI is optimizing your request...</p>
        </div>
      )}

      {/* Visualization Area */}
      <div className="visualization-area">
        {currentVisualization && (
          <div
            className={`visualization-container ${currentVisualization.animation}`}
          >
            {currentVisualization.type === "code-flow" && (
              <div className="reactflow-container">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                >
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            )}

            {currentVisualization.type === "mermaid" && (
              <MermaidRenderer
                chartDefinition={currentVisualization.data}
                chartId="smart-engine-mermaid"
                theme="dark"
              />
            )}

            {currentVisualization.type === "compilation-phases" && (
              <CompilationVisualizer data={currentVisualization.data} />
            )}

            {currentVisualization.type === "lexer-tokens" && (
              <LexerVisualizer data={currentVisualization.data} />
            )}

            {currentVisualization.type === "binary-search-steps" && (
              <BinarySearchVisualizer data={currentVisualization.data} />
            )}

            {currentVisualization.type === "project-structure" && (
              <ProjectAnalyzer data={currentVisualization.data} />
            )}
          </div>
        )}
      </div>

      {/* AI Enhancement Display */}
      {engineConfig.enableAI && currentVisualization && (
        <div className="ai-enhancement">
          <h4>🤖 AI Enhancement Applied</h4>
          <p>
            Your request was automatically optimized for better visualization
          </p>
          <details>
            <summary>View AI Analysis</summary>
            <pre>{JSON.stringify(currentVisualization.data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SmartVisualizationEngine;
