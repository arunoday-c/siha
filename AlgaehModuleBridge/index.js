function algaehModuleBridge(path) {
  let _path = path;
  if (process.env.NODE_ENV == "production") {
    _path = path.replace("/src/", "/");
  }
  return require(_path);
}
module.exports = algaehModuleBridge;
