const chalk = require("chalk");
const execSync = require("child_process").execSync;
const constantObjects = require("./constants");

function isProjectNameValidForCrna(projectName) {
  const regExpForValidProjectName = new RegExp(
    constantObjects.regExpForValidCrnaDirectory
  );
  if (projectName && regExpForValidProjectName.test(projectName)) {
    return true;
  }
  return false;
}

function isProjectNameValidForRn(projectName) {
  const regExpForValidProjectName = new RegExp(
    constantObjects.regExpForValidRnDirectory
  );
  if (projectName && regExpForValidProjectName.test(projectName)) {
    return true;
  }
  return false;
}

function isProjectNameValid(projectName, isCrnaProject) {
  let response = false;
  if (isCrnaProject) {
    response = isProjectNameValidForCrna(projectName);
  } else {
    response = isProjectNameValidForRn(projectName);
  }
  return response;
}

function getYarnVersionIfAvailable() {
  let yarnVersion;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith("win")) {
      yarnVersion = (execSync("yarn --version").toString() || "").trim();
    } else {
      yarnVersion = (
        execSync("yarn --version 2>/dev/null").toString() || ""
      ).trim();
    }
  } catch (error) {
    return null;
  }
  return yarnVersion;
}

function getCrnaVersionIfAvailable() {
  let crnaVersion = null;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith("win")) {
      crnaVersion = (
        execSync(`${constantObjects.crnaPackageName} --version`).toString() ||
        ""
      ).trim();
    } else {
      crnaVersion = (
        execSync(
          `${constantObjects.crnaPackageName} --version 2>/dev/null`
        ).toString() || ""
      ).trim();
    }
  } catch (error) {
    console.log(chalk.red("Error In Getting Crna Package Version"), error);
    return null;
  }
  return crnaVersion;
}

function getReactNativeCLIifAvailable() {
  let crnaVersion = null;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith("win")) {
      crnaVersion = (
        execSync(`${constantObjects.rnPackageName} --version`).toString() ||
        ""
      ).trim();
    } else {
      crnaVersion = (
        execSync(
          `${constantObjects.rnPackageName} --version 2>/dev/null`
        ).toString() || ""
      ).trim();
    }
  } catch (error) {
    console.log(chalk.red("Error In Getting React Native Package Version"));
    return null;
  }
  return crnaVersion;
}

module.exports = {
  isProjectNameValid,
  getYarnVersionIfAvailable,
  getCrnaVersionIfAvailable,
  getReactNativeCLIifAvailable
};
