import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { PipelineExecutionState, PipelineStage } from "./types";

interface PipelineStageRendererProps {
  stage: PipelineStage;
  executionState: PipelineExecutionState;
  isActive: boolean;
  isCompleted: boolean;
  result?: any;
  onExecute: () => void;
}

export const PipelineStageRenderer: React.FC<PipelineStageRendererProps> = ({
  stage,
  executionState,
  isActive,
  isCompleted,
  result,
  onExecute,
}) => {
  const getStatusIcon = () => {
    switch (executionState.status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "running":
        return <ClockIcon className="h-5 w-5 animate-spin text-blue-500" />;
      case "failed":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <PlayIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (executionState.status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "running":
        return "border-blue-200 bg-blue-50";
      case "failed":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStageTypeIcon = () => {
    switch (stage.type) {
      case "analysis":
        return "🔍";
      case "visualize":
        return "📊";
      case "execute":
        return "⚡";
      case "explain":
        return "🤖";
      case "simulate":
        return "🎮";
      case "compile":
        return "🔧";
      case "parse":
        return "📝";
      case "timeline":
        return "⏱️";
      case "graph":
        return "🕸️";
      case "tree":
        return "🌳";
      case "table":
        return "📋";
      case "editor":
        return "✏️";
      default:
        return "⚙️";
    }
  };

  return (
    <div
      className={`pipeline-stage mb-4 rounded-lg border p-4 ${getStatusColor()} ${
        isActive ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStageTypeIcon()}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{stage.stage}</h3>
            <p className="text-sm text-gray-600">{stage.explanation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">
            {executionState.status}
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Type:</span>
          <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {stage.type}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Engine:</span>
          <span className="ml-2 rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
            {stage.engine}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Inputs:</span>
          <span className="ml-2 text-gray-600">
            {stage.inputs.join(", ") || "None"}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Outputs:</span>
          <span className="ml-2 text-gray-600">
            {stage.outputs.join(", ") || "None"}
          </span>
        </div>
      </div>

      {executionState.status === "pending" && (
        <button
          onClick={onExecute}
          disabled={!isActive}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            isActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Execute Stage
        </button>
      )}

      {executionState.status === "running" && (
        <div className="flex items-center gap-2 text-blue-600">
          <ClockIcon className="h-4 w-4 animate-spin" />
          <span>Executing...</span>
        </div>
      )}

      {executionState.status === "completed" && result && (
        <div className="mt-3 rounded-md border bg-white p-3">
          <h4 className="mb-2 font-medium text-gray-900">Result:</h4>
          <pre className="overflow-auto rounded bg-gray-50 p-2 text-sm text-gray-700">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {executionState.status === "failed" && executionState.error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
          <h4 className="mb-2 font-medium text-red-900">Error:</h4>
          <p className="text-sm text-red-700">{executionState.error}</p>
        </div>
      )}

      {executionState.startTime && executionState.endTime && (
        <div className="mt-2 text-xs text-gray-500">
          Duration: {executionState.endTime - executionState.startTime}ms
        </div>
      )}
    </div>
  );
};

