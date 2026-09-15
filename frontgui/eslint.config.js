import pluginVue from 'eslint-plugin-vue'
import typescript from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'

export default [
  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.d.ts',
      '**/public/**',
    ],
  },

  // Vue 3 推荐规则
  ...pluginVue.configs['flat/recommended'],

  // TypeScript 配置
  ...typescript.configs.recommended,

  // Vue 文件解析器配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescript.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },

  // TypeScript/JavaScript 文件配置
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: typescript.parser,
    },
  },

  // 自定义规则
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-model-argument': 'off',

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 通用规则
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Prettier 配置
  prettier,
]
