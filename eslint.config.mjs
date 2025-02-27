//  Importation des modules nécessaires
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import _import from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsxA11y from 'eslint-plugin-jsx-a11y';
// Ajout de l'import pour le plugin markdown
import markdownPlugin from '@eslint/markdown';

//  Détermination du chemin du fichier en mode ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Configuration pour la compatibilité avec l'ancien format ESLint
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

//  Exportation de la configuration ESLint
export default [
    {
        //  Liste des fichiers/dossiers à ignorer pour éviter les erreurs inutiles
        ignores: ['**/*.svg', '**/node_modules/**', 'dist/**', 'coverage/**', 'build/**'],
    },
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:@html-eslint/recommended',
            'plugin:import/recommended',
            'plugin:security/recommended-legacy',
            'plugin:unicorn/recommended',
            'plugin:jsx-a11y/recommended',
            'plugin:prettier/recommended'
        )
    ),
    {
        //  Définition des plugins utilisés dans ESLint
        plugins: {
            '@html-eslint': fixupPluginRules(htmlPlugin),
            import: fixupPluginRules(_import),
            security: fixupPluginRules(security),
            unicorn: fixupPluginRules(unicorn),
            'simple-import-sort': simpleImportSort,
            'jsx-a11y': fixupPluginRules(jsxA11y),
            // Ajout du plugin markdown
            markdown: markdownPlugin,
        },
        languageOptions: {
            globals: { ...globals.browser },
            ecmaVersion: 2023,
            sourceType: 'module',
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'warn',
            eqeqeq: ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-magic-numbers': ['warn', { ignore: [0, 1] }],
            curly: ['error', 'all'],
            'no-undef': 'error',
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4,
                    singleQuote: true,
                    trailingComma: 'es5',
                    semi: true,
                    bracketSpacing: true,
                    endOfLine: 'lf',
                    useTabs: false,
                    printWidth: 200,
                    htmlWhitespaceSensitivity: 'ignore',
                },
            ],
            indent: 'off',
        },
    },
    {
        files: ['**/*.html'],
        rules: {
            indent: ['error', 4],
            'prettier/prettier': 'off',
        },
        plugins: { '@html-eslint': fixupPluginRules(htmlPlugin) },
        languageOptions: { parser: htmlParser },
    },
    // Ajout de la configuration pour les fichiers Markdown
    {
        files: ['**/*.md'],
        plugins: {
            markdown: markdownPlugin,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    proseWrap: 'always', // Forcer le retour à la ligne pour une meilleure lisibilité
                    printWidth: 80, // Largeur max avant un retour à la ligne
                    tabWidth: 4, // Indentation de 4 espaces
                    trailingComma: 'none', // Pas de virgule finale dans les objets/tableaux
                },
            ],
        },

        processor: 'markdown/markdown',
    },
];
