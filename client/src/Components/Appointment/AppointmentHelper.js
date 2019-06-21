import moment from "moment";

export function generateTimeslotsForDoctor(data) {
  console.log(data);
  // Takes Appointment Schedule as input and returns an Array with time and "break"
  const from_work_hr = moment(data.from_work_hr, "hh:mm:ss");
  const to_work_hr = moment(data.to_work_hr, "hh:mm:ss");
  const from_break_hr1 = moment(data.from_break_hr1, "hh:mm:ss");
  const to_break_hr1 = moment(data.to_break_hr1, "hh:mm:ss");
  const from_break_hr2 = moment(data.from_break_hr2, "hh:mm:ss");
  const to_break_hr2 = moment(data.to_break_hr2, "hh:mm:ss");
  const slot = parseInt(data.slot, 10);
  let result = [];
  let count = 0;
  let newFrom = from_work_hr.clone();
  for (;;) {
    let isBreak = false;

    newFrom = count === 0 ? newFrom : newFrom.add(slot, "minutes");
    console.log(newFrom, "new time");
    if (newFrom.isBefore(to_work_hr)) {
      if (data.work_break1 === "Y" || data.work_break2 === "Y") {
        let endTimeTemp = new moment(newFrom).add(slot, "minutes");
        if (
          (to_break_hr1 > newFrom && to_break_hr1 <= newFrom) ||
          (from_break_hr1 <= newFrom && to_break_hr1 >= endTimeTemp)
        ) {
          isBreak = true;
        }

        if (
          (to_break_hr2 > newFrom && to_break_hr2 <= endTimeTemp) ||
          (from_break_hr2 <= newFrom && to_break_hr2 >= endTimeTemp)
        ) {
          isBreak = true;
        }
      }
      if (isBreak) {
        result.push("break");
      } else {
        result.push(newFrom.format("HH:mm:ss"));
      }
    } else {
      break;
    }
    count = count + 1;
    console.log("from end", count);
  }
  console.log("from result", result);
  return result;
}
