import loggerPreferences from "./loggerSchema";
import moment from "moment";
export function getLogs(req, res, next) {
  const {
    hims_d_hospital_id,
    from_date,
    to_date,
    employee_id,
    level
  } = req.body;
  if (hims_d_hospital_id === undefined || hims_d_hospital_id === "") {
    res.status(400).json({
      success: false,
      message: new Error("Please provide branch")
    });
    return;
  }
  if (from_date === undefined || from_date === "") {
    res.status(400).json({
      success: false,
      message: new Error("Please provide from date")
    });
    return;
  }
  if (to_date === undefined || to_date === "") {
    res.status(400).json({
      success: false,
      message: new Error("Please provide to date")
    });
    return;
  }
  //   if (employee_id === undefined || employee_id === "") {
  //     res.status(400).json({
  //       success: false,
  //       message: new Error("Please provide to employee")
  //     });
  //     return;
  //   }
  const createMessage =
    hims_d_hospital_id !== undefined
      ? { message: `${hims_d_hospital_id}` }
      : {};
  const leveles = level !== undefined ? { level: level } : {};
  const hasEmpId =
    employee_id !== undefined
      ? {
          "meta.employee_id":
            typeof employee_id === "string"
              ? parseInt(employee_id)
              : employee_id
        }
      : {};

  const input = {
    ...createMessage,
    timestamp: {
      $gte: moment(from_date).startOf("day"),
      $lte: moment(to_date).endOf("day")
    },
    ...leveles,
    ...hasEmpId
  };
  loggerPreferences
    .find(input)
    .then(result => {
      res.status(200).json({
        success: true,
        records: result
      });
    })
    .catch(error => {
      res.status(400).json({
        success: false,
        message: error
      });
    });
}
