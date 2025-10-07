import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"

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
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            // "no-console": "warn",
            // "no-unused-vars": "warn",
            "@next/next/no-html-link-for-pages": "off",
        },
    },
]

export default config
