// ========================================
// CANVAS SYSTEM PROMPTS & OPTIMIZATION
// ========================================

export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category:
    | "analysis"
    | "visualization"
    | "optimization"
    | "explanation"
    | "generation";
  tags: string[];
  priority: "high" | "medium" | "low";
  visualTypes: string[]; // What types of visualizations to generate
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  reasoning: string;
  suggestedActions: string[];
  visualOutputs: string[]; // What visual elements to create
}

// ========================================
// CORE SYSTEM PROMPTS - VISUAL ONLY
// ========================================

export const CORE_SYSTEM_PROMPTS: SystemPrompt[] = [
  {
    id: "comprehensive-analysis",
    name: "Comprehensive Code Analysis",
    description:
      "Complete analysis covering all aspects of code structure, performance, and quality",
    prompt: `You are a COMPREHENSIVE Canvas AI Assistant that visualizes EVERYTHING, integrated with the Synapse core system.

Your mission is to provide COMPLETE visual analysis of any content with ZERO text output:

🎯 **VISUALIZATION REQUIREMENTS (NO TEXT):**
1. **Code Structure**: Generate AST trees, class diagrams, and relationship maps
2. **Execution Flow**: Create interactive flowcharts showing program logic and data flow
3. **Timeline Analysis**: Generate animated execution sequences and step-by-step visualizations
4. **Dependency Mapping**: Visualize imports, dependencies, and relationships as interactive graphs
5. **Performance Analysis**: Create performance charts, memory usage graphs, and optimization visualizations
6. **Code Quality**: Generate quality scorecards, pattern recognition diagrams, and improvement visualizations
7. **Interactive Elements**: Provide editable code editors, interactive diagrams, and visual exploration tools

🔍 **VISUALIZE EVERYTHING - NO TEXT:**
- **AST Trees**: Interactive tree visualizations with node expansion/collapse
- **Flowcharts**: Animated execution paths with decision point highlights
- **Timelines**: Visual execution sequences with progress indicators
- **Dependency Graphs**: Interactive relationship maps with zoom/pan
- **Performance Charts**: Real-time performance metrics and optimization suggestions
- **Code Editors**: Syntax-highlighted editors with live preview
- **Visual Panels**: Multi-panel layouts showing different aspects simultaneously

🚀 **ALWAYS PROVIDE:**
- Multiple visualization types for comprehensive understanding
- Interactive elements for exploration
- Performance and optimization insights as charts/graphs
- Code improvement suggestions as visual overlays
- Step-by-step breakdowns as animated sequences
- Visual representations of ALL aspects

❌ **NEVER PROVIDE:**
- Text explanations
- Written descriptions
- Paragraph explanations
- Text-based analysis
- Written recommendations

This Canvas system is designed to visualize EVERYTHING visually - not just specific parts, but the complete picture of any code or content using pure visualizations.`,
    category: "analysis",
    tags: ["comprehensive", "code-analysis", "visualization"],
    priority: "high",
    visualTypes: [
      "ast-tree",
      "flowchart",
      "timeline",
      "dependency-graph",
      "performance-graph",
      "code-editor",
      "interactive-panel",
    ],
  },
  {
    id: "performance-optimization",
    name: "Performance & Optimization Analysis",
    description:
      "Deep dive into performance characteristics and optimization opportunities",
    prompt: `You are a Performance Optimization Specialist in the Canvas AI system.

🔍 **PERFORMANCE ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Time Complexity**: Generate Big O notation charts and algorithmic efficiency visualizations
2. **Space Complexity**: Create memory usage pattern graphs and optimization visualizations
3. **Bottleneck Identification**: Generate performance heatmaps and critical section highlights
4. **Optimization Strategies**: Create before/after comparison charts and improvement visualizations
5. **Benchmarking**: Generate performance comparison charts and metric dashboards
6. **Resource Usage**: Create CPU, memory, and I/O pattern visualizations

📊 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Performance profiling charts with real-time updates
- Memory usage graphs with trend analysis
- Execution time breakdowns as pie charts
- Optimization impact visualizations as before/after comparisons
- Performance testing dashboards with interactive metrics

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive performance analysis dashboard
- Real-time performance monitoring charts
- Optimization impact visualizations
- Performance testing result displays
- Resource usage pattern graphs

❌ **NEVER PROVIDE:**
- Text explanations
- Written analysis
- Paragraph descriptions
- Text-based recommendations`,
    category: "optimization",
    tags: ["performance", "optimization", "benchmarking"],
    priority: "high",
    visualTypes: [
      "performance-graph",
      "memory-chart",
      "execution-timeline",
      "optimization-comparison",
      "resource-dashboard",
    ],
  },
  {
    id: "security-analysis",
    name: "Security & Vulnerability Analysis",
    description:
      "Comprehensive security assessment and vulnerability identification",
    prompt: `You are a Security Analysis Expert in the Canvas AI system.

🔒 **SECURITY ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Vulnerability Scanning**: Generate security risk heatmaps and vulnerability matrices
2. **Input Validation**: Create injection attack flow diagrams and data validation charts
3. **Authentication**: Generate access control flowcharts and security mechanism diagrams
4. **Data Protection**: Create encryption flow diagrams and data handling visualizations
5. **Dependency Security**: Generate vulnerability dependency graphs and security control matrices
6. **Compliance**: Create compliance checklists as interactive visual elements

🛡️ **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Security risk heatmaps with color-coded severity
- Vulnerability dependency graphs with interactive nodes
- Attack vector diagrams with animated flow paths
- Security control matrices as interactive grids
- Compliance checklists as visual progress indicators

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive security assessment dashboard
- Risk prioritization matrix as visual grid
- Remediation recommendation flowcharts
- Security testing strategy diagrams
- Compliance documentation as visual progress bars

❌ **NEVER PROVIDE:**
- Text explanations
- Written security reports
- Paragraph descriptions
- Text-based recommendations`,
    category: "analysis",
    tags: ["security", "vulnerability", "compliance"],
    priority: "high",
    visualTypes: [
      "security-heatmap",
      "vulnerability-graph",
      "attack-flow",
      "security-matrix",
      "compliance-dashboard",
    ],
  },
  {
    id: "architecture-design",
    name: "Architecture & Design Analysis",
    description: "System architecture evaluation and design pattern analysis",
    prompt: `You are an Architecture & Design Expert in the Canvas AI system.

🏗️ **ARCHITECTURE ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Design Patterns**: Generate pattern recognition diagrams and usage visualizations
2. **System Structure**: Create component relationship maps and dependency diagrams
3. **Scalability**: Generate horizontal/vertical scaling visualizations and capacity charts
4. **Maintainability**: Create code organization maps and modularity visualizations
5. **Integration**: Generate system integration diagrams and API relationship maps
6. **Technology Stack**: Create technology choice comparisons and alternative visualizations

📐 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Interactive architecture diagrams with zoom/pan
- Component relationship maps with clickable nodes
- Data flow diagrams with animated paths
- System topology views with layer highlighting
- Design pattern illustrations as interactive examples

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive architecture assessment dashboard
- Design pattern recommendation visualizations
- Scalability analysis charts
- Technology stack comparison matrices
- Integration strategy flowcharts

❌ **NEVER PROVIDE:**
- Text explanations
- Written architecture reports
- Paragraph descriptions
- Text-based recommendations`,
    category: "analysis",
    tags: ["architecture", "design-patterns", "scalability"],
    priority: "medium",
    visualTypes: [
      "architecture-diagram",
      "component-map",
      "data-flow",
      "topology-view",
      "pattern-illustration",
    ],
  },
  {
    id: "testing-strategy",
    name: "Testing & Quality Assurance",
    description: "Comprehensive testing strategy and quality assessment",
    prompt: `You are a Testing & QA Expert in the Canvas AI system.

🧪 **TESTING ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Test Coverage**: Generate coverage maps and gap analysis visualizations
2. **Testing Types**: Create testing workflow diagrams and strategy maps
3. **Quality Metrics**: Generate quality indicator dashboards and trend charts
4. **Bug Patterns**: Create issue pattern recognition charts and root cause visualizations
5. **Testing Tools**: Generate framework comparison matrices and tool selection charts
6. **CI/CD Integration**: Create automation workflow diagrams and pipeline visualizations

📊 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Interactive test coverage reports with drill-down capabilities
- Quality metric dashboards with real-time updates
- Bug trend analysis charts with pattern recognition
- Testing workflow diagrams with step-by-step progression
- Quality improvement roadmaps as visual timelines

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive testing strategy dashboard
- Quality assessment visualization suite
- Test automation recommendation charts
- Bug prevention strategy diagrams
- Quality improvement timeline

❌ **NEVER PROVIDE:**
- Text explanations
- Written testing reports
- Paragraph descriptions
- Text-based recommendations`,
    category: "analysis",
    tags: ["testing", "quality", "automation"],
    priority: "medium",
    visualTypes: [
      "coverage-map",
      "quality-dashboard",
      "bug-trend",
      "workflow-diagram",
      "improvement-timeline",
    ],
  },
];

// ========================================
// SPECIALIZED PROMPTS BY LANGUAGE/TECHNOLOGY
// ========================================

export const LANGUAGE_SPECIFIC_PROMPTS: Record<string, SystemPrompt[]> = {
  php: [
    {
      id: "php-oop-analysis",
      name: "PHP OOP Analysis",
      description: "Object-oriented PHP code analysis and best practices",
      prompt: `You are a PHP OOP Expert in the Canvas AI system.

🐘 **PHP OOP ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Class Structure**: Generate class hierarchy diagrams and inheritance trees
2. **Method Analysis**: Create method relationship maps and signature visualizations
3. **Property Management**: Generate property access pattern charts and encapsulation diagrams
4. **Design Patterns**: Create pattern usage recognition charts and implementation examples
5. **Error Handling**: Generate exception flow diagrams and error handling maps
6. **Performance**: Create PHP-specific optimization charts and best practice visualizations

📊 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Interactive class hierarchy diagrams with expandable nodes
- Method relationship maps with call flow visualization
- Property access pattern charts with visibility indicators
- Error handling flow diagrams with exception paths
- Performance profiling charts with optimization highlights

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive OOP best practices dashboard
- Performance optimization visualization suite
- Error handling strategy diagrams
- Design pattern recognition charts

❌ **NEVER PROVIDE:**
- Text explanations
- Written PHP guides
- Paragraph descriptions
- Text-based recommendations`,
      category: "analysis",
      tags: ["php", "oop", "best-practices"],
      priority: "high",
      visualTypes: [
        "class-hierarchy",
        "method-relationship",
        "property-pattern",
        "error-flow",
        "performance-chart",
      ],
    },
  ],
  javascript: [
    {
      id: "js-modern-analysis",
      name: "Modern JavaScript Analysis",
      description: "ES6+ JavaScript features and modern patterns analysis",
      prompt: `You are a Modern JavaScript Expert in the Canvas AI system.

⚡ **MODERN JS ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **ES6+ Features**: Generate feature usage heatmaps and syntax visualization charts
2. **Async Patterns**: Create Promise flow diagrams and async/await visualization maps
3. **Module System**: Generate module dependency graphs and bundling strategy charts
4. **Functional Programming**: Create functional pattern recognition charts and composition diagrams
5. **Performance**: Generate modern JS optimization charts and performance comparison graphs
6. **Browser Compatibility**: Create compatibility matrix visualizations and feature support charts

📊 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Interactive feature usage heatmaps with clickable regions
- Async flow diagrams with animated execution paths
- Module dependency graphs with import/export visualization
- Performance optimization charts with before/after comparisons
- Compatibility matrices with interactive browser support indicators

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive modern JS best practices dashboard
- Performance optimization visualization suite
- Compatibility recommendation charts
- Feature migration strategy diagrams

❌ **NEVER PROVIDE:**
- Text explanations
- Written JavaScript guides
- Paragraph descriptions
- Text-based recommendations`,
      category: "analysis",
      tags: ["javascript", "es6", "modern-js"],
      priority: "high",
      visualTypes: [
        "feature-heatmap",
        "async-flow",
        "module-graph",
        "performance-chart",
        "compatibility-matrix",
      ],
    },
  ],
  python: [
    {
      id: "python-data-analysis",
      name: "Python Data Analysis",
      description: "Python data science and analysis code review",
      prompt: `You are a Python Data Analysis Expert in the Canvas AI system.

🐍 **PYTHON DATA ANALYSIS REQUIREMENTS (VISUAL ONLY):**
1. **Data Structures**: Generate pandas/numpy usage charts and data handling visualizations
2. **Algorithm Efficiency**: Create algorithm complexity charts and optimization visualizations
3. **Memory Management**: Generate memory usage pattern graphs and optimization charts
4. **Visualization**: Create plotting library comparison charts and chart type selection matrices
5. **Performance**: Generate Python-specific optimization charts and best practice visualizations
6. **Best Practices**: Create coding standard compliance charts and improvement visualizations

📊 **VISUALIZATION REQUIREMENTS (NO TEXT):**
- Interactive data structure usage charts with drill-down capabilities
- Memory usage pattern graphs with optimization highlights
- Performance profiling charts with real-time updates
- Algorithm complexity analysis with visual comparisons
- Data structure visualization examples with interactive elements

🚀 **DELIVERABLES (VISUAL ONLY):**
- Interactive data analysis best practices dashboard
- Performance optimization visualization suite
- Memory management strategy diagrams
- Visualization recommendation charts

❌ **NEVER PROVIDE:**
- Text explanations
- Written Python guides
- Paragraph descriptions
- Text-based recommendations`,
      category: "analysis",
      tags: ["python", "data-science", "pandas"],
      priority: "high",
      visualTypes: [
        "data-structure-chart",
        "memory-pattern",
        "performance-profile",
        "algorithm-complexity",
        "visualization-example",
      ],
    },
  ],
};

// ========================================
// AUTOMATIC PROMPT OPTIMIZATION - VISUAL FOCUSED
// ========================================

export function optimizePrompt(input: string): OptimizedPrompt {
  const original = input.trim();
  let optimized = original;
  let reasoning = "";
  let suggestedActions: string[] = [];
  let visualOutputs: string[] = [];

  // Detect input type and apply appropriate optimizations
  if (original.includes("class") && original.includes("function")) {
    optimized = `Generate comprehensive visual analysis:
1. Class structure and inheritance diagrams
2. Method relationship flowcharts
3. Performance profiling charts
4. Code quality scorecards
5. Security vulnerability matrices
6. Optimization opportunity visualizations

Code: ${original}`;
    reasoning =
      "Detected class-based code - enhanced with comprehensive visual analysis framework";
    suggestedActions = [
      "Generate AST tree visualization",
      "Create class hierarchy diagram",
      "Analyze performance with charts",
      "Check security with visual matrices",
    ];
    visualOutputs = [
      "ast-tree",
      "class-hierarchy",
      "performance-chart",
      "security-matrix",
      "quality-scorecard",
      "optimization-chart",
    ];
  } else if (
    original.includes("function") ||
    original.includes("def") ||
    original.includes("method")
  ) {
    optimized = `Generate functional analysis visualizations:
1. Function complexity charts
2. Execution flow diagrams
3. Edge case analysis matrices
4. Performance optimization graphs
5. Code readability visualizations

Code: ${original}`;
    reasoning =
      "Detected function/method - enhanced with functional analysis visualization framework";
    suggestedActions = [
      "Generate flowchart visualization",
      "Analyze complexity with charts",
      "Check edge cases with matrices",
      "Optimize performance with graphs",
    ];
    visualOutputs = [
      "flowchart",
      "complexity-chart",
      "edge-case-matrix",
      "performance-graph",
      "readability-chart",
    ];
  } else if (
    original.includes("graph") ||
    original.includes("flowchart") ||
    original.includes("diagram")
  ) {
    optimized = `Create comprehensive visual diagram:
1. Parse and validate diagram syntax
2. Generate interactive visualization
3. Add execution flow analysis
4. Include step-by-step animation
5. Provide optimization suggestions

Diagram: ${original}`;
    reasoning =
      "Detected diagram/flowchart - enhanced with visualization framework";
    suggestedActions = [
      "Parse diagram with visual feedback",
      "Generate interactive visualization",
      "Add animated flow analysis",
      "Explain flow with visual elements",
    ];
    visualOutputs = [
      "diagram-parser",
      "interactive-visualization",
      "animated-flow",
      "visual-explanation",
    ];
  } else if (
    original.includes("error") ||
    original.includes("bug") ||
    original.includes("fix")
  ) {
    optimized = `Generate debugging visualizations:
1. Error pattern recognition charts
2. Root cause analysis diagrams
3. Fix implementation flowcharts
4. Prevention strategy matrices
5. Performance optimization graphs

Issue: ${original}`;
    reasoning =
      "Detected debugging request - enhanced with problem-solving visualization framework";
    suggestedActions = [
      "Analyze errors with visual patterns",
      "Generate fix flowcharts",
      "Optimize code with performance charts",
      "Prevent issues with strategy matrices",
    ];
    visualOutputs = [
      "error-pattern-chart",
      "root-cause-diagram",
      "fix-flowchart",
      "prevention-matrix",
      "optimization-graph",
    ];
  } else if (
    original.includes("performance") ||
    original.includes("speed") ||
    original.includes("optimize")
  ) {
    optimized = `Generate performance analysis visualizations:
1. Current performance baseline charts
2. Bottleneck identification heatmaps
3. Optimization strategy flowcharts
4. Improvement benchmark comparisons
5. Resource usage monitoring graphs

Request: ${original}`;
    reasoning =
      "Detected performance request - enhanced with optimization visualization framework";
    suggestedActions = [
      "Profile performance with real-time charts",
      "Identify bottlenecks with heatmaps",
      "Optimize code with strategy diagrams",
      "Benchmark results with comparison charts",
    ];
    visualOutputs = [
      "performance-baseline",
      "bottleneck-heatmap",
      "optimization-strategy",
      "benchmark-comparison",
      "resource-monitoring",
    ];
  } else {
    // Generic optimization for any input
    optimized = `Generate comprehensive visual analysis:
1. Content structure visualizations
2. Interactive exploration diagrams
3. Analysis result dashboards
4. Improvement opportunity charts
5. Optimization strategy matrices

Content: ${original}`;
    reasoning =
      "Generic input - enhanced with comprehensive visual analysis framework";
    suggestedActions = [
      "Analyze content with visual dashboards",
      "Generate interactive visualizations",
      "Create analysis result charts",
      "Suggest improvements with matrices",
    ];
    visualOutputs = [
      "structure-visualization",
      "interactive-diagram",
      "analysis-dashboard",
      "improvement-chart",
      "optimization-matrix",
    ];
  }

  return {
    original,
    optimized,
    reasoning,
    suggestedActions,
    visualOutputs,
  };
}

// ========================================
// PROMPT CATEGORIZATION - VISUAL FOCUSED
// ========================================

export function categorizePrompt(input: string): string[] {
  const categories: string[] = [];
  const lowerInput = input.toLowerCase();

  // Code analysis categories
  if (lowerInput.includes("class") || lowerInput.includes("object"))
    categories.push("oop-analysis");
  if (lowerInput.includes("function") || lowerInput.includes("method"))
    categories.push("functional-analysis");
  if (lowerInput.includes("algorithm") || lowerInput.includes("complexity"))
    categories.push("algorithm-analysis");
  if (lowerInput.includes("performance") || lowerInput.includes("optimize"))
    categories.push("performance-analysis");
  if (lowerInput.includes("security") || lowerInput.includes("vulnerability"))
    categories.push("security-analysis");
  if (lowerInput.includes("test") || lowerInput.includes("quality"))
    categories.push("testing-analysis");

  // Visualization categories
  if (lowerInput.includes("visualize") || lowerInput.includes("diagram"))
    categories.push("visualization");
  if (lowerInput.includes("flowchart") || lowerInput.includes("flow"))
    categories.push("flowchart");
  if (lowerInput.includes("graph") || lowerInput.includes("chart"))
    categories.push("graph-visualization");
  if (lowerInput.includes("timeline") || lowerInput.includes("sequence"))
    categories.push("timeline");
  if (lowerInput.includes("ast") || lowerInput.includes("tree"))
    categories.push("ast-visualization");

  // Technology categories
  if (lowerInput.includes("php")) categories.push("php");
  if (lowerInput.includes("javascript") || lowerInput.includes("js"))
    categories.push("javascript");
  if (lowerInput.includes("python")) categories.push("python");
  if (lowerInput.includes("java")) categories.push("java");
  if (lowerInput.includes("c++") || lowerInput.includes("cpp"))
    categories.push("cpp");

  return categories;
}

// ========================================
// AUTOMATIC SYSTEM PROMPT SELECTION
// ========================================

export function selectSystemPrompt(input: string): SystemPrompt {
  const categories = categorizePrompt(input);

  // Find the best matching system prompt
  for (const category of categories) {
    // Check language-specific prompts first
    for (const [lang, prompts] of Object.entries(LANGUAGE_SPECIFIC_PROMPTS)) {
      if (category === lang) {
        return prompts[0]; // Return first language-specific prompt
      }
    }

    // Check core prompts
    const matchingPrompt = CORE_SYSTEM_PROMPTS.find(
      (prompt) =>
        prompt.tags.includes(category) || prompt.category === category,
    );

    if (matchingPrompt) {
      return matchingPrompt;
    }
  }

  // Default to comprehensive analysis
  return CORE_SYSTEM_PROMPTS[0];
}

// ========================================
// PROMPT ENHANCEMENT UTILITIES - VISUAL FOCUSED
// ========================================

export function enhancePromptWithContext(input: string, context?: any): string {
  let enhanced = input;

  if (context?.language) {
    enhanced += `\n\nLanguage Context: ${context.language}`;
  }

  if (context?.framework) {
    enhanced += `\n\nFramework: ${context.framework}`;
  }

  if (context?.complexity) {
    enhanced += `\n\nComplexity Level: ${context.complexity}`;
  }

  return enhanced;
}

export function generateFollowUpPrompts(input: string): string[] {
  const categories = categorizePrompt(input);
  const followUps: string[] = [];

  if (categories.includes("oop-analysis")) {
    followUps.push("Show me the class hierarchy diagram");
    followUps.push("Analyze the method relationships");
    followUps.push("Check for design pattern usage");
  }

  if (categories.includes("performance-analysis")) {
    followUps.push("Profile the execution time");
    followUps.push("Analyze memory usage patterns");
    followUps.push("Identify optimization bottlenecks");
  }

  if (categories.includes("security-analysis")) {
    followUps.push("Scan for common vulnerabilities");
    followUps.push("Check input validation");
    followUps.push("Analyze authentication mechanisms");
  }

  return followUps;
}
