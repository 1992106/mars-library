module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  globals: {},
  rules: {
    'prettier/prettier': [2, { endOfLine: 'lf' }],
    'vue/no-unused-components': 0,
    'vue/no-unused-vars': 0,
    'vue/no-v-for-template-key-on-child': 0,
    'vue/no-v-model-argument': 0,
    'vue/no-multiple-template-root': 0,
    'vue/no-v-for-template-key': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0
  }
}
