import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addAlgaehGroupMAster,
  addAlgaehRoleMAster,
  addAlgaehModule,
  getRoleBaseActiveModules,
  getRoleBaseInActiveComponents,
  getAlgaehModules,
  getAlgaehScreens,
  addAlgaehScreen,
  addAlgaehComponent,
  getAlgaehComponents,
  addAlgaehScreenElement,
  getAlgaehScreenElement,
  getFormulas,
  addFormula,
  updateFormula,
  deleteFormula
} from "../model/algaehMasters";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post(
    "/addAlgaehGroupMAster",
    addAlgaehGroupMAster,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    },
    releaseConnection
  );
  // created by irfan :to add
  api.post(
    "/addAlgaehRoleMAster",
    addAlgaehRoleMAster,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    },
    releaseConnection
  );

  // created by irfan :to add
  api.post(
    "/addAlgaehModule",
    addAlgaehModule,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    },
    releaseConnection
  );

  // created by irfan :to
  api.get(
    "/getRoleBaseActiveModules",
    getRoleBaseActiveModules,
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

  // created by irfan :to add
  api.get(
    "/getRoleBaseInActiveComponents",
    getRoleBaseInActiveComponents,
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

  // created by irfan :
  api.get(
    "/getAlgaehModules",
    getAlgaehModules,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.get(
    "/getAlgaehScreens",
    getAlgaehScreens,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );
  // created by irfan :
  api.post(
    "/addAlgaehScreen",
    addAlgaehScreen,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.post(
    "/addAlgaehComponent",
    addAlgaehComponent,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );
  // created by irfan :
  api.get(
    "/getAlgaehComponents",
    getAlgaehComponents,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );
  // created by irfan :
  api.post(
    "/addAlgaehScreenElement",
    addAlgaehScreenElement,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );
  // created by irfan :
  api.get(
    "/getAlgaehScreenElement",
    getAlgaehScreenElement,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.get(
    "/getFormulas",
    getFormulas,
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

  // created by irfan :
  api.post(
    "/addFormula",
    addFormula,
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

  // created by irfan :
  api.put(
    "/updateFormula",
    updateFormula,
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

  // created by irfan :
  api.delete(
    "/deleteFormula",
    deleteFormula,
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

  return api;
};
