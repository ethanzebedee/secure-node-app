const js = require('@eslint/js');
// Note: eslint-plugin-security@2.1.1 has compatibility issues with ESLint v9
// The security plugin will need to be updated to work with the new flat config format
// For now, using basic ESLint recommended rules

module.exports = [
  {
    ignores: ['eslint.config.js', 'node_modules/**']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'strict': ['error', 'global']
    }
  }
];

