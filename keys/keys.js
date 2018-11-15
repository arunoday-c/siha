if (process.env.NODE_ENV == "development") {
  module.exports = require("./dev");
} else if (process.env.NODE_ENV == "test") {
  module.exports = require("./test");
} else {
  module.exports = require("./prod");
}
