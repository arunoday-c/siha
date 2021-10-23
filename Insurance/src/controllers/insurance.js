import { Router } from "express";
import utlities from "algaeh-utilities";
import insuranceModels, {
  saveMultiStatement,
  getInsuranceStatement,
  updateInsuranceStatement,
  getInvoiceDetails,
  generateAccountingEntry,
  closeStatement,
  ChangeOfInsuranceInvoice,
} from "../models/insurance";
import { generateInsuranceStatement } from "../models/insuranceStatement";
import {
  bulkUpdatePortalSetup,
  syncPortalServices,
} from "../models/bulkUpdatePortalSetup";
const {
  addPatientInsuranceData,
  getListOfInsuranceProvider,
  getSubInsurance,
  getSubInsuranceMulti,
  getSubInsuranceGrid,
  getPortalExists,
  updatePortalExists,
  // addOrUpdatePortalSetup,
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
  verifyUserIdExist,
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

  api.post(
    "/addOrUpdatePortalSetup",
    bulkUpdatePortalSetup,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getPortalExists", getPortalExists, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
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

  api.put("/updatePortalExists", updatePortalExists, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/verifyUserIdExist", verifyUserIdExist, (req, res, next) => {
    const exists = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: exists,
      message:
        exists === false
          ? `User id is already exists please use another id`
          : "",
    });
    next();
  });
  api.get("/getSubInsurance", getSubInsurance, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getSubInsuranceMulti", getSubInsuranceMulti, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getSubInsuranceGrid", getSubInsuranceGrid, (req, res, next) => {
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

      if (result.invalid_data == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: result,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result,
        });
      }
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
  api.get("/getInsuranceStatement", getInsuranceStatement, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getInvoiceDetails", getInvoiceDetails, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put(
    "/updateInsuranceStatement",
    updateInsuranceStatement,
    (req, res, next) => {
      // let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        message: "Succesfull",
        // records: result,
      });
      next();
    }
  );
  api.post(
    "/saveMultiStatement",
    saveMultiStatement,
    generateAccountingEntry,
    (req, res) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
      next();
    }
  );

  api.put("/ChangeOfInsuranceInvoice", ChangeOfInsuranceInvoice, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
    next();
  });

  api.put("/closeStatement", closeStatement, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/generateInsuranceStatement", generateInsuranceStatement);
  api.post("/syncServicesToPortal", syncPortalServices);
  return api;
};
