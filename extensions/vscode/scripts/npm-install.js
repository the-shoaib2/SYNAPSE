/**
 * @file Install node modules for the VS Code extension and ui. This is also intended to run as a child process.
 */

const { fork } = require("child_process");
const path = require("path");

const { execCmdSync } = require("../../../scripts/util/index");

function npmInstall() {
  try {
    // Install UI dependencies
    console.log("[info] Installing UI dependencies with npm...");
    execCmdSync("npm install");
    console.log("[info] npm install in ui completed");

    // Install VS Code extension dependencies
    console.log("[info] Installing VS Code extension dependencies with npm...");
    execCmdSync("npm install");
    console.log("[info] npm install in extensions/vscode completed");

    console.log("[info] All npm installs completed successfully");
  } catch (error) {
    console.error("[error] npm install failed:", error.message);
    throw error;
  }
}

module.exports = { npmInstall };
