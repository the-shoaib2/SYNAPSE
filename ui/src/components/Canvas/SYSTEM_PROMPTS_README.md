# 🚀 Canvas System Prompts & Auto Prompt Processor

## Overview

The Canvas system now includes **intelligent system prompts** and **automatic prompt optimization** that work automatically without requiring user input. Every input is automatically analyzed, categorized, and enhanced with the most appropriate system prompt.

## ✨ Key Features

### 🤖 **Automatic Prompt Processing**

- **No user interaction required** - works automatically
- **Intelligent categorization** of input types
- **Automatic optimization** of user requests
- **Smart system prompt selection** based on content

### 🎯 **Comprehensive System Prompts**

- **Core Analysis Prompts**: Comprehensive code analysis, performance optimization, security assessment
- **Language-Specific Prompts**: PHP, JavaScript, Python specialized analysis
- **Category-Based Prompts**: OOP, functional, algorithm, testing analysis
- **Priority-Based Selection**: High, medium, low priority prompts

### 🔄 **Automatic Integration**

- **Seamless Canvas integration** - no configuration needed
- **Real-time processing** of all inputs
- **Enhanced pipeline generation** with system prompts
- **Follow-up suggestions** for deeper analysis

## 🏗️ Architecture

```
User Input → Auto Prompt Processor → System Prompt Selection → Enhanced Canvas → Visualization Pipeline
     ↓              ↓                        ↓                    ↓                ↓
  Raw Text    Optimization &      Best Prompt Match      Integration      Multi-Stage
              Categorization                               & Execution     Visualization
```

## 📁 File Structure

```
ui/src/components/Canvas/
├── SystemPrompts.ts              # Core system prompts and optimization logic
├── AutoPromptProcessor.tsx       # Automatic prompt processing component
├── EnhancedCanvas.tsx            # Canvas with system prompt integration
├── SystemPromptDemo.tsx          # Interactive demo component
└── Canvas.css                    # Styling for all components
```

## 🚀 Quick Start

### 1. **Automatic Usage** (Recommended)

```tsx
import { EnhancedCanvas } from "./components/Canvas";

// Works automatically - no configuration needed
<EnhancedCanvas
  autoProcessPrompts={true} // Default: true
  showPromptProcessor={true} // Default: true
/>;
```

### 2. **Manual Integration**

```tsx
import { AutoPromptProcessor } from "./components/Canvas";

<AutoPromptProcessor
  userInput={userInput}
  onProcessed={handleProcessed}
  autoProcess={true}
/>;
```

### 3. **Demo Component**

```tsx
import { SystemPromptDemo } from "./components/Canvas";

// Interactive demo with sample inputs
<SystemPromptDemo />;
```

## 🎯 System Prompt Categories

### **Core Analysis Prompts**

- **Comprehensive Code Analysis**: Complete visualization of everything
- **Performance & Optimization**: Deep performance analysis
- **Security & Vulnerability**: Security assessment and compliance
- **Architecture & Design**: System architecture evaluation
- **Testing & Quality**: Testing strategy and quality assessment

### **Language-Specific Prompts**

- **PHP**: OOP analysis, best practices, optimization
- **JavaScript**: Modern JS features, async patterns, performance
- **Python**: Data analysis, algorithm efficiency, memory management

### **Specialized Categories**

- **OOP Analysis**: Class structures, inheritance, design patterns
- **Functional Analysis**: Function optimization, complexity analysis
- **Algorithm Analysis**: Performance profiling, optimization
- **Security Analysis**: Vulnerability scanning, compliance checking

## 🔧 How It Works

### **1. Input Detection**

```typescript
// Automatically detects user input from various sources
const selectors = [
  ".user-message",
  '[data-message-role="user"]',
  ".SynapseInputBox",
  'input[type="text"]',
  "textarea",
];
```

### **2. Automatic Categorization**

```typescript
// Detects input type and applies appropriate analysis
if (input.includes("class") && input.includes("function")) {
  // OOP Analysis
} else if (input.includes("performance")) {
  // Performance Analysis
} else if (input.includes("security")) {
  // Security Analysis
}
```

### **3. System Prompt Selection**

```typescript
// Automatically selects the best system prompt
const systemPrompt = selectSystemPrompt(input);
const categories = categorizePrompt(input);
const optimized = optimizePrompt(input);
```

### **4. Enhanced Pipeline Generation**

```typescript
// Creates comprehensive visualization pipeline
const enhanced = createEnhancedPipeline(input, systemPrompt, categories);
```

## 📊 Example Outputs

### **PHP Calculator Class Input**

```
class Calculator {
  private $result = 0.0;
  public function add($number) {
    $this->result += $number;
    return $this;
  }
}
```

### **Automatic Processing Results**

- **Categories**: `['php', 'oop-analysis', 'class-analysis']`
- **System Prompt**: PHP OOP Analysis
- **Suggested Actions**:
  - Generate AST tree
  - Create class diagram
  - Analyze performance
  - Check security
- **Enhanced Pipeline**: 6-stage comprehensive analysis

### **Generated Visualizations**

1. **System Prompt Integration**: Enhanced analysis using PHP OOP system prompt
2. **Comprehensive Analysis**: Complete code structure analysis
3. **Multi-Format Visualization**: AST trees, flowcharts, timelines
4. **Interactive Elements**: Editable code, interactive diagrams
5. **Optimization Suggestions**: Performance and improvement recommendations
6. **PHP-Specific Analysis**: PHP best practices and optimization

## 🎨 UI Components

### **Auto Prompt Processor**

- **Automatic processing** with real-time feedback
- **Processing status** with step-by-step progress
- **Detailed results** with optimization details
- **System prompt information** with full context

### **Enhanced Canvas**

- **System prompt integration** display
- **Enhanced pipeline stages** with metadata
- **Follow-up suggestions** for deeper analysis
- **Automatic execution** of optimized pipelines

### **System Prompt Demo**

- **Interactive prompt testing** with sample inputs
- **System prompt overview** with categories and priorities
- **Real-time processing** demonstration
- **Results visualization** with detailed breakdowns

## 🔄 Integration Points

### **With Existing Canvas**

- **Seamless integration** - no breaking changes
- **Enhanced functionality** - adds intelligence layer
- **Backward compatibility** - works with existing code
- **Performance optimized** - minimal overhead

### **With Synapse Core**

- **Core system integration** - leverages existing AI agents
- **Pipeline execution** - uses existing execution engine
- **Visualization rendering** - integrates with existing panels
- **State management** - uses existing Canvas context

## 🚀 Advanced Features

### **Context-Aware Processing**

```typescript
// Automatically detects context and enhances prompts
const enhanced = enhancePromptWithContext(input, {
  language: "php",
  framework: "laravel",
  complexity: "intermediate",
});
```

### **Follow-up Generation**

```typescript
// Generates intelligent follow-up prompts
const followUps = generateFollowUpPrompts(input);
// Returns: ['Show me the class hierarchy diagram', 'Analyze method relationships']
```

### **Priority-Based Selection**

```typescript
// Prioritizes prompts based on importance
const priority = prompt.priority; // 'high' | 'medium' | 'low'
```

## 📱 Responsive Design

- **Mobile-first approach** with responsive grids
- **Touch-friendly interfaces** for mobile devices
- **Adaptive layouts** for different screen sizes
- **Dark mode support** with automatic theme detection

## 🎯 Use Cases

### **1. Code Analysis**

- **Automatic detection** of code type and language
- **Comprehensive analysis** with multiple visualization types
- **Performance insights** and optimization suggestions
- **Security assessment** and vulnerability detection

### **2. Learning & Documentation**

- **Step-by-step explanations** with visual aids
- **Interactive code exploration** with editable elements
- **Best practices** and improvement recommendations
- **Comprehensive coverage** of all code aspects

### **3. Code Review**

- **Automated analysis** of code quality
- **Performance profiling** and bottleneck identification
- **Security scanning** and compliance checking
- **Architecture evaluation** and design pattern analysis

## 🔧 Configuration

### **Default Settings**

```typescript
const defaultConfig = {
  autoProcessPrompts: true, // Automatic processing
  showPromptProcessor: true, // Show processor UI
  autoExplain: true, // Automatic explanations
  enableAnimations: true, // Smooth animations
  theme: "auto", // Automatic theme detection
};
```

### **Customization**

```typescript
// Custom system prompts
const customPrompts = [
  {
    id: "custom-analysis",
    name: "Custom Analysis",
    prompt: "Your custom prompt here...",
    category: "analysis",
    tags: ["custom", "analysis"],
    priority: "high",
  },
];
```

## 🚀 Performance

- **Lightning-fast processing** with optimized algorithms
- **Minimal memory footprint** with efficient data structures
- **Async processing** for non-blocking operations
- **Caching system** for repeated inputs

## 🔒 Security

- **Input sanitization** for all user inputs
- **Safe execution** in sandboxed environment
- **No external API calls** without user consent
- **Privacy-focused** with local processing

## 📈 Future Enhancements

### **Planned Features**

- **Multi-language support** for more programming languages
- **AI-powered suggestions** for better prompt optimization
- **Custom prompt creation** for user-defined analysis types
- **Integration with external tools** for enhanced analysis

### **Extensibility**

- **Plugin system** for custom prompt types
- **API integration** for external services
- **Custom visualization** support for specialized needs
- **Workflow automation** for complex analysis chains

## 🤝 Contributing

### **Adding New System Prompts**

```typescript
// Add to CORE_SYSTEM_PROMPTS array
{
  id: 'new-analysis',
  name: 'New Analysis Type',
  description: 'Description of the analysis',
  prompt: 'Your system prompt here...',
  category: 'analysis',
  tags: ['new', 'analysis'],
  priority: 'medium'
}
```

### **Extending Language Support**

```typescript
// Add to LANGUAGE_SPECIFIC_PROMPTS
'rust': [
  {
    id: 'rust-analysis',
    name: 'Rust Code Analysis',
    prompt: 'Rust-specific analysis prompt...',
    // ... other properties
  }
]
```

## 📚 Examples

### **Complete Integration Example**

```tsx
import React from "react";
import { EnhancedCanvas } from "./components/Canvas";

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Synapse Canvas with System Prompts</h1>
      </header>

      <main>
        <EnhancedCanvas autoProcessPrompts={true} showPromptProcessor={true} />
      </main>
    </div>
  );
};

export default App;
```

### **Custom Prompt Processing**

```tsx
import { optimizePrompt, selectSystemPrompt } from "./components/Canvas";

const processCustomInput = (input: string) => {
  const optimized = optimizePrompt(input);
  const systemPrompt = selectSystemPrompt(input);

  console.log("Optimized:", optimized.optimized);
  console.log("System Prompt:", systemPrompt.name);

  return { optimized, systemPrompt };
};
```

## 🎉 Conclusion

The Canvas System Prompts and Auto Prompt Processor provide **intelligent, automatic analysis** that works seamlessly with your existing Canvas system. Every input is automatically enhanced and processed with the most appropriate system prompt, delivering comprehensive visualizations and insights without any user configuration.

**Key Benefits:**

- ✅ **Zero configuration** - works automatically
- ✅ **Intelligent processing** - context-aware analysis
- ✅ **Comprehensive coverage** - visualizes everything
- ✅ **Performance optimized** - fast and efficient
- ✅ **Extensible design** - easy to customize and extend

Start using it today and experience the power of intelligent, automatic Canvas analysis! 🚀
