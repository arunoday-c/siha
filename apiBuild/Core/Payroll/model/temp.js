"use strict";

for (var i = 0; i < clashing_to_leave_session.length; i++) {
  debugLog("result:", result);
  //fetch all previous to_leave_sessions

  debugLog("sssssssssss:", [clashing_to_leave_session[i]]);
  var prev_to_leave_session_FH = new LINQ([clashing_to_leave_session[i]]).Where(function (w) {
    return w.to_leave_session == "FH";
  }).Select(function (s) {
    return s.to_leave_session;
  }).FirstOrDefault();

  debugLog("prev_to_leave_session_FH:", prev_to_leave_session_FH);

  var prev_to_leave_session_FD = new LINQ([clashing_to_leave_session[i]]).Where(function (w) {
    return w.to_leave_session == "FD";
  }).Select(function (s) {
    return s.to_leave_session;
  }).FirstOrDefault();

  debugLog("prev_to_leave_session_FD:", prev_to_leave_session_FD);

  var prev_to_leave_session_SH = new LINQ([clashing_to_leave_session[i]]).Where(function (w) {
    return w.to_leave_session == "SH";
  }).Select(function (s) {
    return s.to_leave_session;
  }).FirstOrDefault();

  debugLog("prev_to_leave_session_SH:", prev_to_leave_session_SH);
  //rejection of to_leave_sessions

  if (prev_to_leave_session_FH == "FH" && curr_from_session == "FH" || prev_to_leave_session_FD == "FD" && curr_from_session == "FH" || prev_to_leave_session_SH == "SH" && curr_from_session == "FH" || prev_to_leave_session_FD == "FD" && curr_from_session == "SH" || prev_to_leave_session_SH == "SH" && curr_from_session == "SH" || prev_to_leave_session_FH == "FH" && curr_from_session == "FD" || prev_to_leave_session_FD == "FD" && curr_from_session == "FD" || prev_to_leave_session_SH == "SH" && curr_from_session == "FD") {
    debugLog("rejction_one:");

    releaseDBConnection(db, connection);
    req.records = {
      leave_already_exist: true,
      message: "leave is already there between this dates " + clashing_to_leave_session[i]["from_date"] + " AND " + clashing_to_leave_session[i]["to_date"]
    };
    next();
  }
}
//-----------------------------------------------------------------------------------------------------
for (var _i = 0; _i < clashing_from_leave_session.length; _i++) {
  var prev_from_leave_session_FH = new LINQ([clashing_from_leave_session[_i]]).Where(function (w) {
    return w.from_leave_session == "FH";
  }).Select(function (s) {
    return s.from_leave_session;
  }).FirstOrDefault();

  debugLog("prev_from_leave_session_FH:", prev_from_leave_session_FH);

  var prev_from_leave_session_SH = new LINQ([clashing_from_leave_session[_i]]).Where(function (w) {
    return w.from_leave_session == "SH";
  }).Select(function (s) {
    return s.from_leave_session;
  }).FirstOrDefault();
  debugLog("prev_from_leave_session_SH:", prev_from_leave_session_SH);

  var prev_from_leave_session_FD = new LINQ([clashing_from_leave_session[_i]]).Where(function (w) {
    return w.from_leave_session == "FD";
  }).Select(function (s) {
    return s.from_leave_session;
  }).FirstOrDefault();
  debugLog("prev_from_leave_session_FD:", prev_from_leave_session_FD);

  if (prev_from_leave_session_FH == "FH" && curr_to_session == "FD" || prev_from_leave_session_SH == "SH" && curr_to_session == "FD" || prev_from_leave_session_FD == "FD" && curr_to_session == "FD" || prev_from_leave_session_FD == "FD" && curr_to_session == "FH" || prev_from_leave_session_FH == "FH" && curr_to_session == "FH" || prev_from_leave_session_FH == "FH" && curr_to_session == "SH" || prev_from_leave_session_FD == "FD" && curr_to_session == "SH" || prev_from_leave_session_SH == "SH" && curr_to_session == "SH") {
    debugLog("rejction two:");

    releaseDBConnection(db, connection);
    req.records = {
      leave_already_exist: true,
      message: "leave is already there between this dates " + clashing_from_leave_session[_i]["from_date"] + " AND " + clashing_from_leave_session[_i]["to_date"]
    };
    next();
  }

  if (_i == clashing_sessions.length - 1) {
    resolve({});
  }
}
//# sourceMappingURL=temp.js.map