import React, { useState, useCallback, useEffect } from 'react';
import { CanvasRenderer } from './CanvasRenderer';
import { useCanvas } from './CanvasContext';
import { PipelineStage, CanvasConfig } from './types';

interface CanvasLayoutProps {
  className?: string;
  initialPipeline?: PipelineStage[];
  initialConfig?: Partial<CanvasConfig>;
  onPipelineChange?: (pipeline: PipelineStage[]) => void;
  onStageUpdate?: (stageId: string, updates: Partial<PipelineStage>) => void;
  onStageSelect?: (stageId: string) => void;
  showToolbar?: boolean;
  showStatusBar?: boolean;
}

export function CanvasLayout({
  className = '',
  initialPipeline = [],
  initialConfig = {},
  onPipelineChange,
  onStageUpdate,
  onStageSelect,
  showToolbar = true,
  showStatusBar = true,
}: CanvasLayoutProps) {
  const {
    state,
    config,
    setPipeline,
    loadPipelineFromJSON,
    resetCanvas,
    executeStage,
    regenerateStage,
    explainStage,
    isStageCompleted,
    getStageDependencies,
  } = useCanvas();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with provided pipeline
  useEffect(() => {
    if (initialPipeline.length > 0) {
      setPipeline(initialPipeline);
    }
  }, [initialPipeline, setPipeline]);

  // Handle pipeline changes
  useEffect(() => {
    if (onPipelineChange && state.pipeline.length > 0) {
      onPipelineChange(state.pipeline);
    }
  }, [state.pipeline, onPipelineChange]);

  // Load pipeline from JSON
  const handleLoadPipeline = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      loadPipelineFromJSON(text);
    } catch (err) {
      setError('Failed to load pipeline file');
      console.error('Pipeline load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadPipelineFromJSON]);

  // Export pipeline to JSON
  const handleExportPipeline = useCallback(() => {
    if (state.pipeline.length === 0) return;

    const dataStr = JSON.stringify(state.pipeline, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'synapse-pipeline.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }, [state.pipeline]);

  // Execute all stages
  const handleExecuteAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      for (const stage of state.pipeline) {
        if (stage.status !== 'completed') {
          await executeStage(stage.id);
        }
      }
    } catch (err) {
      setError('Failed to execute pipeline');
      console.error('Pipeline execution error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [state.pipeline, executeStage]);

  // Execute specific stage
  const handleExecuteStage = useCallback(async (stageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await executeStage(stageId);
    } catch (err) {
      setError(`Failed to execute stage ${stageId}`);
      console.error('Stage execution error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [executeStage]);

  // Regenerate specific stage
  const handleRegenerateStage = useCallback(async (stageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await regenerateStage(stageId);
    } catch (err) {
      setError(`Failed to regenerate stage ${stageId}`);
      console.error('Stage regeneration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [regenerateStage]);

  // Explain specific stage
  const handleExplainStage = useCallback(async (stageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await explainStage(stageId);
    } catch (err) {
      setError(`Failed to explain stage ${stageId}`);
      console.error('Stage explanation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [explainStage]);

  // Get execution statistics
  const executionStats = {
    total: state.pipeline.length,
    pending: state.pipeline.filter(s => s.status === 'pending').length,
    running: state.pipeline.filter(s => s.status === 'running').length,
    completed: state.pipeline.filter(s => s.status === 'completed').length,
    error: state.pipeline.filter(s => s.status === 'error').length,
  };

  return (
    <div className={`canvas-layout ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Synapse Canvas</h1>
              
              {/* Pipeline Actions */}
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Load Pipeline
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLoadPipeline}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={handleExportPipeline}
                  disabled={state.pipeline.length === 0}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Export Pipeline
                </button>
                
                <button
                  onClick={resetCanvas}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reset Canvas
                </button>
              </div>
            </div>

            {/* Execution Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExecuteAll}
                disabled={state.pipeline.length === 0 || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? 'Executing...' : 'Execute All'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      {showStatusBar && state.pipeline.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Total:</span>
                <span className="font-medium text-gray-900">{executionStats.total}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Pending:</span>
                <span className="font-medium text-yellow-600">{executionStats.pending}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Running:</span>
                <span className="font-medium text-blue-600">{executionStats.running}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Completed:</span>
                <span className="font-medium text-green-600">{executionStats.completed}</span>
              </div>
              
              {executionStats.error > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">Errors:</span>
                  <span className="font-medium text-red-600">{executionStats.error}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Layout:</span>
              <span className="text-gray-900 font-medium capitalize">{config.layout}</span>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto">
        <CanvasRenderer
          onStageUpdate={onStageUpdate}
          onStageSelect={onStageSelect}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
