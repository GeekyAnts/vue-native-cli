const constantObject = {
  regExpForValidCrnaDirectory: /^[a-zA-Z0-9\-]+$/,
  regExpForValidRnDirectory: /^[$A-Z_][0-9A-Z_$]*$/i,
  crnaPackageName: "expo",
  rnPackageName: "react-native",
  stableRNVersion: "react-native@0.59",
  appJsonPath: "app.json",
  vueNativePackages: {
    vueNativeCore: "vue-native-core",
    vueNativeHelper: "vue-native-helper",
    vueNativeScripts: "vue-native-scripts"
  },
  rnPkgCliFileName: "rn-cli.config.js",
  vueTransformerFileName: "vueTransformerPlugin.js",
  appVueFileName: "App.vue"
};

module.exports = constantObject;
