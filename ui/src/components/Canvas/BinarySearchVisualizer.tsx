import React, { useEffect, useRef, useState } from "react";
import "./BinarySearchVisualizer.css";

interface BinarySearchStep {
  step: number;
  left: number;
  right: number;
  mid: number;
  midValue: number;
  target: number;
  comparison: "less" | "equal" | "greater";
  array: number[];
  description: string;
}

interface BinarySearchData {
  steps: BinarySearchStep[];
  target: number;
  found: boolean;
  finalIndex: number;
}

interface BinarySearchVisualizerProps {
  data?: BinarySearchData;
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({
  data,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Default data for demonstration
  const defaultData: BinarySearchData = {
    steps: [
      {
        step: 1,
        left: 0,
        right: 9,
        mid: 4,
        midValue: 50,
        target: 75,
        comparison: "less",
        array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        description: "Initial state: left=0, right=9, mid=4, midValue=50",
      },
      {
        step: 2,
        left: 5,
        right: 9,
        mid: 7,
        midValue: 80,
        target: 75,
        comparison: "greater",
        array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        description:
          "Target 75 < 80, so search left half: left=5, right=9, mid=7",
      },
      {
        step: 3,
        left: 5,
        right: 6,
        mid: 5,
        midValue: 60,
        target: 75,
        comparison: "less",
        array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        description:
          "Target 75 > 60, so search right half: left=5, right=6, mid=5",
      },
      {
        step: 4,
        left: 6,
        right: 6,
        mid: 6,
        midValue: 70,
        target: 75,
        comparison: "less",
        array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        description:
          "Target 75 > 70, so search right half: left=6, right=6, mid=6",
      },
      {
        step: 5,
        left: 7,
        right: 6,
        mid: -1,
        midValue: -1,
        target: 75,
        comparison: "greater",
        array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        description: "left > right, target not found",
      },
    ],
    target: 75,
    found: false,
    finalIndex: -1,
  };

  const searchData = data || defaultData;

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < searchData.steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, searchData.steps.length, playbackSpeed]);

  useEffect(() => {
    drawCanvas();
  }, [currentStep, searchData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentStepData = searchData.steps[currentStep];
    if (!currentStepData) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const arrayWidth = width - 2 * padding;
    const arrayHeight = 80;
    const arrayY = height / 2 - arrayHeight / 2;

    // Draw array
    const cellWidth = arrayWidth / currentStepData.array.length;

    currentStepData.array.forEach((value, index) => {
      const x = padding + index * cellWidth;
      const y = arrayY;

      // Cell background
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(x, y, cellWidth, arrayHeight);

      // Cell border
      ctx.strokeStyle = "#4a5568";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, arrayHeight);

      // Highlight current step
      if (index === currentStepData.mid) {
        ctx.fillStyle = "#3182ce";
        ctx.fillRect(x, y, cellWidth, arrayHeight);
      } else if (index === currentStepData.left) {
        ctx.fillStyle = "#38a169";
        ctx.fillRect(x, y, cellWidth, arrayHeight);
      } else if (index === currentStepData.right) {
        ctx.fillStyle = "#e53e3e";
        ctx.fillRect(x, y, cellWidth, arrayHeight);
      }

      // Value text
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value.toString(), x + cellWidth / 2, y + arrayHeight / 2);

      // Index labels
      ctx.fillStyle = "#a0aec0";
      ctx.font = "12px monospace";
      ctx.fillText(index.toString(), x + cellWidth / 2, y + arrayHeight + 20);
    });

    // Draw pointers
    if (currentStepData.left <= currentStepData.right) {
      // Left pointer
      const leftX = padding + currentStepData.left * cellWidth + cellWidth / 2;
      ctx.fillStyle = "#38a169";
      ctx.beginPath();
      ctx.moveTo(leftX, arrayY - 20);
      ctx.lineTo(leftX - 10, arrayY - 40);
      ctx.lineTo(leftX + 10, arrayY - 40);
      ctx.closePath();
      ctx.fill();
      ctx.fillText("L", leftX, arrayY - 50);

      // Right pointer
      const rightX =
        padding + currentStepData.right * cellWidth + cellWidth / 2;
      ctx.fillStyle = "#e53e3e";
      ctx.beginPath();
      ctx.moveTo(rightX, arrayY - 20);
      ctx.lineTo(rightX - 10, arrayY - 40);
      ctx.lineTo(rightX + 10, arrayY - 40);
      ctx.closePath();
      ctx.fill();
      ctx.fillText("R", rightX, arrayY - 50);

      // Mid pointer
      if (currentStepData.mid >= 0) {
        const midX = padding + currentStepData.mid * cellWidth + cellWidth / 2;
        ctx.fillStyle = "#3182ce";
        ctx.beginPath();
        ctx.moveTo(midX, arrayY + arrayHeight + 20);
        ctx.lineTo(midX - 10, arrayY + arrayHeight + 40);
        ctx.lineTo(midX + 10, arrayY + arrayHeight + 40);
        ctx.closePath();
        ctx.fill();
        ctx.fillText("M", midX, arrayY + arrayHeight + 50);
      }
    }

    // Draw comparison result
    const comparisonText = `Target: ${currentStepData.target} | Comparison: ${currentStepData.comparison}`;
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(comparisonText, width / 2, height - 20);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < searchData.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = searchData.steps[currentStep];

  return (
    <div className="binary-search-visualizer">
      <div className="visualizer-header">
        <h3>🔍 Binary Search Visualization</h3>
        <div className="controls">
          <button onClick={resetAnimation} className="control-btn">
            ⏮️ Reset
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
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
            onClick={nextStep}
            disabled={currentStep === searchData.steps.length - 1}
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
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
          </select>
        </div>
      </div>

      <div className="step-info">
        <div className="step-counter">
          Step {currentStep + 1} of {searchData.steps.length}
        </div>
        <div className="step-description">{currentStepData?.description}</div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="visualization-canvas"
          width={800}
          height={400}
        />
      </div>

      <div className="algorithm-info">
        <h4>📊 Algorithm Details</h4>
        <div className="info-grid">
          <div className="info-item">
            <strong>Target:</strong> {searchData.target}
          </div>
          <div className="info-item">
            <strong>Found:</strong> {searchData.found ? "Yes" : "No"}
          </div>
          <div className="info-item">
            <strong>Final Index:</strong> {searchData.finalIndex}
          </div>
          <div className="info-item">
            <strong>Steps:</strong> {searchData.steps.length}
          </div>
        </div>
      </div>

      <div className="step-details">
        <h4>📝 Step-by-Step Execution</h4>
        <div className="steps-list">
          {searchData.steps.map((step, index) => (
            <div
              key={step.step}
              className={`step-item ${index === currentStep ? "active" : ""}`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="step-header">
                <span className="step-number">Step {step.step}</span>
                <span className="step-comparison">{step.comparison}</span>
              </div>
              <div className="step-data">
                <span>L: {step.left}</span>
                <span>R: {step.right}</span>
                <span>M: {step.mid}</span>
                <span>M[v]: {step.midValue}</span>
              </div>
              <div className="step-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
