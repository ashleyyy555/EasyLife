const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Fix asset extension and source extension usage
config.resolver.assetExts.push("onnx");
config.resolver.sourceExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

// Wrap with NativeWind and export
module.exports = withNativeWind(config, { input: "./app/global.css" });
