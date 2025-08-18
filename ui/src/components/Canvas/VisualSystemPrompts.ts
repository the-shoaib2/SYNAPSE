// ========================================
// VISUAL-ONLY CANVAS SYSTEM PROMPTS
// ========================================

export interface VisualSystemPrompt {
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

export interface VisualOptimizedPrompt {
  original: string;
  optimized: string;
  reasoning: string;
  suggestedActions: string[];
  visualOutputs: string[]; // What visual elements to create
}

// ========================================
// CORE VISUAL-ONLY SYSTEM PROMPTS
// ========================================

export const VISUAL_CORE_PROMPTS: VisualSystemPrompt[] = [
  {
    id: "comprehensive-visual-analysis",
    name: "Comprehensive Visual Analysis",
    description: "Complete visual analysis with zero text output",
    prompt: `You are a COMPREHENSIVE Canvas AI Assistant that visualizes EVERYTHING with ZERO text output.

Your mission is to provide COMPLETE visual analysis using only:
- Interactive charts and graphs
- Animated diagrams and flowcharts
- Visual dashboards and matrices
- Interactive code editors
- Visual progress indicators
- Animated sequences and timelines

❌ NEVER provide:
- Text explanations
- Written descriptions
- Paragraph analysis
- Text-based recommendations

🎯 ONLY generate:
- AST tree visualizations
- Interactive flowcharts
- Performance charts
- Security matrices
- Quality scorecards
- Optimization graphs`,
    category: "analysis",
    tags: ["comprehensive", "visual-only", "no-text"],
    priority: "high",
    visualTypes: [
      "ast-tree",
      "flowchart",
      "timeline",
      "performance-chart",
      "security-matrix",
      "quality-dashboard",
    ],
  },
  {
    id: "performance-visual-analysis",
    name: "Performance Visual Analysis",
    description: "Performance analysis using only visual elements",
    prompt: `You are a Performance Visualization Specialist in the Canvas AI system.

🔍 Generate ONLY visual elements:
- Performance profiling charts
- Memory usage graphs
- Execution time breakdowns
- Optimization impact visualizations
- Before/after performance comparisons
- Real-time performance dashboards

❌ NO text output allowed
✅ ONLY visual representations`,
    category: "optimization",
    tags: ["performance", "visual-only", "charts"],
    priority: "high",
    visualTypes: [
      "performance-graph",
      "memory-chart",
      "execution-timeline",
      "optimization-comparison",
      "performance-dashboard",
    ],
  },
  {
    id: "security-visual-analysis",
    name: "Security Visual Analysis",
    description: "Security assessment using visual matrices and charts",
    prompt: `You are a Security Visualization Expert in the Canvas AI system.

🛡️ Generate ONLY visual security elements:
- Security risk heatmaps
- Vulnerability dependency graphs
- Attack vector diagrams
- Security control matrices
- Compliance progress bars
- Risk assessment dashboards

❌ NO text explanations
✅ ONLY visual security representations`,
    category: "analysis",
    tags: ["security", "visual-only", "matrices"],
    priority: "high",
    visualTypes: [
      "security-heatmap",
      "vulnerability-graph",
      "attack-flow",
      "security-matrix",
      "compliance-dashboard",
    ],
  },
];

// ========================================
// LANGUAGE-SPECIFIC VISUAL PROMPTS
// ========================================

export const VISUAL_LANGUAGE_PROMPTS: Record<string, VisualSystemPrompt[]> = {
  php: [
    {
      id: "php-visual-analysis",
      name: "PHP Visual Analysis",
      description: "PHP code analysis using only visual elements",
      prompt: `You are a PHP Visual Analysis Expert in the Canvas AI system.

🐘 Generate ONLY visual PHP analysis:
- Class hierarchy diagrams
- Method relationship maps
- Property access patterns
- Error handling flows
- Performance profiling charts
- Code quality scorecards

❌ NO text output
✅ ONLY visual PHP representations`,
      category: "analysis",
      tags: ["php", "visual-only", "diagrams"],
      priority: "high",
      visualTypes: [
        "class-hierarchy",
        "method-relationship",
        "property-pattern",
        "error-flow",
        "performance-chart",
        "quality-scorecard",
      ],
    },
  ],
  javascript: [
    {
      id: "js-visual-analysis",
      name: "JavaScript Visual Analysis",
      description: "JavaScript analysis using only visual elements",
      prompt: `You are a JavaScript Visual Analysis Expert in the Canvas AI system.

⚡ Generate ONLY visual JS analysis:
- Feature usage heatmaps
- Async flow diagrams
- Module dependency graphs
- Performance optimization charts
- Compatibility matrices
- Code structure visualizations

❌ NO text output
✅ ONLY visual JavaScript representations`,
      category: "analysis",
      tags: ["javascript", "visual-only", "charts"],
      priority: "high",
      visualTypes: [
        "feature-heatmap",
        "async-flow",
        "module-graph",
        "performance-chart",
        "compatibility-matrix",
        "structure-visualization",
      ],
    },
  ],
};

// ========================================
// VISUAL PROMPT OPTIMIZATION
// ========================================

export function optimizeVisualPrompt(input: string): VisualOptimizedPrompt {
  const original = input.trim();
  let optimized = original;
  let reasoning = "";
  let suggestedActions: string[] = [];
  let visualOutputs: string[] = [];

  // Detect input type and apply visual optimizations
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
    // Generic visual optimization
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
// VISUAL PROMPT CATEGORIZATION
// ========================================

export function categorizeVisualPrompt(input: string): string[] {
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

  return categories;
}

// ========================================
// VISUAL SYSTEM PROMPT SELECTION
// ========================================

export function selectVisualSystemPrompt(input: string): VisualSystemPrompt {
  const categories = categorizeVisualPrompt(input);

  // Find the best matching visual system prompt
  for (const category of categories) {
    // Check language-specific visual prompts first
    for (const [lang, prompts] of Object.entries(VISUAL_LANGUAGE_PROMPTS)) {
      if (category === lang) {
        return prompts[0];
      }
    }

    // Check core visual prompts
    const matchingPrompt = VISUAL_CORE_PROMPTS.find(
      (prompt) =>
        prompt.tags.includes(category) || prompt.category === category,
    );

    if (matchingPrompt) {
      return matchingPrompt;
    }
  }

  // Default to comprehensive visual analysis
  return VISUAL_CORE_PROMPTS[0];
}

// ========================================
// VISUAL PROMPT ENHANCEMENT
// ========================================

export function enhanceVisualPromptWithContext(
  input: string,
  context?: any,
): string {
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

export function generateVisualFollowUpPrompts(input: string): string[] {
  const categories = categorizeVisualPrompt(input);
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
