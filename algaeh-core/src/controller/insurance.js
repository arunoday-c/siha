import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import insuranceModels from "../model/insurance";

const {
  getPatientInsurance,
  addPatientInsurance,
  getListOfInsuranceProvider,
  addInsuranceProvider,
  updateInsuranceProvider,
  addSubInsuranceProvider,
  updateSubInsuranceProvider,
  getSubInsurance,
  deleteSubInsurance,
  addNetwork,
  NetworkOfficeMaster,
  addPlanAndPolicy,
  getPriceList,
  getPolicyPriceList,
  getNetworkAndNetworkOfficRecords,
  updatePriceList,
  updateNetworkAndNetworkOffice,
  updatePriceListBulk,
  deleteNetworkAndNetworkOfficRecords,
  getInsuranceProviders,
  getSubInsuraces
} = insuranceModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to fetch insurence based on patient id
  api.get(
    "/getPatientInsurance",
    getPatientInsurance,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by nowshad : to fetch sub insurence
  api.get(
    "/getSubInsurance",
    getSubInsurance,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to save insurence of patient in DB
  api.post(
    "/addPatientInsurance",
    addPatientInsurance,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to get all insurence provider  company details
  api.get(
    "/getListOfInsuranceProvider",
    getListOfInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to add insurence provider
  api.post(
    "/addInsuranceProvider",
    addInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to update insurence provider
  api.put(
    "/updateInsuranceProvider",
    updateInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to add SUB-insurence provider
  api.post(
    "/addSubInsuranceProvider",
    addSubInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to update SUB-insurence provider
  api.put(
    "/updateSubInsuranceProvider",
    updateSubInsuranceProvider,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to add network(insurence plan)
  api.post(
    "/addNetwork",
    addNetwork,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan : to add network office(insurence policy)
  api.post(
    "/NetworkOfficeMaster",
    NetworkOfficeMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan: to add  both network and network office(insurence plan master)
  api.post(
    "/addPlanAndPolicy",
    addPlanAndPolicy,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan: to delete sub insurance
  api.delete(
    "/deleteSubInsurance",
    deleteSubInsurance,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Noushad : to get all price list of selected insurance
  api.get(
    "/getPriceList",
    getPriceList,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getPolicyPriceList",
    getPolicyPriceList,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );
  // created by irfan : to get list of network and its network_office records
  // based on insuranceProvider id
  api.get(
    "/getNetworkAndNetworkOfficRecords",
    getNetworkAndNetworkOfficRecords,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updatePriceList",
    updatePriceList,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );

  // created by irfan : to  update Network And NetworkOffice
  api.put(
    "/updateNetworkAndNetworkOffice",
    updateNetworkAndNetworkOffice,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad : to  update bulk Services price list
  api.put(
    "/updatePriceListBulk",
    updatePriceListBulk,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad : to  update bulk Services price list
  api.put(
    "/deleteNetworkAndNetworkOfficRecords",
    deleteNetworkAndNetworkOfficRecords,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan
  api.get("/getInsuranceProviders", getInsuranceProviders, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    next();
  });

  //created by Adnan
  api.get("/getSubInsuraces", getSubInsuraces, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
