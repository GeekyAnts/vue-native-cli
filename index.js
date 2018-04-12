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
  createCrnaProjectSync(projectName, cmd);
  handleAndAddVueNativePackageDependencySync(projectName, cmd);
  setupVueNativeApp(projectName, cmd);
}

function createCrnaProjectSync(projectName, cmd) {
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

function handleAndAddVueNativePackageDependencySync(projectName, cmd) {
  process.chdir(projectName);
  installVueNativeDependency();
  installVueNativeDevDependency();
  process.chdir("..");
}

function installVueNativeDependency() {
  const spinner = ora(
    `Installing ${chalk.green("Vue Native Dependency")} Packages \n`
  ).start();
  const commandObj = getVueNativeDependencyPackageInstallationCommand();
  const crnaProjectCreationResponse = spawnSync(
    commandObj.commandName,
    commandObj.optionsArr
  );
  spinner.succeed(
    `Installed ${chalk.green("Vue Native Dependency")} Packages \n`
  );
}
function installVueNativeDevDependency() {
  const spinner = ora(
    `Installing ${chalk.green("Vue Native Dev-dependency")} Packages`
  ).start();
  const commandObj = getVueNativeDevDependencyPackageInstallationCommand();
  const crnaProjectCreationResponse = spawnSync(
    commandObj.commandName,
    commandObj.optionsArr
  );
  spinner.succeed(
    `Installed ${chalk.green("Vue Native Dev-Dependency")} Packages`
  );
}

function getVueNativeDependencyPackageInstallationCommand() {
  const isYarnPresent = validationObjects.getYarnVersionIfAvailable();
  let vueNativePkgInstallationCommand = null;
  if (isYarnPresent) {
    vueNativePkgInstallationCommand = {
      commandName: "yarn",
      optionsArr: [
        "add",
        `${constantObjects.vueNativePackages.vueNativeCore}`,
        `${constantObjects.vueNativePackages.vueNativeHelper}`,
        "--exact"
      ]
    };
  } else {
    vueNativePkgInstallationCommand = {
      commandName: "npm",
      optionsArr: [
        "install",
        `${constantObjects.vueNativePackages.vueNativeCore}`,
        `${constantObjects.vueNativePackages.vueNativeHelper}`,
        "--save"
      ]
    };
  }
  return vueNativePkgInstallationCommand;
}
function getVueNativeDevDependencyPackageInstallationCommand() {
  const isYarnPresent = validationObjects.getYarnVersionIfAvailable();
  let vueNativePkgInstallationCommand = null;
  if (isYarnPresent) {
    vueNativePkgInstallationCommand = {
      commandName: "yarn",
      optionsArr: [
        "add",
        `${constantObjects.vueNativePackages.vueNativeScripts}`,
        "--exact",
        "--dev"
      ]
    };
  } else {
    vueNativePkgInstallationCommand = {
      commandName: "npm",
      optionsArr: [
        "install",
        `${constantObjects.vueNativePackages.vueNativeScripts}`,
        "--save-dev"
      ]
    };
  }
  return vueNativePkgInstallationCommand;
}

function setupVueNativeApp(projectName, cmd) {
  // process.chdir(projectName);
  const rnCliFile = fs.readFileSync(
    path.resolve(__dirname, "./src/utils/rnCli.config.js")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.rnPkgCliFileName),
    rnCliFile
  );

  const transformFileContent = fs.readFileSync(
    path.resolve(__dirname, "./src/utils/vueTransformerPlugin.js")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.vueTransformerFileName),
    transformFileContent
  );

  process.chdir(projectName);
  spawnSync("mv", ["App.js", "App.vue"]);
  spawnSync("rm", ["App.test.js"]);
  process.chdir("..");

  const appVueFileContent = fs.readFileSync(
    path.resolve(__dirname, "./src/utils/app.vue")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.appVueFileName),
    appVueFileContent
  );
  console.log(
      chalk.green(`Completed Installing Vue Native ${projectName} App`), 
    );
}

function terminateTheProcess(msg) {
  if (msg) {
    console.log(chalk.red(msg));
  } else {
    console.log(chalk.red("Vue Native Project initialization cancelled "));
  }
  process.exit(0);
}
