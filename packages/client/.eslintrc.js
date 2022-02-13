module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    'max-len': ['error', {
      code: 120,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
    }],
    'no-unused-expressions': 'off',
    'function-paren-newline': ['warn', 'multiline-arguments'],
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/func-call-spacing': ['error'],
    'func-call-spacing': 'off',
    'max-lines-per-function': [
      'warn',
      {
        max: 100,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'import/order': ['error', {
      pathGroups: [
        {
          pattern: '@/**',
          group: 'internal',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
    'no-spaced-func': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'guard-for-in': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
    }],
    'vue/attribute-hyphenation': ['warn', 'never'],
    // 'vue/valid-v-slot': 'off'
    'vue/v-slot-style': ['warn', {
      atComponent: 'shorthand',
    }],
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },

    {
      files: ['**/services/*', '**/services/**/*'],
      rules: {
        '@typescript-eslint/member-ordering': 'error',
      },
    },
  ],
};
