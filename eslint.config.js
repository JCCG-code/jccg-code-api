import globals from 'globals'
import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/docs/',
      '.prettierrc.json',
      'jsdoc.json'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    plugins: {
      import: pluginImport,
      jsdoc: pluginJsdoc
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs']
        }
      },
      jsdoc: {
        mode: 'typescript'
      }
    },
    rules: {
      'no-console': 'warn',
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/no-unresolved': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never'
        }
      ],
      ...pluginJsdoc.configs.recommended.rules,
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/check-tag-names': [
        'warn',
        { definedTags: ['openapi', 'swagger'] }
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false
          }
        }
      ]
    }
  },
  eslintConfigPrettier
]
