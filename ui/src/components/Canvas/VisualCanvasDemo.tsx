import React, { useState } from "react";
import "./Canvas.css";
import { VisualCanvas } from "./VisualCanvas";
import {
  VISUAL_CORE_PROMPTS,
  VISUAL_LANGUAGE_PROMPTS,
} from "./VisualSystemPrompts";

export const VisualCanvasDemo: React.FC = () => {
  const [demoInput, setDemoInput] = useState<string>("");
  const [showVisualCanvas, setShowVisualCanvas] = useState(false);

  const demoInputs = [
    {
      name: "PHP Calculator Class",
      input:
        "class Calculator { private $result = 0.0; public function add($number) { $this->result += $number; return $this; } }",
      description: "PHP OOP visual analysis",
      icon: "🐘",
    },
    {
      name: "JavaScript Function",
      input:
        "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
      description: "JavaScript algorithm visualization",
      icon: "⚡",
    },
    {
      name: "Performance Request",
      input: "How can I optimize this code for better performance?",
      description: "Performance optimization charts",
      icon: "🚀",
    },
    {
      name: "Security Check",
      input: "Check this code for security vulnerabilities",
      description: "Security assessment matrices",
      icon: "🛡️",
    },
    {
      name: "Code Structure",
      input: "Analyze the structure of this codebase",
      description: "Structure visualization diagrams",
      icon: "🏗️",
    },
  ];

  const handleDemoInput = (input: string) => {
    setDemoInput(input);
    setShowVisualCanvas(true);
  };

  return (
    <div className="visual-canvas-demo">
      <div className="demo-header">
        <h1>🎨 Visual-Only Canvas Demo</h1>
        <p>Pure visualizations with ZERO text output - Everything is visual!</p>
      </div>

      <div className="demo-content">
        {/* Visual System Prompts Overview */}
        <div className="visual-prompts-overview">
          <h2>🎯 Visual-Only System Prompts</h2>

          <div className="core-visual-prompts">
            <h3>Core Visual Analysis Prompts</h3>
            <div className="visual-prompts-grid">
              {VISUAL_CORE_PROMPTS.map((prompt) => (
                <div key={prompt.id} className="visual-prompt-card">
                  <div className="prompt-header">
                    <h4>{prompt.name}</h4>
                    <span className={`priority priority-${prompt.priority}`}>
                      {prompt.priority}
                    </span>
                  </div>
                  <p>{prompt.description}</p>
                  <div className="visual-types">
                    <strong>Visual Types:</strong>
                    <div className="types-grid">
                      {prompt.visualTypes.map((type) => (
                        <span key={type} className="visual-type-tag">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="prompt-tags">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="language-visual-prompts">
            <h3>Language-Specific Visual Prompts</h3>
            <div className="language-visual-tabs">
              {Object.entries(VISUAL_LANGUAGE_PROMPTS).map(
                ([lang, prompts]) => (
                  <div key={lang} className="language-visual-section">
                    <h4 className="language-name">{lang.toUpperCase()}</h4>
                    <div className="visual-prompts-list">
                      {prompts.map((prompt) => (
                        <div
                          key={prompt.id}
                          className="lang-visual-prompt-item"
                        >
                          <strong>{prompt.name}</strong>
                          <p>{prompt.description}</p>
                          <div className="visual-types">
                            <strong>Visual Types:</strong>
                            <div className="types-grid">
                              {prompt.visualTypes.map((type) => (
                                <span key={type} className="visual-type-tag">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="interactive-visual-demo">
          <h2>🧪 Interactive Visual Demo</h2>

          <div className="demo-inputs">
            <h3>Try These Sample Inputs</h3>
            <div className="input-buttons">
              {demoInputs.map((demo, index) => (
                <button
                  key={index}
                  className="demo-input-btn visual-btn"
                  onClick={() => handleDemoInput(demo.input)}
                >
                  <div className="btn-icon">{demo.icon}</div>
                  <div className="btn-header">{demo.name}</div>
                  <div className="btn-description">{demo.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-input">
            <h3>Or Enter Your Own Input</h3>
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Enter your code, question, or request here..."
              className="custom-input-textarea"
              rows={4}
            />
            <button
              onClick={() => setShowVisualCanvas(true)}
              disabled={!demoInput.trim()}
              className="process-custom-btn visual-btn"
            >
              🎨 Generate Pure Visualizations
            </button>
          </div>
        </div>

        {/* Visual Canvas Demo */}
        {showVisualCanvas && (
          <div className="visual-canvas-demo-section">
            <h3>🎨 Visual-Only Canvas</h3>
            <p className="demo-note">
              <strong>Note:</strong> This Canvas generates ZERO text output -
              everything is pure visualization!
            </p>
            <VisualCanvas autoProcessPrompts={true} />
          </div>
        )}

        {/* Visual Features Showcase */}
        <div className="visual-features-showcase">
          <h3>✨ Visual-Only Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚫</div>
              <h4>No Text Output</h4>
              <p>Zero text explanations, descriptions, or written analysis</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Pure Visualizations</h4>
              <p>Charts, graphs, diagrams, and interactive elements only</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Smart Visual Selection</h4>
              <p>Automatically selects the best visual representation type</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h4>Interactive Elements</h4>
              <p>Zoom, pan, click, and explore visualizations</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Real-time Generation</h4>
              <p>Visual elements generated and updated in real-time</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h4>Beautiful UI</h4>
              <p>Modern, responsive design with smooth animations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCanvasDemo;
