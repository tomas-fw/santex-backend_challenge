module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
