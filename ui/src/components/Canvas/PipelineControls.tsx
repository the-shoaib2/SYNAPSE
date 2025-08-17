import {
  ArrowPathIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface PipelineControlsProps {
  isExecuting: boolean;
  currentStage: number;
  totalStages: number;
  onExecuteAll: () => void;
  onExecuteNext: () => void;
  onReset: () => void;
}

export const PipelineControls: React.FC<PipelineControlsProps> = ({
  isExecuting,
  currentStage,
  totalStages,
  onExecuteAll,
  onExecuteNext,
  onReset,
}) => {
  const progress = totalStages > 0 ? (currentStage / totalStages) * 100 : 0;

  return (
    <div className="pipeline-controls mb-6 rounded-lg border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pipeline Controls
          </h3>
          <p className="text-sm text-gray-600">
            Stage {currentStage + 1} of {totalStages}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Progress:</span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExecuteAll}
          disabled={isExecuting}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium ${
            isExecuting
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isExecuting ? (
            <>
              <PauseIcon className="h-4 w-4" />
              Executing...
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4" />
              Execute All
            </>
          )}
        </button>

        <button
          onClick={onExecuteNext}
          disabled={isExecuting || currentStage >= totalStages}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium ${
            isExecuting || currentStage >= totalStages
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ArrowRightIcon className="h-4 w-4" />
          Next Stage
        </button>

        <button
          onClick={onReset}
          disabled={isExecuting}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium ${
            isExecuting
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          <ArrowPathIcon className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Status Information */}
      <div className="mt-4 rounded-md bg-gray-50 p-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`ml-2 rounded px-2 py-1 text-xs ${
                isExecuting
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isExecuting ? "Running" : "Ready"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Current Stage:</span>
            <span className="ml-2 text-gray-600">
              {currentStage + 1} / {totalStages}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Remaining:</span>
            <span className="ml-2 text-gray-600">
              {Math.max(0, totalStages - currentStage - 1)} stages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
