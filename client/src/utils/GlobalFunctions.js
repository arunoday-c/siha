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

export const FORMAT_PAYTYPE = [
  { name: "Cash", arabic_name: "السيولة النقدية", value: "CA" },
  { name: "Card", arabic_name: "بطاقة", value: "CD" },
  { name: "Cheque", arabic_name: "التحقق من", value: "CH" }
];

export const FORMAT_CARDTYPE = [
  { name: "Master", arabic_name: "رئيس", value: "CA" },
  { name: "Visa", arabic_name: "تأشيرة", value: "CD" },
  { name: "Mada", arabic_name: "مادا", value: "CH" }
];

export const FORMAT_COUNTER = [
  { name: "OP", arabic_name: "OP", value: "1" },
  { name: "Emergency", arabic_name: "حالة طوارئ", value: "2" },
  { name: "IP", arabic_name: "IP", value: "3" }
];

export const FORMAT_SHIFT = [
  { name: "Morning", arabic_name: "صباح", value: "1" },
  { name: "Afternoon", arabic_name: "بعد الظهر", value: "2" },
  { name: "Night", arabic_name: "ليل", value: "3" }
];
