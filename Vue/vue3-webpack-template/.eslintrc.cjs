export default {
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  extends: ["plugin:vue/vue3-strongly-recommended", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {},
};
