module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          'stream': 'stream-browserify',
          'buffer': 'buffer',
          'path': 'path-browserify',
          'process': 'process/browser',
          'http': 'stream-http',
          'https': 'https-browserify',
          'zlib': 'browserify-zlib',
          'text-encoding': 'text-encoding-polyfill',
          'base-64': 'base-64',
          'react-native-fetch-api': 'react-native-fetch-api',
          // Remove the line referencing web-streams-polyfill/ponyfill/es6
        }
      }]
    ],
  };
};