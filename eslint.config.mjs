import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			jest,
			prettier,
			tsdoc,
		},

		languageOptions: {
			globals: {
				...globals.node,
				...jest.environments.globals.globals,
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
			},

			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			'prettier/prettier': 2,
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'jest/no-disabled-tests': 'warn',
			'jest/no-focused-tests': 'error',
			'jest/no-identical-title': 'error',
			'jest/prefer-to-have-length': 'warn',
			'jest/valid-expect': 'error',
			'tsdoc/syntax': 'warn',
		},
	},
];
