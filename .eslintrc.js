module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Allow console statements for development debugging
    'no-console': 'off',
    
    // Possible Errors
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'warn',
    'no-extra-semi': 'warn',
    'no-unexpected-multiline': 'error',
    
    // Best Practices
    'curly': ['error', 'multi-line'],
    'dot-notation': 'warn',
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-multi-spaces': 'warn',
    'no-unused-vars': ['error', { 'args': 'none' }],
    'no-var': 'error',
    
    // Stylistic - Let Prettier handle most formatting
    'comma-dangle': 'off',
    'indent': 'off',
    'no-trailing-spaces': 'off',
    'quotes': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    
    // Keep some important rules
    'linebreak-style': ['error', 'unix'],
    'no-multiple-empty-lines': ['warn', { 'max': 2, 'maxEOF': 1 }],
    
    // ES6
    'arrow-spacing': 'warn',
    'no-duplicate-imports': 'error',
    'prefer-const': 'warn',
    'prefer-template': 'warn',
  },
  globals: {
    // Chart.js
    'Chart': 'readonly',
    // D3.js
    'd3': 'readonly',
    // jsPDF
    'jsPDF': 'readonly',
    // Bootstrap
    'bootstrap': 'readonly',
    // Custom Components
    'AssessmentEngine': 'readonly',
    'ProcessNetworkVisualizer': 'readonly',
    'RecommendationEngine': 'readonly',
    'ExportManager': 'readonly',
  },
};