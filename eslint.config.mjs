// 📌 Importation des modules nécessaires

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'; // Compatibilité avec les anciennes configs ESLint
import { FlatCompat } from '@eslint/eslintrc'; // Gestion des configurations modernes ESLint
import js from '@eslint/js'; // Règles de base pour JavaScript
import htmlPlugin from '@html-eslint/eslint-plugin'; // Plugin ESLint pour HTML
import htmlParser from '@html-eslint/parser'; // Parser ESLint pour analyser le code HTML
import _import from 'eslint-plugin-import'; // Vérification des imports JS
import security from 'eslint-plugin-security'; // Vérifications de sécurité courantes
import simpleImportSort from 'eslint-plugin-simple-import-sort'; // Tri automatique des imports
import unicorn from 'eslint-plugin-unicorn'; // Règles avancées de qualité du code
import globals from 'globals'; // Définitions des variables globales
import path from 'node:path'; // Gestion des chemins de fichiers
import { fileURLToPath } from 'node:url'; // Conversion des URL en chemins de fichiers
import jsxA11y from 'eslint-plugin-jsx-a11y';

// 📌 Détermination du chemin du fichier en mode ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Configuration pour la compatibilité avec l'ancien format ESLint
const compat = new FlatCompat({
    baseDirectory: __dirname, // Définit le répertoire de base
    recommendedConfig: js.configs.recommended, // Charge la configuration recommandée par ESLint
    allConfig: js.configs.all, // Charge toutes les règles ESLint disponibles
});

// 📌 Exportation de la configuration ESLint
export default [
    {
        // 📌 Liste des fichiers/dossiers à ignorer pour éviter les erreurs inutiles
        ignores: [
            '**/*.svg', // Ignore les fichiers SVG
            '**/node_modules/**', // Ignore le dossier des dépendances
            'dist/**', // Ignore les fichiers compilés
            'coverage/**', // Ignore les rapports de couverture de tests
            'build/**', // Ignore le dossier de build
        ],
    },

    // 📌 Configuration principale : Ajout des configurations ESLint essentielles
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended', // Applique les règles de base d'ESLint
            'plugin:@html-eslint/recommended', // Applique les règles recommandées pour le HTML
            'plugin:import/recommended', // Vérifie les imports JavaScript
            'plugin:security/recommended-legacy', // Vérifie les failles de sécurité courantes
            'plugin:unicorn/recommended', // Applique les bonnes pratiques avancées
            'plugin:jsx-a11y/recommended', // Ajout du plugin accessibilité
            'plugin:prettier/recommended' // Intégration avec Prettier pour le formatage du code
        )
    ),

    {
        // 📌 Définition des plugins utilisés dans ESLint
        plugins: {
            '@html-eslint': fixupPluginRules(htmlPlugin), // Plugin pour HTML
            import: fixupPluginRules(_import), // Vérification des imports JS
            security: fixupPluginRules(security), // Plugin pour la sécurité
            unicorn: fixupPluginRules(unicorn), // Plugin de bonnes pratiques avancées
            'simple-import-sort': simpleImportSort, // Trie automatiquement les imports
            'jsx-a11y': fixupPluginRules(jsxA11y), //  Ajout du plugin accessibilité HTML/JS
        },

        // 📌 Options pour l'analyse du code
        languageOptions: {
            globals: { ...globals.browser }, // Définit les variables globales pour les navigateurs (`window`, `document`, etc.)
            ecmaVersion: 2023, // Utilisation des dernières fonctionnalités ECMAScript
            sourceType: 'module', // Indique que le code utilise les modules ES6
        },

        // 📌 Définition des règles ESLint
        rules: {
            'no-console': 'warn', // ⚠️ Avertit en cas d'utilisation de `console.log()`
            'no-unused-vars': 'warn', // ⚠️ Avertit si une variable est déclarée mais jamais utilisée
            eqeqeq: ['error', 'always'], // ❌ Force l'utilisation de `===` au lieu de `==`
            'no-var': 'error', // ❌ Interdit l'utilisation de `var`, oblige `let` ou `const`
            'prefer-const': 'error', // ❌ Oblige à utiliser `const` si la variable n'est jamais réassignée
            'no-magic-numbers': ['warn', { ignore: [0, 1] }], // ⚠️ Avertit si des nombres magiques sont utilisés, sauf `0` et `1`
            curly: ['error', 'all'], // ❌ Oblige l'utilisation des `{}` dans les structures de contrôle (`if`, `for`, etc.)
            'no-undef': 'error', // ❌ Interdit l'utilisation de variables non définies

            // 📌 Configuration de Prettier pour formater le code automatiquement
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4, // 🛠️ Définit une indentation de 4 espaces
                    singleQuote: true, // 🛠️ Utilisation de guillemets simples (`'`) au lieu de doubles (`"`)
                    trailingComma: 'es5', // 🛠️ Ajoute une virgule finale dans les objets et tableaux si nécessaire
                    semi: true, // 🛠️ Force l'utilisation des `;` à la fin des lignes
                    bracketSpacing: true, // 🛠️ Ajoute un espace entre `{` et `}`
                    endOfLine: 'lf', // 🛠️ Utilisation des fins de ligne `LF` (Unix) au lieu de `CRLF` (Windows)
                    useTabs: false, // 🛠️ Désactive les tabulations, force les espaces
                    printWidth: 200, // Empêche les retours à la ligne forcés
  htmlWhitespaceSensitivity: "ignore" // Ignore l'espace dans HTML
                },
            ],
            indent: 'off', // ✅ Désactive `indent` pour éviter les conflits avec Prettier
        },
    },

    {
        // 📌 Configuration spécifique aux fichiers HTML
        files: ['**/*.html'], // S'applique uniquement aux fichiers `.html`
        rules: {
            indent: ['error', 4], // ✅ Force une indentation de 4 espaces pour HTML uniquement
            'prettier/prettier': 'off', // Désactive Prettier pour le HTML
        },
        plugins: { '@html-eslint': fixupPluginRules(htmlPlugin) }, // Utilisation du plugin HTML
        languageOptions: { parser: htmlParser }, // Analyse HTML avec le parser dédié
    },
];
