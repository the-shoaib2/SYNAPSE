import { expect } from "chai";
import {
  By,
  EditorView,
  Key,
  VSBrowser,
  WebDriver,
  WebElement,
  WebView,
  until,
} from "vscode-extension-tester";

import { GlobalActions } from "../actions/Global.actions";
import { UIActions } from "../actions/UI.actions";
import { DEFAULT_TIMEOUT } from "../constants";
import { UISelectors } from "../selectors/UI.selectors";
import { TestUtils } from "../TestUtils";

describe("UI Test", () => {
  let view: WebView;
  let driver: WebDriver;

  before(async function () {
    this.timeout(DEFAULT_TIMEOUT.XL);
    // Uncomment this line for faster testing
    await UIActions.moveContinueToSidebar(VSBrowser.instance.driver);
    await GlobalActions.openTestWorkspace();
    await GlobalActions.clearAllNotifications();
  });

  beforeEach(async function () {
    this.timeout(DEFAULT_TIMEOUT.XL);

    await UIActions.toggleUi();

    ({ view, driver } = await UIActions.switchToReactIframe());
    await UIActions.selectModelFromDropdown(view, "TEST LLM");
  });

  afterEach(async function () {
    this.timeout(DEFAULT_TIMEOUT.XL);

    await view.switchBack();
    await TestUtils.waitForSuccess(
      async () => (await UISelectors.getContinueExtensionBadge(view)).click(),
      DEFAULT_TIMEOUT.XS,
    );
    await new EditorView().closeAllEditors();
  });

  describe("Onboarding", () => {
    it.skip("should display correct panel description", async () => {
      const description = await UISelectors.getDescription(view);

      expect(await description.getText()).has.string(
        "Log in to quickly build your first custom AI code assistant",
      );
    }).timeout(DEFAULT_TIMEOUT.XL);

    // We no longer have a quick start button
    it.skip(
      "should display tutorial card after accepting onboarding quick start",
      async () => {
        // Get paragraph with text Best
        const bestTab = await UISelectors.getOnboardingTabButton(view, "Best");
        await bestTab.click();

        const anthropicInput = await TestUtils.waitForSuccess(
          async () => await UISelectors.getBestChatApiKeyInput(view),
        );
        anthropicInput.sendKeys("invalid_api_key");

        const mistralInput =
          await UISelectors.getBestAutocompleteApiKeyInput(view);
        mistralInput.sendKeys("invalid_api_key");

        // Get button with text "Connect" and click it
        const connectButton = await view.findWebElement(
          By.xpath("//button[text()='Connect']"),
        );
        await connectButton.click();

        await TestUtils.waitForSuccess(
          async () => await UISelectors.getTutorialCard(view),
        );

        // TODO validate that claude has been added to list

        // Skip testing Quick Start because github auth opens external app and breaks test
        // const quickStartButton = await view.findWebElement(
        //   By.xpath("//*[contains(text(), 'Get started using our API keys')]")
        // );
        // await quickStartButton.click();
        // await view.switchBack();
        // const allowButton = await TestUtils.waitForSuccess(
        //   async () => await driver.findElement(By.xpath(`//a[contains(text(), "Allow")]`))
        // );
        // await allowButton.click();
        // ({ view, driver } = await UIActions.switchToReactIframe());
      },
    ).timeout(DEFAULT_TIMEOUT.XL);
  });

  describe("Chat", () => {
    it("Can submit message by pressing enter", async () => {
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      const messagePair = TestUtils.generateTestMessagePair();
      await messageInput.sendKeys(messagePair.userMessage);
      await messageInput.sendKeys(Key.ENTER);
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, messagePair.llmResponse),
      );
    });

    it("Can submit message by button click", async () => {
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      const messagePair = TestUtils.generateTestMessagePair();
      await messageInput.sendKeys(messagePair.userMessage);
      (await UISelectors.getSubmitInputButton(view)).click();
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, messagePair.llmResponse),
      );
    });

    it("Can delete messages", async () => {
      const { userMessage: userMessage0, llmResponse: llmResponse0 } =
        TestUtils.generateTestMessagePair(0);
      await UIActions.sendMessage({
        view,
        message: userMessage0,
        inputFieldIndex: 0,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse0),
      );

      const { userMessage: userMessage1, llmResponse: llmResponse1 } =
        TestUtils.generateTestMessagePair(1);
      await UIActions.sendMessage({
        view,
        message: userMessage1,
        inputFieldIndex: 1,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse1),
      );

      const { userMessage: userMessage2, llmResponse: llmResponse2 } =
        TestUtils.generateTestMessagePair(2);
      await UIActions.sendMessage({
        view,
        message: userMessage2,
        inputFieldIndex: 2,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse2),
      );

      // Delete the first assistant response (index 1) - this deletes both user msg 0 and assistant response 0
      await (await UISelectors.getNthMessageDeleteButton(view, 1)).click();
      await TestUtils.expectNoElement(() =>
        UISelectors.getThreadMessageByText(view, llmResponse0),
      );

      // Delete the second assistant response (now at index 1) - this deletes both user msg 1 and assistant response 1
      await (await UISelectors.getNthMessageDeleteButton(view, 1)).click();
      await TestUtils.expectNoElement(() =>
        UISelectors.getThreadMessageByText(view, llmResponse1),
      );

      // Delete the third assistant response (now at index 1) - this deletes both user msg 2 and assistant response 2
      await (await UISelectors.getNthMessageDeleteButton(view, 1)).click();
      await TestUtils.expectNoElement(() =>
        UISelectors.getThreadMessageByText(view, llmResponse2),
      );
    }).timeout(DEFAULT_TIMEOUT.XL);

    it("Can edit messages", async () => {
      const { userMessage: userMessage0, llmResponse: llmResponse0 } =
        TestUtils.generateTestMessagePair(0);
      await UIActions.sendMessage({
        view,
        message: userMessage0,
        inputFieldIndex: 0,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse0),
      );

      const { userMessage: userMessage1, llmResponse: llmResponse1 } =
        TestUtils.generateTestMessagePair(1);
      await UIActions.sendMessage({
        view,
        message: userMessage1,
        inputFieldIndex: 1,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse1),
      );

      const { userMessage: userMessage2, llmResponse: llmResponse2 } =
        TestUtils.generateTestMessagePair(2);
      await UIActions.sendMessage({
        view,
        message: userMessage2,
        inputFieldIndex: 2,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse2),
      );

      const secondInputField = await UISelectors.getMessageInputFieldAtIndex(
        view,
        1,
      );
      await secondInputField.clear();

      const { userMessage: userMessage3, llmResponse: llmResponse3 } =
        TestUtils.generateTestMessagePair(3);

      await UIActions.sendMessage({
        view,
        message: userMessage3,
        inputFieldIndex: 1,
      });
      await UISelectors.getThreadMessageByText(view, llmResponse0);

      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse3),
      );
      await Promise.all([
        TestUtils.expectNoElement(() =>
          UISelectors.getThreadMessageByText(view, llmResponse1),
        ),
        TestUtils.expectNoElement(() =>
          UISelectors.getThreadMessageByText(view, llmResponse2),
        ),
      ]);
    }).timeout(DEFAULT_TIMEOUT.XL);
  });

  describe("Agent with tools", () => {
    beforeEach(async () => {
      await UIActions.selectModelFromDropdown(view, "TOOL MOCK LLM");
      await UIActions.selectModeFromDropdown(view, "Agent");
    });

    it("should display rules peek and show rule details", async () => {
      // Send a message to trigger the model response
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("Hello");
      await messageInput.sendKeys(Key.ENTER);

      // Wait for the response to appear
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, "I'm going to call a tool:"),
      );

      // Verify that "1 rule" text appears
      const rulesPeek = await TestUtils.waitForSuccess(() =>
        UISelectors.getRulesPeek(view),
      );
      const rulesPeekText = await rulesPeek.getText();
      expect(rulesPeekText).to.include("1 rule");

      // Click on the rules peek to expand it
      await rulesPeek.click();

      // Wait for the rule details to appear
      const ruleItem = await TestUtils.waitForSuccess(() =>
        UISelectors.getFirstRulesPeekItem(view),
      );

      await TestUtils.waitForSuccess(async () => {
        const text = await ruleItem.getText();
        if (!text || text.trim() === "") {
          throw new Error("Rule item text is empty");
        }
        return ruleItem;
      });

      // Verify the rule content
      const ruleItemText = await ruleItem.getText();
      expect(ruleItemText).to.include("Assistant rule");
      expect(ruleItemText).to.include("Always applied");
      expect(ruleItemText).to.include("TEST_SYS_MSG");
    }).timeout(DEFAULT_TIMEOUT.MD);

    it("should render tool call", async () => {
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("Hello");
      await messageInput.sendKeys(Key.ENTER);

      const statusMessage = await TestUtils.waitForSuccess(
        () => UISelectors.getToolCallStatusMessage(view), // Defined in extensions/vscode/e2e/test-synapse/config.json's TOOL MOCK LLM that we are calling the exact search tool
        DEFAULT_TIMEOUT.SM,
      );

      expect(await statusMessage.getText()).contain(
        "Synapse viewed the git diff",
      );
    }).timeout(DEFAULT_TIMEOUT.MD * 100);

    it("should call tool after approval", async () => {
      await UIActions.toggleToolPolicy(view, "view_diff", 2);

      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("Hello");
      await messageInput.sendKeys(Key.ENTER);

      const acceptToolCallButton = await TestUtils.waitForSuccess(() =>
        UISelectors.getAcceptToolCallButton(view),
      );
      await acceptToolCallButton.click();

      const statusMessage = await TestUtils.waitForSuccess(
        () => UISelectors.getToolCallStatusMessage(view), // Defined in extensions/vscode/e2e/test-synapse/config.json's TOOL MOCK LLM that we are calling the exact search tool
        DEFAULT_TIMEOUT.SM,
      );

      const text = await statusMessage.getText();
      expect(text).contain("the git diff");
    }).timeout(DEFAULT_TIMEOUT.XL);

    it("should cancel tool", async () => {
      await UIActions.toggleToolPolicy(view, "view_diff", 2);

      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("Hello");
      await messageInput.sendKeys(Key.ENTER);

      const cancelToolCallButton = await TestUtils.waitForSuccess(() =>
        UISelectors.getRejectToolCallButton(view),
      );
      await cancelToolCallButton.click();

      const statusMessage = await TestUtils.waitForSuccess(
        () => UISelectors.getToolCallStatusMessage(view), // Defined in extensions/vscode/e2e/test-synapse/config.json's TOOL MOCK LLM that we are calling the exact search tool
        DEFAULT_TIMEOUT.SM,
      );

      const text = await statusMessage.getText();
      expect(text).contain("Synapse tried to view the git diff");
    }).timeout(DEFAULT_TIMEOUT.XL);
  });

  describe("Context providers", () => {
    it("should successfully use the terminal context provider", async () => {
      await UIActions.selectModelFromDropdown(view, "LAST MESSAGE MOCK LLM");

      // Enter just the context provider in the input and send
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("@");
      await messageInput.sendKeys("terminal");
      await messageInput.sendKeys(Key.ENTER);
      await messageInput.sendKeys(Key.ENTER);

      // Check that the contents match what we expect (repeated back by the mock LLM)
      await TestUtils.waitForSuccess(() => {
        return UISelectors.getThreadMessageByText(
          view,
          "Current terminal contents:",
        );
      });
    }).timeout(DEFAULT_TIMEOUT.MD);
  });

  describe("should repeat back the system message", () => {
    it("should repeat back the system message", async () => {
      await UIActions.selectModeFromDropdown(view, "Chat");
      await UIActions.selectModelFromDropdown(view, "SYSTEM MESSAGE MOCK LLM");
      const [messageInput] = await UISelectors.getMessageInputFields(view);
      await messageInput.sendKeys("Hello");
      await messageInput.sendKeys(Key.ENTER);
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, "TEST_SYS_MSG"),
      );
    }).timeout(DEFAULT_TIMEOUT.XL * 1000);
  });

  describe("Chat Paths", () => {
    it("Send many messages → chat auto scrolls → go to history → open previous chat → it is scrolled to the bottom", async () => {
      for (let i = 0; i <= 20; i++) {
        const { userMessage, llmResponse } =
          TestUtils.generateTestMessagePair(i);
        await UIActions.sendMessage({
          view,
          message: userMessage,
          inputFieldIndex: i,
        });
        const response = await TestUtils.waitForSuccess(() =>
          UISelectors.getThreadMessageByText(view, llmResponse),
        );

        const viewportHeight = await driver.executeScript(
          "return window.innerHeight",
        );

        const isInViewport = await driver.executeScript(
          `
          const rect = arguments[0].getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.bottom <= ${viewportHeight}
          );
          `,
          response,
        );

        expect(isInViewport).to.eq(true);
      }

      await view.switchBack();

      await (await UISelectors.getHistoryNavButton(view)).click();
      await UIActions.switchToReactIframe();
      TestUtils.waitForSuccess(async () => {
        await (await UISelectors.getNthHistoryTableRow(view, 0)).click();
      });

      const { llmResponse } = TestUtils.generateTestMessagePair(20);
      const response = await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, llmResponse),
      );

      const viewportHeight = await driver.executeScript(
        "return window.innerHeight",
      );

      const isInViewport = await driver.executeScript(
        `
        const rect = arguments[0].getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.bottom <= ${viewportHeight}
        );
        `,
        response,
      );

      expect(isInViewport).to.eq(true);
    }).timeout(DEFAULT_TIMEOUT.XL * 1000);

    it("Open chat and send message → press arrow up and arrow down to cycle through messages → submit another message → press arrow up and arrow down to cycle through messages", async () => {
      await UIActions.sendMessage({
        view,
        message: "MESSAGE 1",
        inputFieldIndex: 0,
      });

      const input1 = await TestUtils.waitForSuccess(async () => {
        return UISelectors.getMessageInputFieldAtIndex(view, 1);
      });
      expect(await input1.getText()).to.equal("");

      await input1.sendKeys(Key.ARROW_UP);
      await driver.wait(
        until.elementTextIs(input1, "MESSAGE 1"),
        DEFAULT_TIMEOUT.SM,
      );

      await input1.sendKeys(Key.ARROW_DOWN); // First press - bring caret to the end of the message
      await input1.sendKeys(Key.ARROW_DOWN); // Second press - trigger message change
      await driver.wait(until.elementTextIs(input1, ""), DEFAULT_TIMEOUT.SM);

      await UIActions.sendMessage({
        view,
        message: "MESSAGE 2",
        inputFieldIndex: 1,
      });

      const input2 = await TestUtils.waitForSuccess(async () => {
        return UISelectors.getMessageInputFieldAtIndex(view, 2);
      });
      expect(await input2.getText()).to.equal("");

      await input2.sendKeys(Key.ARROW_UP);
      await driver.wait(
        until.elementTextIs(input2, "MESSAGE 2"),
        DEFAULT_TIMEOUT.SM,
      );

      await input2.sendKeys(Key.ARROW_UP);
      await driver.wait(
        until.elementTextIs(input2, "MESSAGE 1"),
        DEFAULT_TIMEOUT.SM,
      );

      await input2.sendKeys(Key.ARROW_DOWN); // First press - bring caret to the end of the message
      await input2.sendKeys(Key.ARROW_DOWN); // Second press - trigger message change
      await driver.wait(
        until.elementTextIs(input2, "MESSAGE 2"),
        DEFAULT_TIMEOUT.SM,
      );

      await input2.sendKeys(Key.ARROW_DOWN);
      await driver.wait(until.elementTextIs(input2, ""), DEFAULT_TIMEOUT.SM);
    }).timeout(DEFAULT_TIMEOUT.XL);

    it("Open chat and type → open history → press new session button → chat opens, empty and in focus", async () => {
      const originalTextInput = await UISelectors.getMessageInputFieldAtIndex(
        view,
        0,
      );
      await originalTextInput.click();
      await originalTextInput.sendKeys("Hello");
      expect(await originalTextInput.getText()).to.equal("Hello");

      await view.switchBack();

      await (await UISelectors.getHistoryNavButton(view)).click();
      await UIActions.switchToReactIframe();

      await view.switchBack();
      await (await UISelectors.getNewSessionNavButton(view)).click();
      await UIActions.switchToReactIframe();

      const newTextInput = await TestUtils.waitForSuccess(() =>
        UISelectors.getMessageInputFieldAtIndex(view, 0),
      );
      const activeElement: WebElement = await driver.switchTo().activeElement();
      const newTextInputHtml = await newTextInput.getAttribute("outerHTML");
      const activeElementHtml = await activeElement.getAttribute("outerHTML");
      expect(newTextInputHtml).to.equal(activeElementHtml);

      const textInputValue = await newTextInput.getText();
      expect(textInputValue).to.equal("");
    }).timeout(DEFAULT_TIMEOUT.XL);

    it("chat → history → chat", async () => {
      const messagePair1 = TestUtils.generateTestMessagePair(1);
      await UIActions.sendMessage({
        view,
        message: messagePair1.userMessage,
        inputFieldIndex: 0,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, messagePair1.llmResponse),
      );

      const messagePair2 = TestUtils.generateTestMessagePair(2);
      await UIActions.sendMessage({
        view,
        message: messagePair2.userMessage,
        inputFieldIndex: 1,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, messagePair2.llmResponse),
      );

      /**
       * SWITCHING BACK AND FORTH
       * We are switching back and forth here because the history is broken.
       * It only updates once a another chat is opened, so we need to open a
       * different chat first.
       */
      await view.switchBack();
      await (await UISelectors.getHistoryNavButton(view)).click();
      await UIActions.switchToReactIframe();

      await (await UISelectors.getNthHistoryTableRow(view, 0)).click();

      await view.switchBack();
      await (await UISelectors.getHistoryNavButton(view)).click();
      /**
       * END OF SWITCHING BACK AND FORTH
       */

      await UIActions.switchToReactIframe();
      await (await UISelectors.getNthHistoryTableRow(view, 0)).click();

      await UISelectors.getThreadMessageByText(view, messagePair1.llmResponse);
      await UISelectors.getThreadMessageByText(view, messagePair2.llmResponse);

      const messagePair3 = TestUtils.generateTestMessagePair(3);
      await UIActions.sendMessage({
        view,
        message: messagePair3.userMessage,
        inputFieldIndex: 2,
      });
      await TestUtils.waitForSuccess(() =>
        UISelectors.getThreadMessageByText(view, messagePair3.llmResponse),
      );
    }).timeout(DEFAULT_TIMEOUT.XL);
  });
});
