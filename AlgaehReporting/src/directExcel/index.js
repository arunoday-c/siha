import { generateExcelDilyTrans } from "./dailytransaction";

export default function excelRouting(req, res, next) {
  try {
    const { report } = req.query;
    const reportJson = JSON.parse(report);
    const { displayName, reportName, reportParams } = reportJson;
    let parameters = {};
    for (let i = 0; i < reportParams.length; i++) {
      const { name, value, label, labelValue } = reportParams[i];
      parameters = {
        ...parameters,
        [name]: value,
        ["disp_" + name]: label,
        ["dis_val_" + name]: labelValue,
      };
    }

    req.query = { ...parameters, displayName, reportName };

    switch (reportName) {
      case "DailyTransaction":
        generateExcelDilyTrans(req, res, next);
        break;
    }
  } catch (e) {
    next(e);
  }
}
