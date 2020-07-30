module.exports = {
  webpack: {
    configure: {
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM",
      },
    },
  },
  eslint: {
    configure: {
      rules: {
        "no-unused-vars": "error",
        "no-dupe-keys": "error",
        "no-eval": "off",
        "array-callback-return": "error",
        "no-extra-bind": "warn",
        "require-await": "error",
        eqeqeq: "off",
      },
    },
  },
};
