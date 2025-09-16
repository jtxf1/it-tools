import antfu from '@antfu/eslint-config'

export default antfu({
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are autodetected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '_templates/',
    // ...globs
  ],
  rules: {
    'node/prefer-global/process': 'off',
    'unicorn/prefer-dom-node-text-content': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'ts/no-use-before-define': 'off',
    'unused-imports/no-unused-vars': 'off',
    'regexp/no-dupe-characters-character-class': 'off',
    'regexp/no-obscure-range': 'off',
    'regexp/no-potentially-useless-backrefere': 'off',
    'regexp/no-empty-alternative': 'off',
    'no-throw-literal': 'off',
    'regexp/no-potentially-useless-backreference': 'off',
  },
})
