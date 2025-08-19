import { CanvasPanelType, PanelType } from "./types";

export class PanelFactory {
  public createPanel(
    type: PanelType,
    config?: Partial<CanvasPanelType>,
  ): CanvasPanelType {
    const defaultPanel = this.getDefaultPanel(type);
    return {
      ...defaultPanel,
      ...config,
      id: config?.id || this.generateId(),
    };
  }

  public getPanelTypeInfo(type: PanelType): {
    name: string;
    description: string;
    icon: string;
    category: string;
    defaultConfig: Partial<CanvasPanelType>;
  } {
    const panelInfo = this.getPanelTypeInfoMap()[type];
    if (!panelInfo) {
      throw new Error(`Unknown panel type: ${type}`);
    }
    return panelInfo;
  }

  public getAvailablePanelTypes(): PanelType[] {
    return Object.keys(this.getPanelTypeInfoMap()) as PanelType[];
  }

  private getDefaultPanel(type: PanelType): CanvasPanelType {
    const basePanel = {
      id: this.generateId(),
      type,
      title: type,
      description: `Panel for ${type}`,
      icon: "📋",
      state: {
        isVisible: true,
        isMinimized: false,
        isMaximized: false,
        isPinned: false,
        isResizable: true,
        isDraggable: true,
        isClosable: true,
        isLoading: false,
        hasError: false,
      },
      data: {
        content: [],
        contentType: "text" as const,
        timestamp: Date.now(),
        version: "1.0",
      },
      config: {
        title: type,
        description: `Panel for ${type}`,
        icon: "📋",
        showHeader: true,
        showToolbar: true,
        showStatusBar: true,
        enableSearch: true,
        enableFiltering: true,
        enableSorting: true,
        autoScroll: true,
        showGrid: true,
        showLegend: false,
        showTooltips: true,
      },
      dimensions: {
        width: 400,
        height: 300,
        position: { x: 50, y: 50 },
        minWidth: 200,
        minHeight: 150,
        maxWidth: 1200,
        maxHeight: 800,
      },
      actions: [],
      version: "1.0",
      tags: [type],
      category: "general",
    };

    return basePanel;
  }

  private getPanelTypeInfoMap(): Record<
    PanelType,
    {
      name: string;
      description: string;
      icon: string;
      category: string;
      defaultConfig: Partial<CanvasPanelType>;
    }
  > {
    return {
      "execution-trace": {
        name: "Execution Trace",
        description:
          "Real-time line-by-line execution tracing with variable values",
        icon: "▶️",
        category: "execution",
        defaultConfig: {},
      },
      "ast-visualizer": {
        name: "AST Visualizer",
        description:
          "Abstract Syntax Tree visualization with interactive nodes",
        icon: "🌳",
        category: "compiler",
        defaultConfig: {},
      },
      "cfg-graph": {
        name: "CFG Graph",
        description: "Control Flow Graph visualization for program analysis",
        icon: "🔄",
        category: "compiler",
        defaultConfig: {},
      },
      "variable-watch": {
        name: "Variable Watch",
        description: "Monitor variable values and changes during execution",
        icon: "👁️",
        category: "execution",
        defaultConfig: {},
      },
      "call-stack": {
        name: "Call Stack",
        description: "Visualize function call hierarchy and stack frames",
        icon: "📚",
        category: "execution",
        defaultConfig: {},
      },
      "algorithm-simulation": {
        name: "Algorithm Simulation",
        description:
          "Interactive algorithm visualization with step-by-step execution",
        icon: "🎯",
        category: "simulation",
        defaultConfig: {},
      },
      "code-editor": {
        name: "Code Editor",
        description: "Embedded code editor with syntax highlighting",
        icon: "📝",
        category: "editor",
        defaultConfig: {},
      },
      "output-console": {
        name: "Output Console",
        description: "Program output and console messages display",
        icon: "💻",
        category: "editor",
        defaultConfig: {},
      },
      "ai-annotations": {
        name: "AI Annotations",
        description: "AI-generated insights and code explanations",
        icon: "🤖",
        category: "ai",
        defaultConfig: {},
      },
      timeline: {
        name: "Timeline",
        description: "Chronological visualization of events and changes",
        icon: "⏱️",
        category: "visualization",
        defaultConfig: {},
      },
      table: {
        name: "Table",
        description: "Tabular data display with sorting and filtering",
        icon: "📊",
        category: "visualization",
        defaultConfig: {},
      },
      graph: {
        name: "Graph",
        description: "Interactive graph visualization with nodes and edges",
        icon: "🕸️",
        category: "visualization",
        defaultConfig: {},
      },
      chart: {
        name: "Chart",
        description: "Various chart types for data visualization",
        icon: "📈",
        category: "visualization",
        defaultConfig: {},
      },
      custom: {
        name: "Custom",
        description: "Custom panel with user-defined content",
        icon: "🔧",
        category: "general",
        defaultConfig: {},
      },
      // Add missing panel types
      logs: {
        name: "Logs",
        description: "System and application logs display",
        icon: "📋",
        category: "monitoring",
        defaultConfig: {},
      },
      debugger: {
        name: "Debugger",
        description: "Interactive debugging interface",
        icon: "🐛",
        category: "development",
        defaultConfig: {},
      },
      coverage: {
        name: "Coverage",
        description: "Code coverage analysis and visualization",
        icon: "📊",
        category: "testing",
        defaultConfig: {},
      },
      pipeline: {
        name: "Pipeline",
        description: "Pipeline execution and management",
        icon: "🔗",
        category: "execution",
        defaultConfig: {},
      },
      assembly: {
        name: "Assembly",
        description: "Assembly code visualization and analysis",
        icon: "⚙️",
        category: "compiler",
        defaultConfig: {},
      },
      flowchart: {
        name: "Flowchart",
        description: "Flowchart and process visualization",
        icon: "📊",
        category: "visualization",
        defaultConfig: {},
      },
      "ast-tree": {
        name: "AST Tree",
        description: "Abstract Syntax Tree visualization",
        icon: "🌳",
        category: "compiler",
        defaultConfig: {},
      },
      "token-stream": {
        name: "Token Stream",
        description: "Lexical token stream visualization",
        icon: "🔤",
        category: "compiler",
        defaultConfig: {},
      },
    };
  }

  private generateId(): string {
    return `panel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
