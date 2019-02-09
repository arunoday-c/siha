export default function algaehPath(path) {
  if (process.env.NODE_ENV == "production") {
    return path.replace("/src/", "/");
  } else {
    return path;
  }
}
