for (let i = 0; i < clashing_to_leave_session.length; i++) {
  debugLog("result:", result);
  //fetch all previous to_leave_sessions

  debugLog("sssssssssss:", [clashing_to_leave_session[i]]);
  let prev_to_leave_session_FH = new LINQ([clashing_to_leave_session[i]])
    .Where(w => w.to_leave_session == "FH")
    .Select(s => s.to_leave_session)
    .FirstOrDefault();

  debugLog("prev_to_leave_session_FH:", prev_to_leave_session_FH);

  let prev_to_leave_session_FD = new LINQ([clashing_to_leave_session[i]])
    .Where(w => w.to_leave_session == "FD")
    .Select(s => s.to_leave_session)
    .FirstOrDefault();

  debugLog("prev_to_leave_session_FD:", prev_to_leave_session_FD);

  let prev_to_leave_session_SH = new LINQ([clashing_to_leave_session[i]])
    .Where(w => w.to_leave_session == "SH")
    .Select(s => s.to_leave_session)
    .FirstOrDefault();

  debugLog("prev_to_leave_session_SH:", prev_to_leave_session_SH);
  //rejection of to_leave_sessions

  if (
    (prev_to_leave_session_FH == "FH" && curr_from_session == "FH") ||
    (prev_to_leave_session_FD == "FD" && curr_from_session == "FH") ||
    (prev_to_leave_session_SH == "SH" && curr_from_session == "FH") ||
    ((prev_to_leave_session_FD == "FD" && curr_from_session == "SH") ||
      (prev_to_leave_session_SH == "SH" && curr_from_session == "SH")) ||
    ((prev_to_leave_session_FH == "FH" && curr_from_session == "FD") ||
      (prev_to_leave_session_FD == "FD" && curr_from_session == "FD") ||
      (prev_to_leave_session_SH == "SH" && curr_from_session == "FD"))
  ) {
    debugLog("rejction_one:");

    releaseDBConnection(db, connection);
    req.records = {
      leave_already_exist: true,
      message:
        "leave is already there between this dates " +
        clashing_to_leave_session[i]["from_date"] +
        " AND " +
        clashing_to_leave_session[i]["to_date"]
    };
    next();
  }
}
//-----------------------------------------------------------------------------------------------------
for (let i = 0; i < clashing_from_leave_session.length; i++) {
  let prev_from_leave_session_FH = new LINQ([clashing_from_leave_session[i]])
    .Where(w => w.from_leave_session == "FH")
    .Select(s => s.from_leave_session)
    .FirstOrDefault();

  debugLog("prev_from_leave_session_FH:", prev_from_leave_session_FH);

  let prev_from_leave_session_SH = new LINQ([clashing_from_leave_session[i]])
    .Where(w => w.from_leave_session == "SH")
    .Select(s => s.from_leave_session)
    .FirstOrDefault();
  debugLog("prev_from_leave_session_SH:", prev_from_leave_session_SH);

  let prev_from_leave_session_FD = new LINQ([clashing_from_leave_session[i]])
    .Where(w => w.from_leave_session == "FD")
    .Select(s => s.from_leave_session)
    .FirstOrDefault();
  debugLog("prev_from_leave_session_FD:", prev_from_leave_session_FD);

  if (
    (prev_from_leave_session_FH == "FH" && curr_to_session == "FD") ||
    (prev_from_leave_session_SH == "SH" && curr_to_session == "FD") ||
    (prev_from_leave_session_FD == "FD" && curr_to_session == "FD") ||
    (prev_from_leave_session_FD == "FD" && curr_to_session == "FH") ||
    (prev_from_leave_session_FH == "FH" && curr_to_session == "FH") ||
    (prev_from_leave_session_FH == "FH" && curr_to_session == "SH") ||
    (prev_from_leave_session_FD == "FD" && curr_to_session == "SH") ||
    (prev_from_leave_session_SH == "SH" && curr_to_session == "SH")
  ) {
    debugLog("rejction two:");

    releaseDBConnection(db, connection);
    req.records = {
      leave_already_exist: true,
      message:
        "leave is already there between this dates " +
        clashing_from_leave_session[i]["from_date"] +
        " AND " +
        clashing_from_leave_session[i]["to_date"]
    };
    next();
  }

  if (i == clashing_sessions.length - 1) {
    resolve({});
  }
}
