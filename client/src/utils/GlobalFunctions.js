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

export const FORMAT_MARTIALSTS = [
  { name: "Married", arabic_name: "زوجت", value: "Married" },
  { name: "Single", arabic_name: "غير مرتبطة", value: "Single" },
  { name: "Divorced", arabic_name: "مطلقة", value: "Divorced" },
  { name: "Widowed", arabic_name: "الأرامل", value: "Widowed" }
];

export const FORMAT_GENDER = [
  { name: "Male", arabic_name: "الذكر", value: "Male" },
  { name: "Female", arabic_name: "إناثا", value: "Female" },
  { name: "Others", arabic_name: "الآخرين", value: "Others" }
];
