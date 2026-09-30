import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "@next/next/no-img-element": "warn"
    }
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      ".playwright-cli/**",
      "output/**",
      "scripts/**"
    ]
  }
];

export default config;
