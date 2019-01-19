if (input.from_session == "SH" && k == 0) {
  if (from_month === to_month && input.to_session == "FH") {
    leaveDeductionArray.push({
      month_name: dateRange[k]["month_name"],
      finalLeave:
        parseFloat(dateRange[k]["leaveDays"]) -
        parseFloat(reduce_days) -
        parseFloat(1)
    });
  } else {
    leaveDeductionArray.push({
      month_name: dateRange[k]["month_name"],
      finalLeave:
        parseFloat(dateRange[k]["leaveDays"]) -
        parseFloat(reduce_days) -
        parseFloat(0.5)
    });
  }
} else if (input.to_session == "FH" && k == dateRange.length - 1) {
  leaveDeductionArray.push({
    month_name: dateRange[k]["month_name"],
    finalLeave:
      parseFloat(dateRange[k]["leaveDays"]) -
      parseFloat(reduce_days) -
      parseFloat(0.5)
  });
} else {
  leaveDeductionArray.push({
    month_name: dateRange[k]["month_name"],
    finalLeave: parseFloat(dateRange[k]["leaveDays"]) - parseFloat(reduce_days)
  });
}
