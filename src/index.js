#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const spawnSync = require("child_process").spawnSync;
const program = require("commander");
const prompt = require("prompt");
const ora = require("ora");

const promptModule = require("./prompt/index");
const constantObjects = require("./utils/constants");
const validationObjects = require("./utils/validation");
const projectPackageJson = require("../package.json");

program.version(projectPackageJson.version, "-v, --version");

program
  .command("init <projectName>")
  // .command("init <projectName>", "create a Vue-Native project")
  .option("--no-crna", "use react-native-cli instead of expo-cli")
  .action(function (projectName, cmd) {
    let isCrnaProject = false;
    if (cmd.crna) {
      isCrnaProject = true;
      const isCrnaInstalledPackageVersion = validationObjects.getCrnaVersionIfAvailable();
      // check if Create-react-native-app dependency is present or not
      if (!isCrnaInstalledPackageVersion) {
        terminateTheProcess(
          "Please globally install expo-cli"
        );
        return;
      } else {
        console.log(
          chalk.cyan("Using globally installed expo-cli " + isCrnaInstalledPackageVersion + "\n"),
        );
      }
    } else {
      const reactNativeCLIVersion = validationObjects.getReactNativeCLIifAvailable();
      if (!reactNativeCLIVersion) {
        terminateTheProcess(
          "Please globally install react-native-cli"
        );
        return;
      } else {
        console.log(
          chalk.cyan("Using globally installed react-native-cli " + reactNativeCLIVersion + "\n"),
        );
      }
    }

    const isProjectNameValidResponse = validationObjects.isProjectNameValid(
      projectName,
      isCrnaProject
    );

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
      init(projectName, cmd, cmd.crna);
    }
  });

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp();
    console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}

function init(projectName, cmd, crna) {
  const createProject = crna
    ? createExpoProject
    : createReactNativeCLIProject;

  if (fs.existsSync(projectName)) {
    promptModule.createVueProjectAfterConfirmation(
      prompt,
      createProject,
      terminateTheProcess,
      projectName,
      cmd
    );
  } else {
    createProject(projectName, cmd);
  }
}

function createReactNativeCLIProject(projectName, cmd) {
  const root = path.resolve(projectName);
  if (fs.existsSync(projectName)) {
    removeExistingDirectory(projectName);
  }
  console.log(chalk.green(`Creating Vue Native project ${chalk.bold(projectName)}`));
  createRNProjectSync(projectName, cmd);
  handleAndAddVueNativePackageDependencySync(projectName, cmd);
  setupVueNativeApp(projectName, cmd);
}

function createExpoProject(projectName, cmd) {
  const root = path.resolve(projectName);
  if (fs.existsSync(projectName)) {
    removeExistingDirectory(projectName);
  }
  console.log(chalk.green(`Creating Vue Native project ${chalk.bold(projectName)}\n`));
  createCrnaProjectSync(projectName, cmd);
  handleAndAddVueNativePackageDependencySync(projectName, cmd);
  setupVueNativeApp(projectName, cmd, true);
}

function createCrnaProjectSync(projectName, cmd) {
  const spinner = ora(
    chalk.cyan("Creating project with expo-cli\n"),
  ).start();
  const crnaProjectCreationResponse = spawnSync(
    constantObjects.crnaPackageName,
    ['init', '--template=blank', projectName],
    { stdio: "inherit", shell: true }
  );
  spinner.succeed(
    chalk.green("Created project with expo-cli\n"),
  );
}

function createRNProjectSync(projectName, cmd) {
  const spinner = ora(
    chalk.cyan("Creating project with react-native-cli\n"),
  ).start();
  const rnProjectCreationResponse = spawnSync(
    constantObjects.rnPackageName,
    ["init", projectName, "--version", constantObjects.stableRNVersion],
    { stdio: "inherit", shell: true }
  );
  spinner.succeed(
    chalk.green("Created project with react-native-cli\n"),
  );
}

function removeExistingDirectory(directoryName) {
  const spinner = ora(
    chalk.yellow(`Removing pre-existing directory with name ${directoryName}\n`),
  ).start();
  const crnaProjectCreationResponse = spawnSync("rm", ["-fr", directoryName], {
    stdio: "inherit"
  });
  spinner.succeed(
    chalk.yellow(`Removed pre-existing directory with name ${directoryName}\n`),
  );
}

function handleAndAddVueNativePackageDependencySync(projectName, cmd) {
  process.chdir(projectName);
  installVueNativeDependency();
  installVueNativeDevDependency();
  process.chdir("..");
}

function installVueNativeDependency() {
  const spinner = ora(
    chalk.cyan("Installing Vue Native dependencies\n"),
  ).start();
  const commandObj = getVueNativeDependencyPackageInstallationCommand();
  const crnaProjectCreationResponse = spawnSync(
    commandObj.commandName,
    commandObj.optionsArr,
    { shell: true, stdio: "inherit" }
  );
  spinner.succeed(
    chalk.green("Installed Vue Native dependencies\n")
  );
}
function installVueNativeDevDependency() {
  const spinner = ora(
    chalk.cyan("Installing Vue Native devDependencies\n"),
  ).start();
  const commandObj = getVueNativeDevDependencyPackageInstallationCommand();
  const crnaProjectCreationResponse = spawnSync(
    commandObj.commandName,
    commandObj.optionsArr,
    { shell: true, stdio: "inherit" }
  );
  spinner.succeed(
    chalk.green("Installed Vue-Native devDependencies\n"),
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
        '@babel/core@^7.0.0-0',
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
        '@babel/core@^7.0.0-0',
        "--save-dev"
      ]
    };
  }
  return vueNativePkgInstallationCommand;
}

function setupVueNativeApp(projectName, cmd, isCrna = false) {
  // process.chdir(projectName);
  const rnCliFile = fs.readFileSync(
    path.resolve(__dirname, "./utils/metro.config.js")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.metroConfigFile),
    rnCliFile
  );

  const transformFileContent = fs.readFileSync(
    path.resolve(__dirname, "./utils/vueTransformerPlugin.js")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.vueTransformerFileName),
    transformFileContent
  );

  process.chdir(projectName);
  spawnSync("mv", ["App.js", "App.vue"]);
  spawnSync("rm", ["App.test.js"]);
  // If created through crna
  //
  if (isCrna) {
    const expoObj = JSON.parse(fs.readFileSync(path.join(constantObjects.appJsonPath), 'utf8'));
    expoObj.expo.packagerOpts = { config: 'metro.config.js' };
    fs.writeFileSync(
      path.join(constantObjects.appJsonPath),
      JSON.stringify(expoObj, null, 2)
    );
  }
  process.chdir("..");

  const appVueFileContent = fs.readFileSync(
    path.resolve(__dirname, "./utils/app.vue")
  );
  fs.writeFileSync(
    path.join(projectName, constantObjects.appVueFileName),
    appVueFileContent
  );
  console.log(
    chalk.green("Setup complete!")
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
