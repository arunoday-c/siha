import { Router } from "express";
import utlities from "algaeh-utilities";
import voucher, { verifyInvoicePenForAuth } from "../models/voucher";

const {
  addVoucher,
  getVoucherNo,
  authorizeVoucher,
  getVouchersToAuthorize,
  getVouchersDetailsToAuthorize,
  getVouchersDetailsToAdjust,
  getUnSettledInvoices,
  updateVoucher
} = voucher;

export default () => {
  const api = Router();

  api.post("/addVoucher", addVoucher, (req, res, next) => {
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
  api.post("/updateVoucher", updateVoucher, (req, res, next) => {
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

  api.get("/getVoucherNo", getVoucherNo, (req, res, next) => {
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

  api.post("/authorizeVoucher", authorizeVoucher, (req, res, next) => {
    if (req.records.invalid_user == true) {
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
  api.get(
    "/getVouchersToAuthorize",
    getVouchersToAuthorize,
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
  api.get(
    "/getVouchersDetailsToAuthorize",
    getVouchersDetailsToAuthorize,
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
  api.get(
    "/getVouchersDetailsToAdjust",
    getVouchersDetailsToAdjust,
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
  api.get("/getUnSettledInvoices", getUnSettledInvoices, (req, res, next) => {
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
  api.post("/verifyInvoicePenForAuth", verifyInvoicePenForAuth, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().internalServer)
      .json({
        success: true,
        message: "Can Proceed..",
      })
      .end();
  });
  return api;
};
