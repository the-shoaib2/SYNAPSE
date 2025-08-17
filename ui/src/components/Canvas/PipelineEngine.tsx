import React, { useEffect, useState } from "react";
import { PipelineControls } from "./PipelineControls";
import { PipelineStageRenderer } from "./PipelineStageRenderer";
import { PipelineExecutionState, PipelinePlan, PipelineStage } from "./types";

interface PipelineEngineProps {
  pipelinePlan: PipelinePlan;
  onPipelineComplete?: (results: Record<string, any>) => void;
}

export const PipelineEngine: React.FC<PipelineEngineProps> = ({
  pipelinePlan,
  onPipelineComplete,
}) => {
  const [executionStates, setExecutionStates] = useState<
    Record<string, PipelineExecutionState>
  >({});
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});

  // Initialize execution states
  useEffect(() => {
    const initialStates: Record<string, PipelineExecutionState> = {};
    pipelinePlan.pipeline.forEach((stage) => {
      initialStates[stage.id] = {
        stageId: stage.id,
        status: "pending",
      };
    });
    setExecutionStates(initialStates);
  }, [pipelinePlan]);

  // Execute a single stage
  const executeStage = async (stage: PipelineStage) => {
    if (executionStates[stage.id]?.status === "completed") {
      return; // Already completed
    }

    setExecutionStates((prev) => ({
      ...prev,
      [stage.id]: {
        ...prev[stage.id],
        status: "running",
        startTime: Date.now(),
      },
    }));

    try {
      // Simulate stage execution (replace with actual engine calls)
      const result = await simulateStageExecution(stage);

      setExecutionStates((prev) => ({
        ...prev,
        [stage.id]: {
          ...prev[stage.id],
          status: "completed",
          result,
          endTime: Date.now(),
        },
      }));

      setResults((prev) => ({ ...prev, [stage.id]: result }));

      // Move to next stage
      const nextIndex = currentStageIndex + 1;
      if (nextIndex < pipelinePlan.pipeline.length) {
        setCurrentStageIndex(nextIndex);
      } else {
        // Pipeline complete
        setIsExecuting(false);
        onPipelineComplete?.(results);
      }
    } catch (error) {
      setExecutionStates((prev) => ({
        ...prev,
        [stage.id]: {
          ...prev[stage.id],
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
          endTime: Date.now(),
        },
      }));
    }
  };

  // Simulate stage execution (replace with actual engine implementations)
  const simulateStageExecution = async (stage: PipelineStage): Promise<any> => {
    // Simulate processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    // Generate mock results based on stage type
    switch (stage.type) {
      case "analysis":
        return {
          analysis: `Analysis result for ${stage.stage}`,
          timestamp: Date.now(),
        };
      case "visualize":
        return {
          visualization: `Visualization for ${stage.stage}`,
          type: "chart",
        };
      case "execute":
        return {
          execution: `Execution result for ${stage.stage}`,
          success: true,
        };
      case "explain":
        return {
          explanation: `AI explanation for ${stage.stage}`,
          model: "gpt-4",
        };
      default:
        return { result: `Result for ${stage.stage}`, type: stage.type };
    }
  };

  // Execute entire pipeline
  const executePipeline = async () => {
    setIsExecuting(true);
    setCurrentStageIndex(0);

    for (let i = 0; i < pipelinePlan.pipeline.length; i++) {
      const stage = pipelinePlan.pipeline[i];
      await executeStage(stage);
    }
  };

  // Execute next stage
  const executeNextStage = () => {
    if (currentStageIndex < pipelinePlan.pipeline.length) {
      const stage = pipelinePlan.pipeline[currentStageIndex];
      executeStage(stage);
    }
  };

  // Reset pipeline
  const resetPipeline = () => {
    setExecutionStates({});
    setCurrentStageIndex(0);
    setResults({});
    setIsExecuting(false);
  };

  return (
    <div className="pipeline-engine">
      <div className="pipeline-header">
        <h2>Dynamic Pipeline Engine</h2>
        <p>Executing {pipelinePlan.pipeline.length} stages</p>
      </div>

      <PipelineControls
        isExecuting={isExecuting}
        currentStage={currentStageIndex}
        totalStages={pipelinePlan.pipeline.length}
        onExecuteAll={executePipeline}
        onExecuteNext={executeNextStage}
        onReset={resetPipeline}
      />

      <div className="pipeline-stages">
        {pipelinePlan.pipeline.map((stage, index) => (
          <PipelineStageRenderer
            key={stage.id}
            stage={stage}
            executionState={executionStates[stage.id]}
            isActive={index === currentStageIndex}
            isCompleted={index < currentStageIndex}
            result={results[stage.id]}
            onExecute={() => executeStage(stage)}
          />
        ))}
      </div>
    </div>
  );
};
