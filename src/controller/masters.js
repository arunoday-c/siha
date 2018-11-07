import {
  titleMaster,
  countryMaster,
  stateMaster,
  cityMaster,
  relegionMaster,
  nationalityMaster,
  autoGenMaster,
  visaMaster,
  clinicalNonClinicalAll,
  countryStateCity,
  killDbConnections
} from "../model/masters";
import { Router } from "express";
import { releaseConnection, bulkMasters } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import path from "path";
import fs from "fs";
import { getCacheData, setCacheData } from "../utils/caching";
import { saveImageInTemp, showFile } from "../utils/images";
import { getFormula } from "../model/algaeh_formulas";
export default () => {
  let api = Router();

  api.get("/algaehFormula", getFormula, (req, res, next) => {
    const _recordds = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: _recordds.length > 0 ? _recordds[0] : {}
    });
  });

  api.post("/imageSave", saveImageInTemp);
  api.get("/getFile", showFile);
  api.get(
    "/subDeptClinicalNonClinicalAll",
    (req, res, next) => {
      getCacheData({ key: "subDeptClinicalNonClinicalAll" }, result => {
        if (result != null) {
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
        } else {
          next();
        }
      });
    },
    clinicalNonClinicalAll,
    (req, res, next) => {
      let result = req.records;
      setCacheData(
        {
          key: "subDeptClinicalNonClinicalAll",
          value: result
        },
        resultData => {
          res.status(httpStatus.ok).json({
            success: true,
            records: resultData
          });
          next();
        }
      );
    },
    releaseConnection
  );

  api.get(
    "/visa",
    (req, res, next) => {
      getCacheData({ key: "visa" }, result => {
        if (result != null) {
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
        } else {
          next();
        }
      });
    },
    visaMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheData(
        {
          key: "visa",
          value: result
        },
        resultData => {
          res.status(httpStatus.ok).json({
            success: true,
            records: resultData
          });
          next();
        }
      );
    },
    releaseConnection
  );

  api.get(
    "/title",
    (req, res, next) => {
      getCacheData({ key: "title" }, result => {
        if (result != null) {
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
        } else {
          next();
        }
      });
    },
    titleMaster,
    (req, res, next) => {
      let result = req.records;

      setCacheData(
        {
          key: "title",
          value: result
        },
        resultData => {
          res.status(httpStatus.ok).json({
            success: true,
            records: resultData
          });
          next();
        }
      );
    },
    releaseConnection
  );
  api.get(
    "/country",
    countryMaster,
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
    "/state",
    stateMaster,
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
    "/city",
    cityMaster,
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
    "/countryStateCity",
    (req, res, next) => {
      const masterDir = path.join(
        __dirname,
        "../../Masters/countryStateCity.json"
      );
      if (fs.existsSync(masterDir)) {
        res.status(httpStatus.ok).json({
          records: JSON.parse(fs.readFileSync(masterDir)),
          success: true
        });
      } else {
        countryStateCity(req, res, next);
      }
    },
    (req, res, next) => {
      let result;
      if (req.records != null) {
        if (req.records.length != 0) {
          result = new LINQ(req.records[0])
            .SelectMany(items => {
              return {
                hims_d_country_id: items.hims_d_country_id,
                country_name: items.country_name,
                arabic_country_name: items.arabic_country_name,
                states: new LINQ(req.records[1])
                  .Where(state => state.country_id == items.hims_d_country_id)
                  .Select(s => {
                    return {
                      hims_d_state_id: s.hims_d_state_id,
                      state_name: s.state_name,
                      country_id: s.country_id,
                      cities: new LINQ(req.records[2])
                        .Where(c => c.state_id == s.hims_d_state_id)
                        .ToArray()
                    };
                  })
                  .ToArray()
              };
            })
            .ToArray();
        }
        bulkMasters("countryStateCity", result);
        res.status(httpStatus.ok).json({
          records: result,
          success: true
        });
        next();
      }
    },
    releaseConnection
  );
  api.get(
    "/relegion",
    (req, res, next) => {
      getCacheData({ key: "relegion" }, result => {
        if (result != null) {
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
        } else {
          next();
        }
      });
    },
    relegionMaster,
    (req, res, next) => {
      let result = req.records;

      setCacheData(
        {
          key: "relegion",
          value: result
        },
        resultData => {
          res.status(httpStatus.ok).json({
            success: true,
            records: resultData
          });
          next();
        }
      );
    },
    releaseConnection
  );

  api.get(
    "/nationality",
    (req, res, next) => {
      getCacheData({ key: "nationality" }, result => {
        if (result != null) {
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
        } else {
          next();
        }
      });
    },
    nationalityMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheData(
        {
          key: "nationality",
          value: result
        },
        resultData => {
          res.status(httpStatus.ok).json({
            success: true,
            records: resultData
          });
          next();
        }
      );
    },
    releaseConnection
  );
  api.get(
    "/autogen",
    autoGenMaster,
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
    "/killDbConnections",
    killDbConnections,
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
