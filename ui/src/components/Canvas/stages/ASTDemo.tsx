import { PipelineStage } from "../types";
import { ASTTreePanel } from "./ASTTreePanel";

// Sample PHP Calculator AST data for demonstration
const sampleASTData = {
  type: "Program",
  children: [
    {
      type: "ClassDeclaration",
      name: "Calculator",
      children: [
        {
          type: "Stmt_Property",
          name: "result",
          modifiers: ["private"],
          value: "0.0",
        },
        {
          type: "Stmt_ClassMethod",
          name: "add",
          modifiers: ["public"],
          children: [
            {
              type: "Params",
              children: [
                {
                  type: "Param",
                  name: "number",
                  variable: "number",
                },
              ],
            },
            {
              type: "Stmt_Expression",
              children: [
                {
                  type: "Expr_AssignOp_Plus",
                  children: [
                    {
                      type: "Expr_PropertyFetch",
                      children: [
                        { type: "Expr_Variable", name: "this" },
                        { type: "Identifier", name: "result" },
                      ],
                    },
                    {
                      type: "Expr_Variable",
                      name: "number",
                    },
                  ],
                },
              ],
            },
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_Variable",
                  name: "this",
                },
              ],
            },
          ],
        },
        {
          type: "Stmt_ClassMethod",
          name: "subtract",
          modifiers: ["public"],
          children: [
            {
              type: "Params",
              children: [
                {
                  type: "Param",
                  name: "number",
                  variable: "number",
                },
              ],
            },
            {
              type: "Stmt_Expression",
              children: [
                {
                  type: "Expr_AssignOp_Minus",
                  children: [
                    {
                      type: "Expr_PropertyFetch",
                      children: [
                        { type: "Expr_Variable", name: "this" },
                        { type: "Identifier", name: "result" },
                      ],
                    },
                    {
                      type: "Expr_Variable",
                      name: "number",
                    },
                  ],
                },
              ],
            },
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_Variable",
                  name: "this",
                },
              ],
            },
          ],
        },
        {
          type: "Stmt_ClassMethod",
          name: "multiply",
          modifiers: ["public"],
          children: [
            {
              type: "Params",
              children: [
                {
                  type: "Param",
                  name: "number",
                  variable: "number",
                },
              ],
            },
            {
              type: "Stmt_Expression",
              children: [
                {
                  type: "Expr_AssignOp_Mul",
                  children: [
                    {
                      type: "Expr_PropertyFetch",
                      children: [
                        { type: "Expr_Variable", name: "this" },
                        { type: "Identifier", name: "result" },
                      ],
                    },
                    {
                      type: "Expr_Variable",
                      name: "number",
                    },
                  ],
                },
              ],
            },
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_Variable",
                  name: "this",
                },
              ],
            },
          ],
        },
        {
          type: "Stmt_ClassMethod",
          name: "divide",
          modifiers: ["public"],
          children: [
            {
              type: "Params",
              children: [
                {
                  type: "Param",
                  name: "number",
                  variable: "number",
                },
              ],
            },
            {
              type: "Stmt_If",
              children: [
                {
                  type: "Expr_BinaryOp_NotIdentical",
                  children: [
                    { type: "Expr_Variable", name: "number" },
                    { type: "Scalar_LNumber", value: "0" },
                  ],
                },
                {
                  type: "Stmt_Expression",
                  children: [
                    {
                      type: "Expr_AssignOp_Div",
                      children: [
                        {
                          type: "Expr_PropertyFetch",
                          children: [
                            { type: "Expr_Variable", name: "this" },
                            { type: "Identifier", name: "result" },
                          ],
                        },
                        {
                          type: "Expr_Variable",
                          name: "number",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "Stmt_Else",
                  children: [
                    {
                      type: "Stmt_Echo",
                      children: [
                        {
                          type: "Scalar_String",
                          value: "Division by zero error.",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_Variable",
                  name: "this",
                },
              ],
            },
          ],
        },
        {
          type: "Stmt_ClassMethod",
          name: "getResult",
          modifiers: ["public"],
          children: [
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_PropertyFetch",
                  children: [
                    { type: "Expr_Variable", name: "this" },
                    { type: "Identifier", name: "result" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "Stmt_ClassMethod",
          name: "reset",
          modifiers: ["public"],
          children: [
            {
              type: "Stmt_Expression",
              children: [
                {
                  type: "Expr_Assign",
                  children: [
                    {
                      type: "Expr_PropertyFetch",
                      children: [
                        { type: "Expr_Variable", name: "this" },
                        { type: "Identifier", name: "result" },
                      ],
                    },
                    {
                      type: "Scalar_Float",
                      value: "0.0",
                    },
                  ],
                },
              ],
            },
            {
              type: "Stmt_Return",
              children: [
                {
                  type: "Expr_Variable",
                  name: "this",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "Stmt_Expression",
      children: [
        {
          type: "Expr_Assign",
          children: [
            { type: "Expr_Variable", name: "calc" },
            {
              type: "Expr_New",
              children: [{ type: "Name", name: "Calculator" }],
            },
          ],
        },
      ],
    },
    {
      type: "Stmt_Expression",
      children: [
        {
          type: "Expr_MethodCall",
          children: [
            {
              type: "Expr_MethodCall",
              children: [
                { type: "Expr_Variable", name: "calc" },
                { type: "Identifier", name: "add" },
                {
                  type: "Args",
                  children: [{ type: "Scalar_LNumber", value: "10" }],
                },
              ],
            },
            { type: "Identifier", name: "subtract" },
            {
              type: "Args",
              children: [{ type: "Scalar_LNumber", value: "5" }],
            },
          ],
        },
      ],
    },
    {
      type: "Stmt_Echo",
      children: [
        {
          type: "Expr_Concat",
          children: [
            {
              type: "Scalar_String",
              value: "Result: ",
            },
            {
              type: "Expr_MethodCall",
              children: [
                { type: "Expr_Variable", name: "calc" },
                { type: "Identifier", name: "getResult" },
                { type: "Args", children: [] },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Create a sample pipeline stage for the AST visualization
const sampleStage: PipelineStage = {
  id: "ast_visualization_demo",
  stage: "PHP Calculator AST Analysis",
  type: "visualize",
  engine: "tool:ast-parser",
  inputs: ["php_calculator_code"],
  outputs: ["ast_visualization"],
  editable: false,
  visualType: "ast-tree",
  payload: {
    visual: sampleASTData,
    explain:
      "This Abstract Syntax Tree shows the complete structure of the PHP Calculator class, including all methods, properties, and their relationships. The tree reveals the fluent interface pattern used in the calculator, where methods return $this to enable method chaining.",
  },
  explanation:
    "This Abstract Syntax Tree shows the complete structure of the PHP Calculator class, including all methods, properties, and their relationships. The tree reveals the fluent interface pattern used in the calculator, where methods return $this to enable method chaining.",
};

export function ASTDemo() {
  return (
    <div className="ast-demo-container">
      <div className="demo-header">
        <h2>🌳 Enhanced AST Tree Visualization Demo</h2>
        <p>Interactive Abstract Syntax Tree for PHP Calculator Code</p>
      </div>

      <div className="demo-content">
        <ASTTreePanel
          stage={sampleStage}
          onUpdate={() => {}}
          onSelect={() => {}}
          isActive={true}
        />
      </div>

      <div className="demo-info">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>🎨 Beautiful modern UI with gradients and shadows</li>
          <li>🔍 Interactive node expansion and collapse</li>
          <li>📊 Real-time statistics and metrics</li>
          <li>🎯 Node selection with detailed information</li>
          <li>🔧 Zoom and pan controls</li>
          <li>📱 Responsive design for all screen sizes</li>
          <li>🌙 Dark mode support</li>
          <li>🤖 AI-powered explanations</li>
        </ul>
      </div>
    </div>
  );
}
