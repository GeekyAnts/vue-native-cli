const vueNativeScripts = require("vue-native-scripts");

const upstreamTransformer = require("metro-react-native-babel-transformer");

const vueExtensions = ["vue"]; // <-- Add other extensions if needed.

module.exports.transform = function ({ src, filename, options }) {
  if (vueExtensions.some(ext => filename.endsWith("." + ext))) {
    return vueNativeScripts.transform({ src, filename, options });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
