module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "react-app",
    "plugin:react/recommended",
    "eslint:recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  parser: "babel-eslint",
  plugins: ["babel", "import", "jsx-a11y", "react", "react-hooks"],
  rules: {},
  settings: {
    react: {
      version: "16.13",
    },
  },
};
