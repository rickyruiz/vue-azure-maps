module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/typescript'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'never',
      },
    ],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
