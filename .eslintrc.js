const path = require('path');

module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['eslint-rules'],
  settings: {
    'eslint-rules': './eslint-rules',
  },
  overrides: [
    {
      files: ['src/features/**/*.*'], // Target all files in src/features
      plugins: ['custom-rules'], // Add a custom plugin
      rules: {
        'custom-rules/hexa-prefix': 'error', // Enable the custom rule
      },
    },
  ],
};
