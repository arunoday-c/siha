import moment from "moment";
import algaehMysql from "algaeh-mysql";
function generateDays(start, end, days, format) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    const dat = new Date(dt);
    const day = new Date(dat).getDay();
    if (days.indexOf(day) > -1) {
      arr.push(format === undefined ? dat : moment(dat).format(format));
    }
  }

  return arr;
}

export function onCheckOrUncheckDays(req, res, next) {
  const _mysql = new algaehMysql();
  const { from_date, to_date, days } = req.body;
  try {
    const allYes = days.filter((f) => f.status === "Y").map((m) => m.value);
    const allNo = days.filter((f) => f.status === "N").map((m) => m.value);
    const allCheckedDates = generateDays(
      from_date,
      to_date,
      allYes,
      "YYYY-MM-DD"
    );
    const allUnCheckedDates = generateDays(
      from_date,
      to_date,
      allNo,
      "YYYY-MM-DD"
    );
    if (allUnCheckedDates.length > 0) {
      _mysql.executeQuery;
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
function unCheckSchedule(data, mysql) {
  const { dates } = data;
  return mysql.executeQuery({
    query: `select * from hims_f_patient_appointment where appointment_date in (?)`,
    values: [dates],
  });
}
