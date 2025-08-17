import React, { useEffect, useState } from "react";
import "./CompilationVisualizer.css";

interface CompilationPhase {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
  input: string;
  output: string;
  tools: string[];
  duration: number;
  details: string[];
}

interface CompilationData {
  phases: CompilationPhase[];
  sourceCode: string;
  language: string;
  target: string;
  optimization: string;
}

interface CompilationVisualizerProps {
  data?: CompilationData;
}

export const CompilationVisualizer: React.FC<CompilationVisualizerProps> = ({
  data,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500);

  // Default compilation data for demonstration
  const defaultData: CompilationData = {
    sourceCode: `#include <stdio.h>
int main() {
  printf("Hello World");
  return 0;
}`,
    language: "C",
    target: "x86_64",
    optimization: "O2",
    phases: [
      {
        id: "preprocessing",
        name: "Preprocessing",
        description: "Expand macros, include headers, conditional compilation",
        status: "completed",
        input: "#include <stdio.h>",
        output: "Expanded stdio.h contents",
        tools: ["cpp", "gcc -E"],
        duration: 45,
        details: [
          "Include directive expansion",
          "Macro definition processing",
          "Conditional compilation evaluation",
          "Line number preservation",
        ],
      },
      {
        id: "compilation",
        name: "Compilation",
        description: "Convert C code to assembly language",
        status: "completed",
        input: "Preprocessed C code",
        output: "Assembly code (.s file)",
        tools: ["gcc -S", "clang -S"],
        duration: 120,
        details: [
          "Lexical analysis (tokenization)",
          "Syntax analysis (parsing)",
          "Semantic analysis",
          "Intermediate representation generation",
          "Assembly code generation",
        ],
      },
      {
        id: "assembly",
        name: "Assembly",
        description: "Convert assembly to object code",
        status: "completed",
        input: "Assembly code (.s)",
        output: "Object file (.o)",
        tools: ["as", "gcc -c"],
        duration: 85,
        details: [
          "Assembly parsing",
          "Symbol resolution",
          "Relocation information generation",
          "Object file format creation",
        ],
      },
      {
        id: "linking",
        name: "Linking",
        description: "Combine object files and libraries",
        status: "completed",
        input: "Object files and libraries",
        output: "Executable binary",
        tools: ["ld", "gcc"],
        duration: 200,
        details: [
          "Symbol resolution across objects",
          "Library linking",
          "Address space allocation",
          "Relocation application",
          "Executable format generation",
        ],
      },
    ],
  };

  const compilationData = data || defaultData;

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentPhase < compilationData.phases.length - 1) {
          setCurrentPhase((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentPhase, compilationData.phases.length, playbackSpeed]);

  const playAnimation = () => {
    setIsPlaying(true);
    setCurrentPhase(0);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
  };

  const nextPhase = () => {
    if (currentPhase < compilationData.phases.length - 1) {
      setCurrentPhase((prev) => prev + 1);
    }
  };

  const prevPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase((prev) => prev - 1);
    }
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "🔄";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--vscode-debugIcon-startForeground)";
      case "processing":
        return "var(--vscode-progressBar-background)";
      case "error":
        return "var(--vscode-errorForeground)";
      default:
        return "var(--vscode-descriptionForeground)";
    }
  };

  return (
    <div className="compilation-visualizer">
      <div className="compiler-header">
        <h3>⚙️ Compilation Process Visualization</h3>
        <div className="compiler-info">
          <span>
            <strong>Language:</strong> {compilationData.language}
          </span>
          <span>
            <strong>Target:</strong> {compilationData.target}
          </span>
          <span>
            <strong>Optimization:</strong> {compilationData.optimization}
          </span>
        </div>
      </div>

      <div className="compiler-controls">
        <button onClick={resetAnimation} className="control-btn">
          ⏮️ Reset
        </button>
        <button
          onClick={prevPhase}
          disabled={currentPhase === 0}
          className="control-btn"
        >
          ⏪ Previous
        </button>
        {isPlaying ? (
          <button onClick={pauseAnimation} className="control-btn">
            ⏸️ Pause
          </button>
        ) : (
          <button onClick={playAnimation} className="control-btn">
            ▶️ Play
          </button>
        )}
        <button
          onClick={nextPhase}
          disabled={currentPhase === compilationData.phases.length - 1}
          className="control-btn"
        >
          ⏩ Next
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="speed-select"
          aria-label="Playback Speed"
        >
          <option value={2000}>Slow</option>
          <option value={1500}>Normal</option>
          <option value={800}>Fast</option>
        </select>
      </div>

      <div className="compilation-pipeline">
        <div className="pipeline-header">
          <h4>🔄 Compilation Pipeline</h4>
          <div className="pipeline-progress">
            Phase {currentPhase + 1} of {compilationData.phases.length}
          </div>
        </div>

        <div className="phases-container">
          {compilationData.phases.map((phase, index) => (
            <div
              key={phase.id}
              className={`phase-item ${index === currentPhase ? "active" : ""} ${index < currentPhase ? "completed" : ""}`}
              onClick={() => setCurrentPhase(index)}
            >
              <div className="phase-header">
                <div className="phase-icon">
                  {getPhaseStatusIcon(phase.status)}
                </div>
                <div className="phase-title">
                  <h5>{phase.name}</h5>
                  <span className="phase-duration">{phase.duration}ms</span>
                </div>
                <div
                  className="phase-status"
                  style={{ color: getPhaseStatusColor(phase.status) }}
                >
                  {phase.status}
                </div>
              </div>

              <div className="phase-description">{phase.description}</div>

              <div className="phase-tools">
                <strong>Tools:</strong> {phase.tools.join(", ")}
              </div>

              <div className="phase-io">
                <div className="io-item">
                  <strong>Input:</strong>
                  <code>{phase.input}</code>
                </div>
                <div className="io-item">
                  <strong>Output:</strong>
                  <code>{phase.output}</code>
                </div>
              </div>

              {index === currentPhase && (
                <div className="phase-details">
                  <strong>Process Details:</strong>
                  <ul>
                    {phase.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="source-code-section">
        <h4>📝 Source Code</h4>
        <div className="code-container">
          <pre className="source-code">
            <code>{compilationData.sourceCode}</code>
          </pre>
        </div>
      </div>

      <div className="compilation-stats">
        <h4>📊 Compilation Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <strong>Total Phases:</strong>
            <span>{compilationData.phases.length}</span>
          </div>
          <div className="stat-item">
            <strong>Total Duration:</strong>
            <span>
              {compilationData.phases.reduce(
                (sum, phase) => sum + phase.duration,
                0,
              )}
              ms
            </span>
          </div>
          <div className="stat-item">
            <strong>Current Phase:</strong>
            <span>{compilationData.phases[currentPhase]?.name}</span>
          </div>
          <div className="stat-item">
            <strong>Progress:</strong>
            <span>
              {Math.round(
                ((currentPhase + 1) / compilationData.phases.length) * 100,
              )}
              %
            </span>
          </div>
        </div>
      </div>

      <div className="compilation-flow">
        <h4>🔄 Compilation Flow Diagram</h4>
        <div className="flow-diagram">
          {compilationData.phases.map((phase, index) => (
            <div key={phase.id} className="flow-step">
              <div
                className={`flow-node ${index === currentPhase ? "current" : ""} ${index < currentPhase ? "completed" : ""}`}
              >
                <div className="flow-icon">
                  {getPhaseStatusIcon(phase.status)}
                </div>
                <div className="flow-label">{phase.name}</div>
              </div>
              {index < compilationData.phases.length - 1 && (
                <div className="flow-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



