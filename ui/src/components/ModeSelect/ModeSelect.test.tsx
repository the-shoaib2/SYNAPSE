import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { vi } from "vitest";
import configReducer from "../../redux/slices/configSlice";
import sessionReducer from "../../redux/slices/sessionSlice";
import { ModeSelect } from "./ModeSelect";

// Mock browser APIs that are not available in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the useMainEditor hook
vi.mock("../mainInput/TipTapEditor", () => ({
  useMainEditor: () => ({
    mainEditor: null,
  }),
}));

// Mock the getMetaKeyLabel utility
vi.mock("../../../util", async () => {
  const actual = await vi.importActual("../../../util");
  return {
    ...actual,
    getMetaKeyLabel: () => "⌘",
    getFontSize: () => 14,
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      session: sessionReducer,
      config: configReducer,
    },
    preloadedState: initialState,
  });
};

describe("ModeSelect", () => {
  const defaultState = {
    session: {
      mode: "chat" as const,
    },
    config: {
      config: {
        tools: [],
        selectedModelByRole: {
          chat: {
            model: "test-model",
            provider: "test-provider",
            capabilities: [],
            underlyingProviderName: "test-provider",
            title: "Test Model",
          },
        },
      },
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("renders all four modes: chat, plan, agent, and canvas", async () => {
    const store = createMockStore(defaultState);

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Click on the dropdown to open it
    const dropdownButton = screen.getByTestId("mode-select-button");
    fireEvent.click(dropdownButton);

    // Wait for the dropdown to open and check that all mode options are rendered
    await vi.waitFor(() => {
      // Look for the dropdown options specifically, not the button text
      const dropdownOptions = screen.getAllByRole("option");
      expect(dropdownOptions).toHaveLength(4);

      // Check that all mode options are in the dropdown
      const optionTexts = dropdownOptions.map((option) => option.textContent);
      // The text content might include hidden elements, so we check if it contains the mode names
      expect(optionTexts.some((text) => text?.includes("Chat"))).toBe(true);
      expect(optionTexts.some((text) => text?.includes("Plan"))).toBe(true);
      expect(optionTexts.some((text) => text?.includes("Agent"))).toBe(true);
      expect(optionTexts.some((text) => text?.includes("Canvas"))).toBe(true);
    });
  });

  it("cycles through modes correctly with keyboard shortcut", async () => {
    const store = createMockStore(defaultState);

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Simulate Cmd/Ctrl + . keypress on the document
    fireEvent.keyDown(document, { key: ".", metaKey: true, bubbles: true });

    // Wait for state update and check
    await vi.waitFor(
      () => {
        const currentMode = store.getState().session.mode;
        // The mode should change from chat to plan
        expect(currentMode).toBe("plan");
      },
      { timeout: 2000 },
    );
  });

  it("displays correct mode in button", async () => {
    const store = createMockStore({
      ...defaultState,
      session: { mode: "canvas" as const },
    });

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Should show "Canvas" in the button
    const button = screen.getByTestId("mode-select-button");
    expect(button).toHaveTextContent("Canvas");
  });

  it("shows tooltip for canvas mode", async () => {
    const store = createMockStore(defaultState);

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Click on the dropdown to open it
    const dropdownButton = screen.getByTestId("mode-select-button");
    fireEvent.click(dropdownButton);

    // Wait for the dropdown to open and check canvas tooltip
    await vi.waitFor(() => {
      // Find the Canvas option in the dropdown
      const canvasOption = screen.getByRole("option", { name: /Canvas/i });
      expect(canvasOption).toBeInTheDocument();

      // Check that it has the tooltip
      const tooltipElement = canvasOption.querySelector(
        '[data-tooltip-id="canvas-tip"]',
      );
      expect(tooltipElement).toBeInTheDocument();
    });
  });

  it("shows correct tooltip text for each mode", async () => {
    const store = createMockStore(defaultState);

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Click on the dropdown to open it
    const dropdownButton = screen.getByTestId("mode-select-button");
    fireEvent.click(dropdownButton);

    // Wait for the dropdown to open and check tooltip content for each mode
    await vi.waitFor(() => {
      // Find each option and check their tooltips
      const chatOption = screen.getByRole("option", { name: /Chat/i });
      const planOption = screen.getByRole("option", { name: /Plan/i });
      const agentOption = screen.getByRole("option", { name: /Agent/i });
      const canvasOption = screen.getByRole("option", { name: /Canvas/i });

      expect(chatOption).toBeInTheDocument();
      expect(planOption).toBeInTheDocument();
      expect(agentOption).toBeInTheDocument();
      expect(canvasOption).toBeInTheDocument();

      // Check tooltips
      expect(
        chatOption.querySelector('[data-tooltip-id="chat-tip"]'),
      ).toBeInTheDocument();
      expect(
        planOption.querySelector('[data-tooltip-id="plan-tip"]'),
      ).toBeInTheDocument();
      expect(
        agentOption.querySelector('[data-tooltip-id="agent-tip"]'),
      ).toBeInTheDocument();
      expect(
        canvasOption.querySelector('[data-tooltip-id="canvas-tip"]'),
      ).toBeInTheDocument();
    });
  });

  it("displays keyboard shortcut hint", async () => {
    const store = createMockStore(defaultState);

    render(
      <Provider store={store}>
        <ModeSelect />
      </Provider>,
    );

    // Click on the dropdown to open it
    const dropdownButton = screen.getByTestId("mode-select-button");
    fireEvent.click(dropdownButton);

    // Look for the hint text in the dropdown - the text is "⌘ . for next mode"
    const hintElement = screen.getByText("⌘ . for next mode");
    expect(hintElement).toBeInTheDocument();
  });
});
