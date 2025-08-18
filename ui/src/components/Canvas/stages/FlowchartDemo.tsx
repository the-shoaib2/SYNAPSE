import { PipelineStage } from "../types";
import { FlowchartPanel } from "./FlowchartPanel";

// Sample PHP Calculator flowchart data for demonstration
const sampleFlowchartData = {
  type: "start",
  label: "Start Calculator",
  children: [
    {
      type: "input",
      label: "Get User Input",
      data: "Numbers and operation",
      children: [
        {
          type: "decision",
          label: "Validate Input",
          condition: "Is input valid?",
          children: [
            {
              type: "process",
              label: "Process Calculation",
              action: "Perform arithmetic operation",
              children: [
                {
                  type: "decision",
                  label: "Check Division by Zero",
                  condition: "Is divisor zero?",
                  children: [
                    {
                      type: "process",
                      label: "Show Error",
                      action: "Display division by zero error",
                      status: "error",
                      children: [
                        {
                          type: "process",
                          label: "Return to Input",
                          action: "Ask for new input",
                        },
                      ],
                    },
                    {
                      type: "process",
                      label: "Calculate Result",
                      action: "Perform division",
                      status: "completed",
                      children: [
                        {
                          type: "output",
                          label: "Display Result",
                          data: "Show calculated result",
                          children: [
                            {
                              type: "decision",
                              label: "Continue?",
                              condition: "More calculations?",
                              children: [
                                {
                                  type: "process",
                                  label: "Reset Calculator",
                                  action: "Clear result and return to start",
                                },
                                {
                                  type: "end",
                                  label: "End Program",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "process",
              label: "Show Input Error",
              action: "Display validation error message",
              status: "error",
              children: [
                {
                  type: "process",
                  label: "Return to Input",
                  action: "Ask for new input",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Sample pipeline stage for the flowchart visualization
const sampleStage: PipelineStage = {
  id: "flowchart_visualization_demo",
  stage: "PHP Calculator Flowchart",
  type: "visualize",
  engine: "tool:flowchart-generator",
  inputs: ["php_calculator_code"],
  outputs: ["flowchart_visualization"],
  editable: false,
  visualType: "flowchart",
  payload: {
    visual: sampleFlowchartData,
    explain:
      "This flowchart shows the complete execution flow of the PHP Calculator program, including input validation, calculation logic, error handling, and user interaction loops. The diamond shapes represent decision points, rectangles represent processes, and ovals represent start/end points.",
  },
  explanation:
    "This flowchart shows the complete execution flow of the PHP Calculator program, including input validation, calculation logic, error handling, and user interaction loops. The diamond shapes represent decision points, rectangles represent processes, and ovals represent start/end points.",
};

export function FlowchartDemo() {
  return (
    <div className="flowchart-demo-container">
      <div className="demo-header">
        <h2>📊 Flowchart Visualization Demo</h2>
        <p>Interactive Flowchart for PHP Calculator Code</p>
      </div>

      <div className="demo-content">
        <FlowchartPanel
          stage={sampleStage}
          onUpdate={() => {}}
          onSelect={() => {}}
          isActive={true}
        />
      </div>

      <div className="demo-info">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>
            🎯 <strong>Custom Node Types:</strong> Start/End (ovals), Decision
            (diamonds), Process (rectangles), Input/Output (parallelograms)
          </li>
          <li>
            🔗 <strong>Smart Edge Connections:</strong> Automatic edge creation
            with smooth curves and labels
          </li>
          <li>
            🎨 <strong>Visual Hierarchy:</strong> Color-coded nodes by type with
            gradient backgrounds
          </li>
          <li>
            📱 <strong>Interactive Controls:</strong> Zoom, pan, fit view, and
            node selection
          </li>
          <li>
            📊 <strong>MiniMap Navigation:</strong> Overview of entire flowchart
            structure
          </li>
          <li>
            🔍 <strong>Selection Details:</strong> Detailed information panel
            for selected nodes and edges
          </li>
          <li>
            📈 <strong>Statistics Display:</strong> Real-time counts of nodes,
            edges, and types
          </li>
          <li>
            🌙 <strong>Dark Mode Support:</strong> Automatic theme adaptation
          </li>
          <li>
            📱 <strong>Responsive Design:</strong> Mobile-optimized layout and
            controls
          </li>
          <li>
            ⚡ <strong>Performance:</strong> Smooth animations and real-time
            updates
          </li>
        </ul>

        <h3>Flowchart Structure:</h3>
        <ul>
          <li>
            <strong>Start:</strong> Program initialization
          </li>
          <li>
            <strong>Input:</strong> User input collection and validation
          </li>
          <li>
            <strong>Decision:</strong> Input validation and error checking
          </li>
          <li>
            <strong>Process:</strong> Calculation execution and error handling
          </li>
          <li>
            <strong>Output:</strong> Result display and user interaction
          </li>
          <li>
            <strong>End:</strong> Program termination
          </li>
        </ul>

        <h3>Technical Implementation:</h3>
        <ul>
          <li>
            <strong>React Flow Library:</strong> Professional flowchart
            rendering engine
          </li>
          <li>
            <strong>Custom Node Types:</strong> Tailored visual representations
            for different flowchart elements
          </li>
          <li>
            <strong>State Management:</strong> React hooks for interactive
            functionality
          </li>
          <li>
            <strong>CSS Grid & Flexbox:</strong> Modern layout system for
            responsive design
          </li>
          <li>
            <strong>TypeScript:</strong> Full type safety and IntelliSense
            support
          </li>
        </ul>
      </div>
    </div>
  );
}
