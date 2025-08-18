import React from 'react';
import { PipelineStage } from './types';
import { ASTTreePanel } from './stages/ASTTreePanel';
import { TimelinePanel } from './stages/TimelinePanel';
import { GraphPanel } from './stages/GraphPanel';
import { EditorPanel } from './stages/EditorPanel';
import { ExplanationPanel } from './stages/ExplanationPanel';
import { FlowchartPanel } from './stages/FlowchartPanel';

interface CanvasRendererProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

export function CanvasRenderer({ stage, onUpdate, onSelect, isActive }: CanvasRendererProps) {
  const visualType = stage.visualType || 'explanation';

  // Render the appropriate panel based on visualType
  switch (visualType) {
    case 'ast-tree':
      return (
        <ASTTreePanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );

    case 'timeline':
      return (
        <TimelinePanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );

    case 'graph':
    case 'dependency-graph':
    case 'call-graph':
    case 'network-graph':
      return (
        <GraphPanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );

    case 'flowchart':
      return (
        <FlowchartPanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );

    case 'code-editor':
      return (
        <EditorPanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );

    case 'explanation':
    default:
      return (
        <ExplanationPanel
          stage={stage}
          onUpdate={onUpdate}
          onSelect={onSelect}
          isActive={isActive}
        />
      );
  }
}
