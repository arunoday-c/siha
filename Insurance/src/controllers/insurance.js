import { Router } from "express";
import utlities from "algaeh-utilities";
import insuranceModels from "../models/insurance";

const {
  addPatientInsuranceData,
  getListOfInsuranceProvider,
  getSubInsurance,
  addInsuranceProvider,
  updateInsuranceProvider,
  addSubInsuranceProvider,
  updateSubInsuranceProvider,
  addNetwork,
  NetworkOfficeMaster,
  addPlanAndPolicy,
  deleteSubInsurance,
  getPriceList,
  getPolicyPriceList,
  getNetworkAndNetworkOfficRecords,
  updatePriceList,
  updateNetworkAndNetworkOffice,
  updatePriceListBulk,
  deleteNetworkAndNetworkOfficRecords,
  getInsuranceProviders,

  getFinanceInsuranceProviders,
} = insuranceModels;

export default () => {
  let api = Router();

  api.post(
    "/addPatientInsurance",
    addPatientInsuranceData,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.get(
    "/getListOfInsuranceProvider",
    getListOfInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.get("/getSubInsurance", getSubInsurance, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addInsuranceProvider", addInsuranceProvider, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put(
    "/updateInsuranceProvider",
    updateInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.post(
    "/addSubInsuranceProvider",
    addSubInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.put(
    "/updateSubInsuranceProvider",
    updateSubInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.post("/addNetwork", addNetwork, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/NetworkOfficeMaster", NetworkOfficeMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addPlanAndPolicy", addPlanAndPolicy, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.delete("/deleteSubInsurance", deleteSubInsurance, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPriceList", getPriceList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPolicyPriceList", getPolicyPriceList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get(
    "/getNetworkAndNetworkOfficRecords",
    getNetworkAndNetworkOfficRecords,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.put("/updatePriceList", updatePriceList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put(
    "/updateNetworkAndNetworkOffice",
    updateNetworkAndNetworkOffice,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.put("/updatePriceListBulk", updatePriceListBulk, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put(
    "/deleteNetworkAndNetworkOfficRecords",
    deleteNetworkAndNetworkOfficRecords,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.get("/getInsuranceProviders", getInsuranceProviders, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get(
    "/getFinanceInsuranceProviders",
    getFinanceInsuranceProviders,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  return api;
};
