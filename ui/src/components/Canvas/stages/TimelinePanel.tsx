import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { PipelineStage } from '../types';
import { useCanvas } from '../CanvasContext';

interface TimelinePanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  timestamp: number;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  data?: any;
  metadata?: Record<string, any>;
}

export function TimelinePanel({ stage, onUpdate, onSelect, isActive }: TimelinePanelProps) {
  const { explanations } = useCanvas();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse timeline data from stage payload
  const timelineData = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        const data = typeof stage.payload.visual === 'string' 
          ? JSON.parse(stage.payload.visual) 
          : stage.payload.visual;
        
        // Convert to timeline steps
        if (Array.isArray(data)) {
          return data.map((item, index) => ({
            id: item.id || `step-${index}`,
            label: item.label || item.name || `Step ${index + 1}`,
            description: item.description || item.desc || '',
            timestamp: item.timestamp || index * 1000,
            duration: item.duration || 500,
            status: item.status || 'pending',
            data: item.data || item,
            metadata: item.metadata || {},
          }));
        } else if (data.steps) {
          return data.steps.map((step: any, index: number) => ({
            id: step.id || `step-${index}`,
            label: step.label || step.name || `Step ${index + 1}`,
            description: step.description || step.desc || '',
            timestamp: step.timestamp || index * 1000,
            duration: step.duration || 500,
            status: step.status || 'pending',
            data: step.data || step,
            metadata: step.metadata || {},
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to parse timeline data:', error);
      return [];
    }
  }, [stage.payload?.visual]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isPlaying && timelineData.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= timelineData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [autoPlay, isPlaying, timelineData.length, playbackSpeed]);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    } else {
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Handle step navigation
  const handleStepClick = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  }, []);

  // Handle next/previous
  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, timelineData.length - 1));
  }, [timelineData.length]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  }, []);

  // Calculate timeline statistics
  const timelineStats = useMemo(() => {
    if (timelineData.length === 0) return null;

    const totalDuration = timelineData.reduce((sum, step) => sum + step.duration, 0);
    const completedSteps = timelineData.filter(step => step.status === 'completed').length;
    const errorSteps = timelineData.filter(step => step.status === 'error').length;

    return {
      totalSteps: timelineData.length,
      totalDuration,
      completedSteps,
      errorSteps,
      averageStepDuration: totalDuration / timelineData.length,
    };
  }, [timelineData]);

  // Render timeline step
  const renderTimelineStep = useCallback((step: TimelineStep, index: number) => {
    const isCurrent = index === currentStep;
    const isCompleted = index < currentStep;
    const isActive = isCurrent && isPlaying;

    return (
      <div
        key={step.id}
        className={`
          relative flex items-start space-x-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer
          ${isCurrent 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : isCompleted 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }
          ${isActive ? 'animate-pulse' : ''}
        `}
        onClick={() => handleStepClick(index)}
      >
        {/* Step Number */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
          ${isCurrent 
            ? 'bg-blue-500 text-white' 
            : isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600'
          }
        `}>
          {index + 1}
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">{step.label}</h4>
            <div className="flex items-center space-x-2">
              {/* Status Badge */}
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${step.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                ${step.status === 'running' ? 'bg-blue-100 text-blue-800' : ''}
                ${step.status === 'error' ? 'bg-red-100 text-red-800' : ''}
                ${step.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {step.status}
              </span>
              
              {/* Duration */}
              <span className="text-xs text-gray-500">
                {step.duration}ms
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
          
          {/* Step Metadata */}
          {step.metadata && Object.keys(step.metadata).length > 0 && (
            <div className="text-xs text-gray-500">
              {Object.entries(step.metadata).map(([key, value]) => (
                <span key={key} className="mr-3">
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Line */}
        {index < timelineData.length - 1 && (
          <div className={`
            absolute left-4 top-12 w-0.5 h-8
            ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}
          `} />
        )}
      </div>
    );
  }, [currentStep, isPlaying, timelineData.length, handleStepClick]);

  // Render explanation if available
  const explanation = explanations[stage.id];

  if (timelineData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">No timeline data available</div>
          <div className="text-sm">This stage doesn't contain timeline visualization data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-panel h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Execution Timeline</h3>
        <div className="flex items-center space-x-2">
          {timelineStats && (
            <span className="text-sm text-gray-600">
              {timelineStats.totalSteps} steps
            </span>
          )}
        </div>
      </div>

      {/* Timeline Statistics */}
      {timelineStats && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">Timeline Statistics</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Total Steps:</div>
            <div className="font-medium">{timelineStats.totalSteps}</div>
            <div className="text-gray-600">Total Duration:</div>
            <div className="font-medium">{timelineStats.totalDuration}ms</div>
            <div className="text-gray-600">Completed:</div>
            <div className="font-medium text-green-600">{timelineStats.completedSteps}</div>
            <div className="text-gray-600">Errors:</div>
            <div className="font-medium text-red-600">{timelineStats.errorSteps}</div>
            <div className="text-gray-600">Avg Duration:</div>
            <div className="font-medium">{Math.round(timelineStats.averageStepDuration)}ms</div>
          </div>
        </div>
      )}

      {/* Timeline Controls */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayPause}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }
              `}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white transition-colors"
            >
              ⏮️ Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep === timelineData.length - 1}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white transition-colors"
            >
              ⏭️ Next
            </button>
            
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              🔄 Reset
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-600">Speed:</label>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
            
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="text-blue-600"
              />
              <span className="text-xs text-gray-600">Auto-play</span>
            </label>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Step {currentStep + 1} of {timelineData.length}</span>
            <span>{Math.round(((currentStep + 1) / timelineData.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / timelineData.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="flex-1 overflow-auto space-y-2">
        {timelineData.map((step, index) => renderTimelineStep(step, index))}
      </div>

      {/* Current Step Details */}
      {timelineData[currentStep] && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm font-medium text-blue-800 mb-2">Current Step Details</div>
          <div className="text-xs text-blue-700">
            <div>Label: {timelineData[currentStep].label}</div>
            <div>Description: {timelineData[currentStep].description}</div>
            <div>Duration: {timelineData[currentStep].duration}ms</div>
            <div>Status: {timelineData[currentStep].status}</div>
          </div>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">AI Explanation</div>
          <div className="text-sm text-gray-600">{explanation}</div>
        </div>
      )}

      {/* Export Controls */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onUpdate({ 
            payload: { 
              ...stage.payload, 
              visual: JSON.stringify(timelineData, null, 2) 
            } 
          })}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Export Timeline
        </button>
      </div>
    </div>
  );
}
