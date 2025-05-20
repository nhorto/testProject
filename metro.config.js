const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Add resolution for Node.js modules
config.resolver.extraNodeModules = {
  'stream': require.resolve('stream-browserify'),
  'buffer': require.resolve('buffer'),
  'path': require.resolve('path-browserify'),
  'process': require.resolve('process/browser'),
  'http': require.resolve('stream-http'),
  'https': require.resolve('https-browserify'),
  'zlib': require.resolve('browserify-zlib'),
  'text-encoding': require.resolve('text-encoding-polyfill'),
  'base-64': require.resolve('base-64'),
  'react-native-fetch-api': require.resolve('react-native-fetch-api'),
  // Remove the line referencing web-streams-polyfill/ponyfill/es6
};

module.exports = config;