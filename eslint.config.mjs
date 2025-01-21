import eslintPluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['.yarn/', 'build/**', 'node_modules/'],
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      complexity: ['error', 15],
      'no-unused-vars': 'off',
      'react/prop-types': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
