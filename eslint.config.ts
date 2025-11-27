import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"
import nextPlugin from "@next/eslint-plugin-next"
import importPlugin from "eslint-plugin-import"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const config = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "public/**",
        ],

        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin,
            "@next/next": nextPlugin,
            "import": importPlugin,
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "@next/next/no-html-link-for-pages": "off",

            "semi": ["error", "never"],

            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: ["function", "class"] }
            ],

            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                }
            ],
        },
    },
]

export default config
