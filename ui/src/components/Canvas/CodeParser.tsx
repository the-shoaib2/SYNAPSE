interface ASTNode {
  id: string;
  type: string;
  code: string;
  description: string;
  children?: ASTNode[];
}

interface ASTEdge {
  source: string;
  target: string;
  type: string;
}

interface ASTResult {
  nodes: ASTNode[];
  edges: ASTEdge[];
}

export class CodeParser {
  async parse(code: string, language: string = "auto"): Promise<ASTResult> {
    // Detect language if auto
    const detectedLanguage =
      language === "auto" ? this.detectLanguage(code) : language;

    // Parse based on language
    switch (detectedLanguage) {
      case "javascript":
      case "typescript":
        return this.parseJavaScript(code);
      case "c":
      case "cpp":
        return this.parseCpp(code);
      case "python":
        return this.parsePython(code);
      case "java":
        return this.parseJava(code);
      default:
        return this.parseGeneric(code);
    }
  }

  private detectLanguage(code: string): string {
    if (
      code.includes("function") ||
      code.includes("const") ||
      code.includes("let")
    ) {
      return "javascript";
    }
    if (code.includes("#include") || code.includes("int main")) {
      return "c";
    }
    if (code.includes("def ") || code.includes("import ")) {
      return "python";
    }
    if (code.includes("public class") || code.includes("public static")) {
      return "java";
    }
    return "generic";
  }

  private parseJavaScript(code: string): ASTResult {
    const lines = code.split("\n").filter((line) => line.trim());
    const nodes: ASTNode[] = [];
    const edges: ASTEdge[] = [];

    let nodeId = 0;
    let functionId = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("function") || trimmedLine.includes("=>")) {
        // Function declaration
        const funcName = this.extractFunctionName(trimmedLine);
        const funcNode: ASTNode = {
          id: `func_${functionId}`,
          type: "Function",
          code: trimmedLine,
          description: `Function: ${funcName}`,
        };
        nodes.push(funcNode);

        if (index > 0) {
          edges.push({
            source: `line_${index - 1}`,
            target: `func_${functionId}`,
            type: "calls",
          });
        }
        functionId++;
      } else if (trimmedLine.includes("if") || trimmedLine.includes("else")) {
        // Control flow
        const controlNode: ASTNode = {
          id: `control_${nodeId}`,
          type: "Control Flow",
          code: trimmedLine,
          description: "Conditional statement",
        };
        nodes.push(controlNode);
        nodeId++;
      } else if (trimmedLine.includes("return")) {
        // Return statement
        const returnNode: ASTNode = {
          id: `return_${nodeId}`,
          type: "Return",
          code: trimmedLine,
          description: "Return statement",
        };
        nodes.push(returnNode);
        nodeId++;
      } else if (
        trimmedLine.includes("=") ||
        trimmedLine.includes("const") ||
        trimmedLine.includes("let")
      ) {
        // Variable assignment
        const varNode: ASTNode = {
          id: `var_${nodeId}`,
          type: "Variable",
          code: trimmedLine,
          description: "Variable assignment",
        };
        nodes.push(varNode);
        nodeId++;
      } else {
        // Generic line
        const genericNode: ASTNode = {
          id: `line_${index}`,
          type: "Code Line",
          code: trimmedLine,
          description: "Code execution",
        };
        nodes.push(genericNode);
      }
    });

    // Create flow edges
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: "flow",
      });
    }

    return { nodes, edges };
  }

  private parseCpp(code: string): ASTResult {
    const lines = code.split("\n").filter((line) => line.trim());
    const nodes: ASTNode[] = [];
    const edges: ASTEdge[] = [];

    let nodeId = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("#include")) {
        const includeNode: ASTNode = {
          id: `include_${nodeId}`,
          type: "Include",
          code: trimmedLine,
          description: "Header inclusion",
        };
        nodes.push(includeNode);
        nodeId++;
      } else if (trimmedLine.includes("int main")) {
        const mainNode: ASTNode = {
          id: `main_${nodeId}`,
          type: "Main Function",
          code: trimmedLine,
          description: "Program entry point",
        };
        nodes.push(mainNode);
        nodeId++;
      } else if (
        trimmedLine.includes("printf") ||
        trimmedLine.includes("cout")
      ) {
        const outputNode: ASTNode = {
          id: `output_${nodeId}`,
          type: "Output",
          code: trimmedLine,
          description: "Output statement",
        };
        nodes.push(outputNode);
        nodeId++;
      } else if (trimmedLine.includes("return")) {
        const returnNode: ASTNode = {
          id: `return_${nodeId}`,
          type: "Return",
          code: trimmedLine,
          description: "Return statement",
        };
        nodes.push(returnNode);
        nodeId++;
      } else if (trimmedLine.includes("{") || trimmedLine.includes("}")) {
        const braceNode: ASTNode = {
          id: `brace_${nodeId}`,
          type: "Block",
          code: trimmedLine,
          description: "Code block delimiter",
        };
        nodes.push(braceNode);
        nodeId++;
      } else if (trimmedLine) {
        const genericNode: ASTNode = {
          id: `line_${index}`,
          type: "Code Line",
          code: trimmedLine,
          description: "Code execution",
        };
        nodes.push(genericNode);
      }
    });

    // Create flow edges
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: "flow",
      });
    }

    return { nodes, edges };
  }

  private parsePython(code: string): ASTResult {
    const lines = code.split("\n").filter((line) => line.trim());
    const nodes: ASTNode[] = [];
    const edges: ASTEdge[] = [];

    let nodeId = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("def ")) {
        const funcNode: ASTNode = {
          id: `func_${nodeId}`,
          type: "Function",
          code: trimmedLine,
          description: "Function definition",
        };
        nodes.push(funcNode);
        nodeId++;
      } else if (
        trimmedLine.startsWith("if ") ||
        trimmedLine.startsWith("elif ") ||
        trimmedLine.startsWith("else:")
      ) {
        const controlNode: ASTNode = {
          id: `control_${nodeId}`,
          type: "Control Flow",
          code: trimmedLine,
          description: "Conditional statement",
        };
        nodes.push(controlNode);
        nodeId++;
      } else if (
        trimmedLine.startsWith("for ") ||
        trimmedLine.startsWith("while ")
      ) {
        const loopNode: ASTNode = {
          id: `loop_${nodeId}`,
          type: "Loop",
          code: trimmedLine,
          description: "Loop statement",
        };
        nodes.push(loopNode);
        nodeId++;
      } else if (trimmedLine.startsWith("return")) {
        const returnNode: ASTNode = {
          id: `return_${nodeId}`,
          type: "Return",
          code: trimmedLine,
          description: "Return statement",
        };
        nodes.push(returnNode);
        nodeId++;
      } else if (
        trimmedLine.startsWith("import ") ||
        trimmedLine.startsWith("from ")
      ) {
        const importNode: ASTNode = {
          id: `import_${nodeId}`,
          type: "Import",
          code: trimmedLine,
          description: "Module import",
        };
        nodes.push(importNode);
        nodeId++;
      } else if (trimmedLine) {
        const genericNode: ASTNode = {
          id: `line_${index}`,
          type: "Code Line",
          code: trimmedLine,
          description: "Code execution",
        };
        nodes.push(genericNode);
      }
    });

    // Create flow edges
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: "flow",
      });
    }

    return { nodes, edges };
  }

  private parseJava(code: string): ASTResult {
    const lines = code.split("\n").filter((line) => line.trim());
    const nodes: ASTNode[] = [];
    const edges: ASTEdge[] = [];

    let nodeId = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("public class")) {
        const classNode: ASTNode = {
          id: `class_${nodeId}`,
          type: "Class",
          code: trimmedLine,
          description: "Class declaration",
        };
        nodes.push(classNode);
        nodeId++;
      } else if (trimmedLine.includes("public static void main")) {
        const mainNode: ASTNode = {
          id: `main_${nodeId}`,
          type: "Main Method",
          code: trimmedLine,
          description: "Program entry point",
        };
        nodes.push(mainNode);
        nodeId++;
      } else if (trimmedLine.includes("System.out.println")) {
        const outputNode: ASTNode = {
          id: `output_${nodeId}`,
          type: "Output",
          code: trimmedLine,
          description: "Output statement",
        };
        nodes.push(outputNode);
        nodeId++;
      } else if (trimmedLine.includes("return")) {
        const returnNode: ASTNode = {
          id: `return_${nodeId}`,
          type: "Return",
          code: trimmedLine,
          description: "Return statement",
        };
        nodes.push(returnNode);
        nodeId++;
      } else if (trimmedLine.includes("{") || trimmedLine.includes("}")) {
        const braceNode: ASTNode = {
          id: `brace_${nodeId}`,
          type: "Block",
          code: trimmedLine,
          description: "Code block delimiter",
        };
        nodes.push(braceNode);
        nodeId++;
      } else if (trimmedLine) {
        const genericNode: ASTNode = {
          id: `line_${index}`,
          type: "Code Line",
          code: trimmedLine,
          description: "Code execution",
        };
        nodes.push(genericNode);
      }
    });

    // Create flow edges
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: "flow",
      });
    }

    return { nodes, edges };
  }

  private parseGeneric(code: string): ASTResult {
    const lines = code.split("\n").filter((line) => line.trim());
    const nodes: ASTNode[] = [];
    const edges: ASTEdge[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const genericNode: ASTNode = {
          id: `line_${index}`,
          type: "Code Line",
          code: trimmedLine,
          description: "Code execution",
        };
        nodes.push(genericNode);
      }
    });

    // Create flow edges
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: "flow",
      });
    }

    return { nodes, edges };
  }

  private extractFunctionName(line: string): string {
    // Extract function name from function declaration
    const match = line.match(/function\s+(\w+)/);
    if (match) return match[1];

    // Extract from arrow function
    const arrowMatch = line.match(/(\w+)\s*=/);
    if (arrowMatch) return arrowMatch[1];

    return "anonymous";
  }
}


