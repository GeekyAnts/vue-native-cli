const semver = require("semver");
const chalk = require("chalk");
const execSync = require("child_process").execSync;
const constantObjects = require("./constants");

function isProjectNameValid(projectName) {
  const regExpForValidProjectName = new RegExp(
    constantObjects.regExpForValidDirectory
  );
  if (projectName && regExpForValidProjectName.test(projectName)) {
    return true;
  }
  return false;
}

function getYarnVersionIfAvailable() {
  var yarnVersion;
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
  var crnaVersion = null;
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

module.exports = {
  isProjectNameValid,
  getYarnVersionIfAvailable,
  getCrnaVersionIfAvailable
};
