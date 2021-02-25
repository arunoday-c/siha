import { Router } from "express";
import utlities from "algaeh-utilities";
import finance, { getSalesOrderAndPersonId } from "../models/finance";
import {
  getYearEndData,
  getAccountsForYearEnd,
  getYearEndingDetails,
  getSelectedAccountDetails,
  processYearEnd,
  validateYearEndProcess,
} from "../models/finance_year_ending";
//Add voucher for YearEnd
import voucher from "../models/voucher";
const { addVoucher } = voucher;
const {
  getAccountHeads,
  addAccountHeads,
  getFinanceAccountsMaping,
  updateFinanceAccountsMaping,
  getDayEndData,
  postDayEndData,
  removeAccountHead,
  previewDayEndEntries,
  getAccountHeadsForDropdown,
  getLedgerDataForChart,
  renameAccountHeads,
  getOpeningBalance,
  getCildLedgers,
  revertDayEnd,
  getFinanceAccountMapingSingle,
  SaveNarration,
} = finance;

export default () => {
  const api = Router();

  api.get("/getAccountHeads", getAccountHeads, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.post("/addAccountHeads", addAccountHeads, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          result: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.get(
    "/getFinanceAccountsMaping",
    getFinanceAccountsMaping,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.get(
    "/getFinanceAccountMapingSingle",
    getFinanceAccountMapingSingle,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.post(
    "/updateFinanceAccountsMaping",
    updateFinanceAccountsMaping,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.get("/getDayEndData", getDayEndData, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.post("/postDayEndData", postDayEndData, (req, res, next) => {
    if (
      req.records.invalid_input == true &&
      req.records.invalid_input != undefined
    ) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.put(
    "/revertDayEnd",
    revertDayEnd,
    getSalesOrderAndPersonId,
    (req, res, next) => {
      const notificationDetails = req.notificationDetails
        ? { notificationDetails: req.notificationDetails }
        : {};
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
          ...notificationDetails,
        })
        .end();
    }
  );

  api.delete("/removeAccountHead", removeAccountHead, (req, res, next) => {
    if (
      req.records.invalid_input == true &&
      req.records.invalid_input != undefined
    ) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.get("/previewDayEndEntries", previewDayEndEntries, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });

  api.get(
    "/getAccountHeadsForDropdown",
    getAccountHeadsForDropdown,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.get("/getLedgerDataForChart", getLedgerDataForChart, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.put("/renameAccountHeads", renameAccountHeads, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.get("/getOpeningBalance", getOpeningBalance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.get("/getCildLedgers", getCildLedgers, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  });
  api.get("/getAccountsForYearEnd", getAccountsForYearEnd, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        records: req.records,
      })
      .end();
  });
  api.get("/getYearEndingDetails", getYearEndingDetails, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        ...req.records,
      })
      .end();
  });
  api.get(
    "/getSelectedAccountDetails",
    getSelectedAccountDetails,
    (req, res) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          ...req.records,
        })
        .end();
    }
  );
  api.post(
    "/processYearEnd",
    validateYearEndProcess,
    addVoucher,
    processYearEnd,
    (req, res) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          ...req.records,
        })
        .end();
    }
  );
  api.post("/getYearEndData", getYearEndData, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        ...req.records,
      })
      .end();
  });

  api.post("/SaveNarration", SaveNarration, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  return api;
};
