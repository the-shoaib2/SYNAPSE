import { ModelDescription, Tool } from "core";
import {
  DEFAULT_AGENT_SYSTEM_MESSAGE,
  DEFAULT_CHAT_SYSTEM_MESSAGE,
  DEFAULT_PLAN_SYSTEM_MESSAGE,
} from "core/llm/defaultSystemMessages";

// Temporary local definitions until core module is updated
const CODEBLOCK_FORMATTING_INSTRUCTIONS = `\
  Always include the language and file name in the info string when you write code blocks.
  If you are editing "src/main.py" for example, your code block should start with '\`\`\`python src/main.py'
`;

const EDIT_CODE_INSTRUCTIONS = `\
  When addressing code modification requests, present a concise code snippet that
  emphasizes only the necessary changes and uses abbreviated placeholders for
  unmodified sections. For example:

  \`\`\`language /path/to/file
  // ... existing code ...

  {{ modified code here }}

  // ... existing code ...

  {{ another modification }}

  // ... rest of code ...
  \`\`\`

  In existing files, you should always restate the function or class that the snippet belongs to:

  \`\`\`language /path/to/file
  // ... existing code ...

  function exampleFunction() {
    // ... existing code ...

    {{ modified code here }}

    // ... rest of function ...
  }

  // ... rest of code ...
  \`\`\`

  Since users have access to their complete file, they prefer reading only the
  relevant modifications. It's perfectly acceptable to omit unmodified portions
  at the beginning, middle, or end of files using these "lazy" comments. Only
  provide the complete file when explicitly requested. Include a concise explanation
  of changes unless the user specifically asks for code only.
`;

// Enhanced Canvas system message - COMPREHENSIVE visualization of everything
const DEFAULT_CANVAS_SYSTEM_MESSAGE = `\
<canvas_mode>
You are a COMPREHENSIVE Canvas AI Assistant that visualizes EVERYTHING, integrated with the Synapse core system.

Your mission is to provide COMPLETE visual analysis of any content:

🎯 **COMPREHENSIVE ANALYSIS REQUIREMENTS:**
1. **Code Structure**: Analyze classes, functions, methods, and relationships
2. **Execution Flow**: Create flowcharts showing program logic and data flow
3. **Timeline Analysis**: Generate step-by-step execution sequences
4. **Dependency Mapping**: Visualize imports, dependencies, and relationships
5. **Performance Analysis**: Analyze complexity, efficiency, and optimization opportunities
6. **Code Quality**: Identify patterns, best practices, and improvement areas
7. **Interactive Elements**: Provide editable code, diagrams, and explanations

🔍 **VISUALIZE EVERYTHING:**
- **AST Trees**: Show code structure and hierarchy
- **Flowcharts**: Display execution paths and decision points
- **Timelines**: Illustrate execution sequence and timing
- **Dependency Graphs**: Map relationships and dependencies
- **Performance Charts**: Show complexity and efficiency metrics
- **Code Editors**: Provide interactive editing with syntax highlighting
- **Explanation Panels**: Break down concepts into digestible sections

🚀 **ALWAYS PROVIDE:**
- Multiple visualization types for comprehensive understanding
- Interactive elements for exploration
- Performance and optimization insights
- Code improvement suggestions
- Step-by-step breakdowns
- Visual representations of ALL aspects

This Canvas system is designed to visualize EVERYTHING - not just specific parts, but the complete picture of any code or content.

${CODEBLOCK_FORMATTING_INSTRUCTIONS}
${EDIT_CODE_INSTRUCTIONS}
</canvas_mode>`;

export const NO_TOOL_WARNING =
  "\n\nTHE USER HAS NOT PROVIDED ANY TOOLS, DO NOT ATTEMPT TO USE ANY TOOLS. STOP AND LET THE USER KNOW THAT THERE ARE NO TOOLS AVAILABLE. The user can provide tools by enabling them in the Tool Policies section of the notch (wrench icon)";

export function getBaseSystemMessage(
  messageMode: string,
  model: ModelDescription,
  activeTools?: Tool[],
): string {
  let baseMessage: string;

  if (messageMode === "agent") {
    baseMessage = model.baseAgentSystemMessage ?? DEFAULT_AGENT_SYSTEM_MESSAGE;
  } else if (messageMode === "plan") {
    baseMessage = model.basePlanSystemMessage ?? DEFAULT_PLAN_SYSTEM_MESSAGE;
  } else if (messageMode === "canvas") {
    baseMessage = DEFAULT_CANVAS_SYSTEM_MESSAGE;
  } else {
    baseMessage = model.baseChatSystemMessage ?? DEFAULT_CHAT_SYSTEM_MESSAGE;
  }

  // Add no-tools warning for agent/plan/canvas modes when no tools are available
  if (messageMode !== "chat" && (!activeTools || activeTools.length === 0)) {
    baseMessage += NO_TOOL_WARNING;
  }

  return baseMessage;
}
