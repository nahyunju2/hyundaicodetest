/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    // ref. https://eslint.vuejs.org/rules/
    'plugin:vue/vue3-recommended',
    // ref. https://eslint.org/docs/latest/use/configure/configuration-files
    'eslint:recommended',
    // ref. https://typescript-eslint.io/rules/
    '@vue/eslint-config-typescript',
    // ref. https://eslint.org/docs/latest/use/configure/configuration-files
    '@vue/eslint-config-prettier/skip-formatting',
    // AutoImport
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  "rules": {
    "vue/no-unused-vars": "warn",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "vue/html-indent": ["error", 2, {}],
    "sort-imports": ["warn", {
      "ignoreCase": false,
      "ignoreDeclarationSort": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": true
    }],
    "vue/attributes-order": ["warn", {
      "alphabetical": true
    }]
  },
}