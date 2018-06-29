import moment from "moment";
import extend from "extend";

export default { isDateFormat: isDateFormat };

function isDateFormat(options) {
  var returnString = "";
  var defOpt = defaultOptions();
  var settings = extend(
    {
      date: null,
      isTime: false,
      usedefaultFarmats: true
    },
    options
  );
  if (settings.isTime) {
    settings.format = defOpt.serverTimeFormat;
  }
  if (settings.date !== null && settings.date !== "") {
    var dateasString = String(settings.date);
    if (dateasString !== "0") {
      returnString = moment(settings.date).format(settings.format);
    }
  }

  return returnString;
}

function defaultOptions() {
  return {
    DateFormat: "YYYY-MM-DD",
    TimeFormat: "HH:MM"
  };
}
