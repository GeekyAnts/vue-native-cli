const chalk = require("chalk");
const execSync = require("child_process").execSync;
const semverRegex = require('semver-regex');

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
    console.log(chalk.red("An error occurred while getting Expo CLI version"), error);
    return null;
  }
  return crnaVersion;
}

function getReactNativeCLIifAvailable() {
  // Get package version command and discard stderr on *nix systems
  const processCommand = process.platform.startsWith("win")
    ? `${constantObjects.rnPackageName} --version`
    : `${constantObjects.rnPackageName} --version 2>/dev/null`

  try {
    // execSync returns a Buffer -> convert to string
    const commandResult = (execSync(processCommand).toString() || "").trim();
    const regexMatches = commandResult.match(semverRegex());
    const packageSemver = regexMatches.length > 0
      ? regexMatches[0] // longest first match
      : "";
    return packageSemver;
  } catch (error) {
    console.log(chalk.red("An error occurred while getting React Native CLI version"));
    return null;
  }
}

module.exports = {
  isProjectNameValid,
  getYarnVersionIfAvailable,
  getCrnaVersionIfAvailable,
  getReactNativeCLIifAvailable
};
