const chalk = require("chalk");

function promptForInvalidProjectName(
  promptObj,
  onSuccessAnswer,
  onFailedAnswer,
  projectName,
  cmd
) {
  promptObj.start();

  const property = {
    name: "invalidProjectName",
    message:
      "Directory " + projectName + " is invalid. Do you want to continue?",
    validator: /y[es]*|n[o]?/,
    warning: "Please respond with y(es) or n(o)",
    default: "no"
  };

  promptObj.get(property, function(err, result) {
    if (result.invalidProjectName[0] === "y") {
      onSuccessAnswer(projectName, cmd);
    } else {
      onFailedAnswer();
    }
  });
}

function createVueProjectAfterConfirmation(
  promptObj,
  onSuccessAnswer,
  onFailedAnswer,
  name,
  cmd
) {
  promptObj.start();

  const property = {
    name: "directoryExistAndContinue",
    message: "Directory " + name + " already exists. Continue?",
    validator: /y[es]*|n[o]?/,
    warning: "Please respond with y(es) or n(o)",
    default: "no"
  };

  promptObj.get(property, function(err, result) {
    if (result.directoryExistAndContinue[0] === "y") {
      onSuccessAnswer(name, cmd);
    } else {
      onFailedAnswer();
    }
  });
}

module.exports = {
  promptForInvalidProjectName,
  createVueProjectAfterConfirmation
};
