const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  wrapWithAudioAPIMetroConfig,
} = require('react-native-audio-api/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// metro.config.js
const config = {};
const audioAPIMetroConfig = wrapWithAudioAPIMetroConfig(config);
const reanimatedMetroConfig = wrapWithReanimatedMetroConfig(config);
const defaultConfig = getDefaultConfig(__dirname);


module.exports = mergeConfig(defaultConfig, config, reanimatedMetroConfig,
  audioAPIMetroConfig);
