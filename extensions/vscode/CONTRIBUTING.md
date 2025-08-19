# Synapse VS Code Extension

This is the Synapse VS Code Extension. Its primary jobs are

1. Implement the IDE side of the Synapse IDE protocol, allowing a Synapse server to interact natively in an IDE. This happens in `src/continueIdeClient.ts`.
2. Open the Synapse React app in a side panel. The React app's source code lives in the `ui` directory. The panel is opened by the `synapse.openContinueUI` command, as defined in `src/commands.ts`.

# How to run the extension

See [Environment Setup](../../CONTRIBUTING.md#environment-setup)

# How to run and debug tests

After following the setup in [Environment Setup](../../CONTRIBUTING.md#environment-setup) you can run the `Extension (VSCode)` launch configuration in VS Code.
