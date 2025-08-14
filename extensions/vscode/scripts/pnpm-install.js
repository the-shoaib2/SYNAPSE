/**
 * @file Install node modules for the VS Code extension and ui. This is also intended to run as a child process.
 */

const { fork } = require("child_process");
const path = require("path");

const { execCmdSync } = require("../../../scripts/util");

const { continueDir } = require("./utils");

async function installNodeModulesInUi() {
  process.chdir(path.join(continueDir, "ui"));
  execCmdSync("pnpm install");
  console.log("[info] pnpm install in ui completed");
}

async function installNodeModulesInVscode() {
  process.chdir(path.join(continueDir, "extensions", "vscode"));
  execCmdSync("pnpm install");
  console.log("[info] pnpm install in extensions/vscode completed");
}

process.on("message", (msg) => {
  const { targetDir } = msg.payload;
  if (targetDir === "ui") {
    installNodeModulesInUi()
      .then(() => process.send({ done: true }))
      .catch((error) => {
        console.error(error); // show the error in the parent process
        process.send({ error: true });
      });
  } else if (targetDir === "vscode") {
    installNodeModulesInVscode()
      .then(() => process.send({ done: true }))
      .catch((error) => {
        console.error(error); // show the error in the parent process
        process.send({ error: true });
      });
  }
});

async function npmInstall() {
  const installVscodeChild = fork(__filename, {
    stdio: "inherit",
  });
  installVscodeChild.send({ payload: { targetDir: "vscode" } });

  const installUiChild = fork(__filename, {
    stdio: "inherit",
  });
  installUiChild.send({ payload: { targetDir: "ui" } });

  await Promise.all([
    new Promise((resolve, reject) => {
      installVscodeChild.on("message", (msg) => {
        if (msg.error) {
          reject();
        }
        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      installUiChild.on("message", (msg) => {
        if (msg.error) {
          reject();
        }
        resolve();
      });
    }),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  npmInstall,
};
