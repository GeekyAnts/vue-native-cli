#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
var exec = require("child_process").exec;
const spawnSync = require("child_process").spawnSync;
var minimist = require("minimist");
var program = require("commander");
var prompt = require("prompt");
const semver = require("semver");
const ora = require("ora");
const promptModule = require("./src/prompt/index");
const constantObjects = require("./src/utils/constants");
const validationObjects = require("./src/utils/validation");
var projectPackageJson = require("./package.json");

const commandLineOptions = minimist(process.argv.slice(2));

program.version(projectPackageJson.version, "-v, --version");

program.command("init <projectName>").action(function(projectName, cmd) {
  const isCrnaInstalledPackageVersion = validationObjects.getCrnaVersionIfAvailable();
  const isProjectNameValidResponse = validationObjects.isProjectNameValid(
    projectName
  );
  // check if Create-react-native-app dependency is present or not
  if (!isCrnaInstalledPackageVersion) {
    terminateTheProcess(
      "Please globally install create-react-native-app dependency"
    );
    return;
  } else {
    console.log(
      "Installed Crna Version",
      chalk.green(isCrnaInstalledPackageVersion)
    );
  }
  // if project Name is invalid Ask User, Do They Want to Continue
  if (!isProjectNameValidResponse) {
    promptModule.promptForInvalidProjectName(
      prompt,
      init,
      terminateTheProcess,
      projectName,
      cmd
    );
  } else {
    init(projectName, cmd);
  }
});

program.parse(process.argv);

function init(projectName, cmd) {
  if (fs.existsSync(projectName)) {
    promptModule.createVueProjectAfterConfirmation(
      prompt,
      createVueNativeProject,
      terminateTheProcess,
      projectName,
      cmd
    );
  } else {
    createVueNativeProject(projectName, cmd);
  }
}

function createVueNativeProject(projectName, cmd) {
  var root = path.resolve(projectName);
  if (fs.existsSync(projectName)) {
    removeExistingDirectory(projectName);
  }
  console.log(chalk.green(`Creating Vue-Native ${projectName} App`));
  createCrnaProject(projectName, cmd);
}

function createCrnaProject(projectName, cmd) {
  const spinner = ora(
    `Creating Crna ${chalk.green(projectName)} project \n`
  ).start();
  const crnaProjectCreationResponse = spawnSync(
    constantObjects.crnaPackageName,
    [projectName],
    { stdio: "inherit" }
  );
  spinner.succeed(`Create Crna ${chalk.green(projectName)} project`);
}

function removeExistingDirectory(directoryName) {
  const spinner = ora(
    `Removing ${chalk.green(directoryName)} project \n`
  ).start();
  const crnaProjectCreationResponse = spawnSync("rm", ["-fr", directoryName], {
    stdio: "inherit"
  });
  spinner.succeed(`Removed ${chalk.green(directoryName)} project`);
}

function terminateTheProcess(msg) {
  if (msg) {
    console.log(chalk.red(msg));
  } else {
    console.log(chalk.red("Vue Native Project initialization cancelled "));
  }
  process.exit(0);
}
