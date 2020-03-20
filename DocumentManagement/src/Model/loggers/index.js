import loggerPreferences from "./loggerSchema";
import moment from "moment";
export function getLogs(req, res, next) {
  const {
    hims_d_hospital_id,
    from_date,
    to_date,
    employee_id,
    user_id,
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
    employee_id !== undefined
      ? { message: `${user_id}/${employee_id}/${hims_d_hospital_id}` }
      : {};
  const leveles = level !== undefined ? { level: level } : {};
  const input = {
    ...createMessage,
    timestamp: {
      $gte: moment(from_date).startOf("day"),
      $lte: moment(to_date).endOf("day")
    },
    ...leveles
  };

  loggerPreferences
    .find(input)
    .then(result => {
      const records = result.map(item => {
        const { level, meta } = item;
        let { dateTime, requestIdentity, requestUrl, requestMethod } = meta;
        requestIdentity = requestIdentity === undefined ? {} : requestIdentity;
        let { requestClient, reqUserIdentity } = requestIdentity;
        reqUserIdentity = reqUserIdentity === undefined ? {} : reqUserIdentity;
        const { full_name, role_name } = reqUserIdentity;
        let client = "";
        if (typeof requestClient !== "string") {
          const { mac, name, address } = requestClient;
          client = `Mac:${mac},Ip:${address},machine:${name}`;
        } else {
          client = requestClient;
        }
        let url = requestUrl;
        if (requestMethod === "GET") {
          url = requestUrl.split("?")[0];
        }
        return {
          level,
          dateTime,
          url: url,
          method: requestMethod,
          name: full_name,
          role: role_name,
          machine_details: client
        };
      });

      res.status(200).json({
        success: true,
        records: records
      });
    })
    .catch(error => {
      res.status(400).json({
        success: false,
        message: error
      });
    });
}
