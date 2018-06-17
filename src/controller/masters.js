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
  countryStateCity
} from "../model/masters";
import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
export default () => {
  let api = Router();

  api.get(
    "/subDeptClinicalNonClinicalAll",
    clinicalNonClinicalAll,
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
    "/visa",
    visaMaster,
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
    "/title",
    titleMaster,
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
    countryStateCity,
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
    relegionMaster,
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
    "/nationality",
    nationalityMaster,
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
  return api;
};
