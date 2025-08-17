# Canvas System for Synapse

The Canvas system is a dynamic, modular visualization platform that provides real-time execution tracing, compiler visualization, algorithm simulation, and AI agent orchestration capabilities.

## Features

### 🎯 **Core Functionality**

- **Dynamic Panel System**: Resizable, draggable, dockable panels
- **Multiple Layout Types**: Grid, Freeform, Tabs, Split layouts
- **Real-time Communication**: JSON-based message protocol with backend agents
- **Multi-AI Agent Support**: Planning, Parser, Compiler, Visualization, and Editor Assistance agents

### 🔍 **Execution Visualization**

- **Line-by-line Tracing**: Real-time execution with variable state tracking
- **Call Stack Visualization**: Function call hierarchy and stack frames
- **Variable Watch**: Monitor variable values and changes during execution
- **Language Support**: Python, JavaScript/TypeScript, C/C++, Java

### 🧠 **Compiler Stage Mapping**

- **Lexical Analysis**: Token visualization and highlighting
- **Parsing**: Abstract Syntax Tree (AST) visualization
- **Semantic Analysis**: Intermediate Representation (IR) display
- **Control Flow**: Control Flow Graph (CFG) visualization

### 🎮 **Algorithm Simulation**

- **Prebuilt Simulations**: Sorting, Graph Traversals, Dynamic Programming, Search algorithms
- **Interactive Controls**: Play, pause, step, rewind functionality
- **Dynamic Data Input**: User-controlled simulation parameters
- **AI Annotations**: Intelligent explanations for each step

### 🤖 **AI Agent Orchestration**

- **Planning Agent**: Task breakdown and execution planning
- **Parser/Compiler Agent**: Code analysis and transformation
- **Visualization Agent**: Dynamic visual layout generation
- **Editor Assistance Agent**: Inline completions and suggestions

## Architecture

### **Frontend Components**

```
Canvas/
├── Canvas.tsx              # Main container component
├── CanvasContext.tsx       # State management and context
├── CanvasLayout.tsx        # Layout management
├── CanvasToolbar.tsx       # Toolbar with panel controls
├── CanvasMessageHandler.tsx # Backend communication
├── CanvasPanel.tsx         # Individual panel component
├── components/             # Panel sub-components
│   ├── PanelHeader.tsx     # Panel header with controls
│   ├── PanelContent.tsx    # Content rendering logic
│   ├── PanelToolbar.tsx    # Panel-specific toolbar
│   ├── PanelResizer.tsx    # Resize handles
│   └── PanelDragHandle.tsx # Drag functionality
├── layouts/                # Layout implementations
│   ├── LayoutGrid.ts       # Grid-based layout
│   ├── LayoutFreeform.tsx  # Free positioning
│   ├── LayoutTabs.tsx      # Tabbed interface
│   └── LayoutSplit.tsx     # Split view layouts
├── content/                # Content type implementations
│   ├── ExecutionTraceContent.tsx
│   ├── ASTVisualizerContent.tsx
│   ├── CFGGraphContent.tsx
│   └── ... (other content types)
└── types/                  # TypeScript type definitions
    ├── CanvasTypes.ts      # Core types
    ├── CanvasPanelTypes.ts # Panel-related types
    ├── CanvasMessageTypes.ts # Communication protocol
    ├── CanvasAgentTypes.ts # AI agent types
    └── CanvasVisualizationTypes.ts # Visualization types
```

### **Communication Protocol**

The Canvas uses a standardized JSON message format for all communication:

```typescript
interface CanvasMessage {
  id: string;
  agent: string; // 'planning' | 'parser' | 'compiler' | 'visualization'
  version: string;
  timestamp: string;
  type: string; // Message type
  payload: any; // Message-specific data
  metadata?: Record<string, any>;
}
```

### **Panel System**

Each panel is a self-contained unit with:

- **State Management**: Visibility, size, position, loading states
- **Content Rendering**: Type-specific content display
- **Event Handling**: User interactions and updates
- **Configuration**: Customizable appearance and behavior

## Usage

### **Basic Integration**

```tsx
import { Canvas } from "./components/Canvas";

function App() {
  return (
    <div className="app">
      <Canvas
        className="canvas-overlay"
        initialPanels={[
          {
            id: "execution-trace",
            type: "execution-trace",
            title: "Execution Trace",
            // ... other configuration
          },
        ]}
      />
    </div>
  );
}
```

### **Adding New Panels**

```tsx
import { useCanvasContext } from "./components/Canvas";

function MyComponent() {
  const { addPanel } = useCanvasContext();

  const handleAddPanel = () => {
    addPanel({
      id: "my-panel",
      type: "custom",
      title: "My Custom Panel",
      // ... configuration
    });
  };

  return <button onClick={handleAddPanel}>Add Panel</button>;
}
```

### **Custom Content Types**

```tsx
// Create a new content component
export const CustomContent: React.FC<CustomContentProps> = ({ panel, isActive }) => {
  return (
    <div className="custom-content">
      <h3>{panel.config.title}</h3>
      <div className="content-body">
        {/* Your custom content here */}
      </div>
    </div>
  );
};

// Register it in PanelContent.tsx
case 'custom':
  return <CustomContent panel={panel} isActive={isActive} />;
```

## Backend Integration

### **VS Code Extension**

The Canvas communicates with VS Code extensions through the `postMessage` API:

```typescript
// Send message to extension
if (window.vscode) {
  window.vscode.postMessage({
    id: "msg_123",
    agent: "canvas",
    type: "command",
    payload: { command: "startTrace", filePath: "/path/to/file.py" },
  });
}

// Receive messages from extension
window.addEventListener("message", (event) => {
  const message = event.data;
  // Handle message based on type
});
```

### **Agent Communication**

Backend agents can send various message types:

- **Execution Trace**: Real-time program execution data
- **AST Updates**: Abstract syntax tree changes
- **CFG Updates**: Control flow graph modifications
- **Variable Updates**: Variable state changes
- **AI Annotations**: Intelligent insights and explanations

## Styling

The Canvas system uses CSS modules with Tailwind-like utility classes. Key styling features:

- **Responsive Design**: Mobile-friendly layouts
- **Theme Support**: Light/dark mode compatibility
- **Customizable**: Easy to modify colors, spacing, and typography
- **Accessibility**: ARIA labels and keyboard navigation support

## Future Enhancements

### **Planned Features**

- **3D Visualization**: Three.js integration for complex data structures
- **Collaborative Editing**: Real-time multi-user collaboration
- **Plugin System**: Extensible architecture for custom visualizations
- **Performance Monitoring**: Built-in performance analysis tools
- **Machine Learning**: AI-powered code optimization suggestions

### **Language Support**

- **Rust**: Cargo integration and ownership visualization
- **Go**: Goroutine and channel visualization
- **Kotlin**: Android development support
- **WebAssembly**: Binary analysis and optimization

## Contributing

### **Development Setup**

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

### **Code Style**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **React Hooks**: Functional components with hooks
- **Context API**: State management without external libraries

### **Testing Strategy**

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Panel interactions and layouts
- **E2E Tests**: Full user workflows
- **Performance Tests**: Rendering and update performance

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Support

For questions, issues, or contributions:

- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions
- **Documentation**: Inline code comments and this README
- **Community**: Synapse developer community

