import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    // Extension on Next.js (Flat)
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    // Parser & plugins
    {
        ignores: ['node_modules'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                project: './tsconfig.json',
                sourceType: 'module',
            },
        },
        plugins: {
            prettier: require('eslint-plugin-prettier'),
            import: require('eslint-plugin-import'),
            react: require('eslint-plugin-react'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            // Prettier
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    endOfLine: 'auto',
                    printWidth: 120,
                    useTabs: false,
                    semi: true,
                    singleQuote: true,
                    jsxSingleQuote: false,
                    quoteProps: 'as-needed',
                    trailingComma: 'es5',
                    bracketSpacing: true,
                    bracketSameLine: false,
                    arrowParens: 'always',
                    embeddedLanguageFormatting: 'auto',
                    parser: 'typescript',
                },
            ],

            // rules
            'prefer-const': 'warn',
            'no-console': 'warn',
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'always-and-inside-groups',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-constant-binary-expression': 'warn',
            'no-constant-condition': 'warn',
            'no-dupe-else-if': 'error',
            'no-duplicate-imports': 'warn',
            'no-loss-of-precision': 'warn',
            'max-params': ['warn', 4],
            'no-eval': 'error',
            'no-script-url': 'error',
            'no-extra-boolean-cast': 'warn',
            'no-lonely-if': 'warn',
            'no-param-reassign': ['warn', { props: false }],
            'no-unneeded-ternary': 'warn',
            'no-useless-return': 'warn',
            'no-var': 'error',
            'require-await': 'warn',
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
            'react/no-danger': 'error',
            'react/self-closing-comp': 'warn',
            'react/jsx-boolean-value': ['warn', 'always'],
            'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
            'react/jsx-closing-tag-location': 'warn',
            'react/jsx-fragments': ['warn', 'syntax'],
            'react/jsx-key': 'warn',
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-pascal-case': 'error',
            'consistent-return': 'warn',
            '@typescript-eslint/member-delimiter-style': 'warn',
            '@typescript-eslint/prefer-includes': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            'no-useless-escape': 'off',
            'react/jsx-curly-brace-presence': 'warn',
        },
    },

    // Overrides for stories
    {
        files: ['src/stories/*.tsx'],
        rules: { 'import/no-default-export': 'off' },
    },
];
