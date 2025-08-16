import { getSynapseRcPath, getTsConfigPath } from "core/util/paths";
import { Telemetry } from "core/util/posthog";
import * as vscode from "vscode";

import { VsCodeExtension } from "../extension/VsCodeExtension";
import registerQuickFixProvider from "../lang-server/codeActions";
import { getExtensionVersion, isUnsupportedPlatform } from "../util/util";

import { VsCodeSynapseApi } from "./api";
import setupInlineTips from "./InlineTipManager";

export async function activateExtension(context: vscode.ExtensionContext) {
  const platformCheck = isUnsupportedPlatform();
  if (platformCheck.isUnsupported) {
    // const platformTarget = `${getPlatform()}-${getArchitecture()}`;
    const platformTarget = "windows-arm64";

    void vscode.window.showInformationMessage(
      `Synapse detected that you are using ${platformTarget}. Due to native dependencies, Synapse may not be able to start`,
    );

    void Telemetry.capture(
      "unsupported_platform_activation_attempt",
      {
        platform: platformTarget,
        extensionVersion: getExtensionVersion(),
        reason: platformCheck.reason,
      },
      true,
    );
  }

  // Add necessary files
  getTsConfigPath();
  getSynapseRcPath();

  // Register commands and providers
  registerQuickFixProvider();
  setupInlineTips(context);

  const vscodeExtension = new VsCodeExtension(context);

  // Load Synapse configuration
  if (!context.globalState.get("hasBeenInstalled")) {
    void context.globalState.update("hasBeenInstalled", true);
    void Telemetry.capture(
      "install",
      {
        extensionVersion: getExtensionVersion(),
      },
      true,
    );
  }

  // Register config.yaml schema by removing old entries and adding new one (uri.fsPath changes with each version)
  const yamlMatcher = ".synapse/**/*.yaml";
  const yamlConfig = vscode.workspace.getConfiguration("yaml");

  const newPath = vscode.Uri.joinPath(
    context.extension.extensionUri,
    "config-yaml-schema.json",
  ).toString();

  try {
    // Check if YAML extension is available
    const yamlExtension = vscode.extensions.getExtension("redhat.vscode-yaml");
    if (!yamlExtension) {
      console.warn(
        "YAML extension not found. Synapse will work but YAML configuration files won't have schema validation."
      );
      
      // Show a helpful message to the user
      void vscode.window.showInformationMessage(
        "Synapse: YAML extension not found. Install 'redhat.vscode-yaml' for better YAML configuration support.",
        "Install YAML Extension",
        "Dismiss"
      ).then((selection) => {
        if (selection === "Install YAML Extension") {
          void vscode.commands.executeCommand("workbench.extensions.installExtension", "redhat.vscode-yaml");
        }
      });
    } else {
      // Only try to register schema if YAML extension is available
      await yamlConfig.update(
        "schemas",
        { [newPath]: [yamlMatcher] },
        vscode.ConfigurationTarget.Global,
      );
      console.log("Successfully registered Synapse config.yaml schema");
    }
  } catch (error) {
    console.error(
      "Failed to register Synapse config.yaml schema:",
      error,
    );
    
    // Show error to user
    void vscode.window.showErrorMessage(
      `Failed to register YAML schema: ${error instanceof Error ? error.message : String(error)}`,
      "Dismiss"
    );
  }

  const api = new VsCodeSynapseApi(vscodeExtension);
  const synapsePublicApi = {
    registerCustomContextProvider: api.registerCustomContextProvider.bind(api),
  };

  // 'export' public api-surface
  // or entire extension for testing
  return process.env.NODE_ENV === "test"
    ? {
        ...synapsePublicApi,
        extension: vscodeExtension,
      }
    : synapsePublicApi;
}
