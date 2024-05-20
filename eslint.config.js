import es from "@eslint/js"
import ts from "typescript-eslint"

export default ts.config(
  es.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "max-len": ["error", 120],
      "quotes": ["error", "double"],
      "semi": ["error", "never"]
    },
    files: ["src/**/*.{ts,tsx}"],
  },
  {
    ignores: ["**/*.d.ts", "**/dist/*"],
  }
)
