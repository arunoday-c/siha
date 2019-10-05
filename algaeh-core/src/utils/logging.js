import utliites from "algaeh-utilities";
const logger = {
  log: (type, message) => {
    utliites
      .AlgaehUtilities()
      .logger()
      .log("", message, type);
  },
  error: (type, message) => {
    utliites
      .AlgaehUtilities()
      .logger()
      .log("", message, type);
  }
};

const debugLog = (message, obj) => {
  return;
};
const debugFunction = name => {
  return;
};
const requestTracking = (message, obj) => {
  utliites
    .AlgaehUtilities()
    .logger()
    .log("", message, "info");
};

export default { logger, debugLog, debugFunction, requestTracking };
