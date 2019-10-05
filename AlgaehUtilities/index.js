const utils = require("./utilities");

exports.AlgaehUtilities = options => {
  return {
    encryption: data => {
      return new utils().encryption(data);
    },
    decryption: data => {
      return new utils().decryption(data);
    },
    getTokenData: token => {
      return new utils().getTokenData(token);
    },
    tokenVerify: token => {
      return new utils().tokenVerify(token);
    },
    httpStatus: () => {
      return new utils().httpStatus();
    },
    logger: reqTracker => {
      return new utils().logger(reqTracker);
    }
  };
};
