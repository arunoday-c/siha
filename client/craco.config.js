module.exports = {
  webpack: {
    configure: {
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM"
      }
    }
  }
};
