import { Router } from "express";
import utlities from "algaeh-utilities";
import financeReports from "../models/financeReports";
const accountNameWidth = 63;
const accountNameArabicWidth = 63;
const amountWidth = 15;
const {
  getBalanceSheet,
  getProfitAndLoss,
  getTrialBalance,
  getAccountReceivableAging,
  getAccountPayableAging,
  getProfitAndLossCostCenterWise,
  getProfitAndLossMonthWise
} = financeReports;
import { generateExcel } from "../excels/index";
export default () => {
  const api = Router();

  api.get(
    "/getBalanceSheet",
    getBalanceSheet,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Balance Sheet";
          req.sheetName = "Balance Sheet";
          req.columns = [
            {
              header: "Account Name",
              key: "title",
              width: accountNameWidth
            },
            {
              header: "Arabic Name",
              key: "arabic_name",
              width: accountNameArabicWidth
            },
            {
              header: "Amount",
              key: "subtitle",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );

  api.get(
    "/getProfitAndLoss",
    getProfitAndLoss,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Profit and Loss";
          req.sheetName = "Profit and Loss";
          req.columns = [
            {
              header: "Account Name",
              key: "title",
              width: accountNameWidth
            },
            {
              header: "Arabic Name",
              key: "arabic_name",
              width: accountNameArabicWidth
            },
            {
              header: "Amount",
              key: "subtitle",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );
  api.get(
    "/getTrialBalance",
    getTrialBalance,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Balance Sheet";
          req.sheetName = "Balance Sheet";
          req.columns = [
            {
              key: "title",
              width: accountNameWidth
            },
            {
              key: "tr_debit_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              key: "tr_credit_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          req.noPlotCloumn = true;
          req.excelHeader = worksheet => {
            worksheet.columns = [
              { header: "Particulars", width: accountNameWidth },
              { header: "Closing Balance", width: amountWidth + amountWidth }
            ];
            const lastRow = worksheet.rowCount;
            let row = worksheet.getRow(lastRow);
            const fonts = {
              name: "Arial",
              size: 9,
              bold: true
            };
            const fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFFF00" }
            };
            const alignment = { vertical: "middle", horizontal: "center" };
            const border = {
              right: { style: "thin", color: { argb: "00000000" } },
              top: { style: "thin", color: { argb: "00000000" } },
              left: { style: "thin", color: { argb: "00000000" } },
              bottom: { style: "thin", color: { argb: "00000000" } }
            };
            row.font = fonts;
            row.eachCell((cell, index) => {
              cell.fill = fill;
              cell.font = fonts;
              cell.alignment = alignment;
            });

            worksheet.mergeCells(`B${lastRow}:C${lastRow}`);
            worksheet.addRow(["", "Debit", "Credit"]);
            worksheet.mergeCells(`A${lastRow}:A${lastRow + 1}`);
            const colB = worksheet.getCell(`B${lastRow + 1}`);
            colB.border = border;
            colB.font = fonts;
            colB.fill = fill;
            colB.alignment = alignment;
            const colC = worksheet.getCell(`C${lastRow + 1}`);
            colC.border = border;
            colC.font = fonts;
            colC.fill = fill;
            colC.alignment = alignment;
          };
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );

  api.get(
    "/getAccountReceivableAging",
    getAccountReceivableAging,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;

        if (excel === "true") {
          req.reportName = "Account Receivable Aging Report";
          req.sheetName = "Account Receivable Aging Report";

          req.records = req.records.data;

          req.columns = [
            {
              header: "Customer",
              key: "customer",
              width: accountNameWidth,
              manual: true,
              others: {
                font: {
                  name: "Arial",
                  size: 9,
                  bold: true
                }
              }
            },
            {
              header: "Current",
              key: "todays_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "1 - 30",
              key: "thirty_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "31 - 60",
              key: "sixty_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "61 - 90",
              key: "ninety_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "91 and over",
              key: "above_ninety_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "Total",
              key: "balance",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );

  api.get(
    "/getAccountPayableAging",
    getAccountPayableAging,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Account Payable Aging Report";
          req.sheetName = "Account Payable Aging Report";
          req.records = req.records.data;
          req.columns = [
            {
              header: "Vender",
              key: "customer",
              width: accountNameWidth,
              manual: true,
              others: {
                font: {
                  name: "Arial",
                  size: 9,
                  bold: true
                }
              }
            },
            {
              header: "Current",
              key: "todays_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "1 - 30",
              key: "thirty_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "31 - 60",
              key: "sixty_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "61 - 90",
              key: "ninety_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "91 and over",
              key: "above_ninety_days_amount",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            },
            {
              header: "Total",
              key: "balance",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );
  api.get(
    "/getProfitAndLossCostCenterWise",
    getProfitAndLossCostCenterWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Profit and Loss Cost Center Wise";
          req.sheetName = "Profit and Loss Cost Center Wise";
          const { cost_centers, income, expense } = req.records;

          req.columns = cost_centers.map(item => {
            return {
              header: item.cost_center,
              key: item.cost_center_id,
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            };
          });
          req.columns.unshift({
            header: "Ledger Name",
            key: "label",
            width: accountNameWidth
          });
          req.records = { income, expense };
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );

  api.get(
    "/getProfitAndLossMonthWise",
    getProfitAndLossMonthWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Profit and Loss By Year";
          req.sheetName = "Profit and Loss By Year";
          const { months, income, expense } = req.records;

          req.columns = months.map(item => {
            return {
              header: item.month_name,
              key: item.month_no,
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            };
          });
          req.columns.unshift({
            header: "Ledger Name",
            key: "label",
            width: accountNameWidth
          });
          req.records = { income, expense };
          next();
        } else {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              result: req.records
            })
            .end();
        }
      }
    },
    generateExcel
  );
  return api;
};
