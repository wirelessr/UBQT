module.exports = {
  "env": {
    node: true,
    mocha: true,
    es6: true
  },
  "extends": ["plugin:prettier/recommended", "eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {},
  "ignorePatterns": ["models/*", "addons/**/models/*"]
};
