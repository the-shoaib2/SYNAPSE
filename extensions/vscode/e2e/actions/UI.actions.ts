import {
  InputBox,
  Key,
  WebDriver,
  WebElement,
  WebView,
  Workbench,
} from "vscode-extension-tester";

import { DEFAULT_TIMEOUT } from "../constants";
import { UISelectors } from "../selectors/UI.selectors";
import { TestUtils } from "../TestUtils";

export class UIActions {
  public static moveContinueToSidebar = async (driver: WebDriver) => {
    await UIActions.toggleUi();
    await TestUtils.waitForSuccess(async () => {
      await new Workbench().executeCommand("View: Move View");
      await (
        await InputBox.create(DEFAULT_TIMEOUT.MD)
      ).selectQuickPick("Synapse");
      await (
        await InputBox.create(DEFAULT_TIMEOUT.MD)
      ).selectQuickPick("New Secondary Side Bar Entry");
    });

    // first call focuses the input
    await TestUtils.waitForTimeout(DEFAULT_TIMEOUT.XS);
    await UIActions.executeFocusContinueInputShortcut(driver);

    // second call closes the ui
    await TestUtils.waitForTimeout(DEFAULT_TIMEOUT.XS);
    await UIActions.executeFocusContinueInputShortcut(driver);
  };

  public static switchToReactIframe = async () => {
    const view = new WebView();
    const driver = view.getDriver();

    const iframes = await UISelectors.getAllIframes(driver);
    let continueIFrame: WebElement | undefined = undefined;
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      const src = await iframe.getAttribute("src");
              if (src.includes("extensionId=Synapse.synapse")) {
        continueIFrame = iframe;
        break;
      }
    }

    if (!continueIFrame) {
      throw new Error("Could not find Synapse iframe");
    }

    await driver.switchTo().frame(continueIFrame);

    await new Promise((res) => {
      setTimeout(res, 500);
    });

    const reactIFrame = await UISelectors.getReactIframe(driver);

    if (!reactIFrame) {
      throw new Error("Could not find React iframe");
    }

    await driver.switchTo().frame(reactIFrame);
    return {
      view,
      driver,
    };
  };

  public static toggleUi = async () => {
    return TestUtils.waitForSuccess(() =>
      new Workbench().executeCommand("synapse.focusContinueInput"),
    );
  };

  public static selectModelFromDropdown = async (
    view: WebView,
    option: string,
  ) => {
    const dropdownButton = await UISelectors.getModelDropdownButton(view);
    await dropdownButton.click();

    const dropdownOption = await TestUtils.waitForSuccess(() => {
      return UISelectors.getModelDropdownOption(view, option);
    });

    await dropdownOption.click();
  };

  public static selectModeFromDropdown = async (
    view: WebView,
    option: string,
  ) => {
    const dropdownButton = await UISelectors.getModelDropdownButton(view);
    await dropdownButton.click();

    const dropdownOption = await TestUtils.waitForSuccess(() => {
      return UISelectors.getModeDropdownOption(view, option);
    });

    await dropdownOption.click();
  };

  public static async sendMessage({
    view,
    message,
    inputFieldIndex,
  }: {
    view: WebView;
    message: string;
    inputFieldIndex: number;
  }) {
    const editor = await UISelectors.getMessageInputFieldAtIndex(
      view,
      inputFieldIndex,
    );
    await editor.sendKeys(message);
    await editor.sendKeys(Key.ENTER);
  }

  public static async executeFocusContinueInputShortcut(driver: WebDriver) {
    return driver
      .actions()
      .keyDown(TestUtils.osControlKey)
      .sendKeys("l")
      .keyUp(TestUtils.osControlKey)
      .perform();
  }

  public static async toggleToolPolicy(
    view: WebView,
    toolName: string,
    n: number,
  ) {
    const toolButton = await TestUtils.waitForSuccess(() =>
      UISelectors.getToolButton(view),
    );
    await toolButton.click();
    const toolPolicyButton = await TestUtils.waitForSuccess(() =>
      UISelectors.getToolPolicyButton(view, toolName),
    );
    await TestUtils.waitForTimeout(500);

    // Enabled -> Excluded -> Ask first
    for (let i = 0; i < n; i++) {
      await TestUtils.waitForSuccess(() => toolPolicyButton.click());
    }
  }
}
