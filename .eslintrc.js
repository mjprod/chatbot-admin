module.exports = {
  ignorePatterns: ['.yarn/', 'build/**', 'node_modules/'], // Ignore specific folders
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'], // Apply these rules to JS and JSX files
      env: {
        browser: true, // Enable browser environment
        es2021: true, // Support ES2021 syntax
        node: true, // Enable Node.js environment (if needed)
      },
      plugins: ['react', 'prettier'], // Use React and Prettier plugins
      extends: [
        'eslint:recommended', // Recommended ESLint rules
        'plugin:react/recommended', // Recommended React rules
        'prettier', // Integrate with Prettier
      ],
      parserOptions: {
        ecmaVersion: 2021, // Support ES2021 features
        sourceType: 'module', // Support ES6 module syntax (import/export)
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
      rules: {
        complexity: ['error', 15], // Limit code complexity to 10
        'no-unused-vars': 'off', // Disable unused variables rule
        'react/prop-types': 'warn', // Warn for missing PropTypes in React components
        'prettier/prettier': 'warn', // Enforce Prettier formatting as an error
        "react/react-in-jsx-scope": "off"
      },
      settings: {
        react: {
          version: 'detect', // Automatically detect React version
        },
      },
    },
  ],
};