let inDateTime = moment(
  punchIn.attendance_date + " " + punchIn.in_time,
  "YYYY-MM-DD HH:mm"
);
let outDateTime = moment(
  punchOut.out_date + " " + punchOut.out_time,
  "YYYY-MM-DD HH:mm"
);
utilities.logger().log("inDateTime", inDateTime);
utilities.logger().log("outDateTime", outDateTime);

let totalTime =
  outDateTime.diff(inDateTime, "hours") +
  ":" +
  (outDateTime.diff(inDateTime, "minute") % 60);

utilities.logger().log("totalTime", totalTime);
