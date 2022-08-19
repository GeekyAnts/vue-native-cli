const constantObject = {
  regExpForValidCrnaDirectory: /^[a-zA-Z0-9\-]+$/,
  regExpForValidRnDirectory: /^[$A-Z_][0-9A-Z_$]*$/i,
  crnaPackageName: "expo",
  rnPackageName: "react-native",
  stableRNVersion: "react-native@0.63",
  appJsonPath: "app.json",
  vueNativePackages: {
    vueNativeCore: "vue-native-core",
    vueNativeHelper: "vue-native-helper",
    vueNativeScripts: "vue-native-scripts",
    propTypes: "prop-types"
  },
  rnPkgCliFileName: "rn-cli.config.js",
  metroConfigFile: "metro.config.js",
  vueTransformerFileName: "vueTransformerPlugin.js",
  appVueFileName: "App.vue",
  expoAppJSONSourceExtsPath: "expo.packagerOpts.sourceExts",
  vueFileExtensions: ["vue"],
};

module.exports = constantObject;
