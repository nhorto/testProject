import 'react-native-polyfill-globals/auto';
import 'event-target-polyfill';
import 'react-native-url-polyfill/auto';

// Optional: You can add specific polyfills if needed
global.process = require('process');
global.Buffer = require('buffer').Buffer;