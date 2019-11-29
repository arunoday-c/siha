//Connection Done
import { Router } from "express";
import utlities from "algaeh-utilities";
import masterModels from "../model/masters";
import caching from "../utils/caching";
import path from "path";
import fs from "fs";
import { LINQ } from "node-linq";
import formulas from "../model/algaeh_formulas";

const { getFormula } = formulas;
const { getCacheData, setCacheData } = caching;
import {
  getCacheMasters,
  setCacheMasters
} from "algaeh-utilities/checksecurity";
// const { bulkMasters } = utils;
const {
  titleMaster,
  countryMaster,
  stateMaster,
  cityMaster,
  relegionMaster,
  countryStateCity,
  nationalityMaster,
  autoGenMaster,
  visaMaster,
  clinicalNonClinicalAll,
  killDbConnections
} = masterModels;

export default () => {
  const api = Router();

  api.get("/algaehFormula", getFormula, (req, res, next) => {
    const _recordds = req.records;
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: _recordds.length > 0 ? _recordds[0] : {}
      })
      .end();
  });

  // api.get(
  //   "/title",
  //   (req, res, next) => {
  //     getCacheData({ key: "title" }, result => {
  //       if (result != null) {
  //         res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //           success: true,
  //           records: result
  //         });
  //       } else {
  //         next();
  //       }
  //     });
  //   },
  //   titleMaster,
  //   (req, res, next) => {
  //     let result = req.records;
  //
  //     setCacheData(
  //       {
  //         key: "title",
  //         value: result
  //       },
  //       resultData => {
  //         res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //           success: true,
  //           records: resultData
  //         });
  //         next();
  //       }
  //     );
  //   }
  // );

  api.get(
    "/title",
    (req, res, next) => {
      getCacheMasters("title")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    titleMaster,
    (req, res) => {
      let result = req.records;
      setCacheMasters("title", result);
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();

      //   next();
    }
  );

  api.get(
    "/country",
    (req, res, next) => {
      getCacheMasters("country")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    countryMaster,
    (req, res) => {
      let result = req.records;
      setCacheMasters("country", result);

      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();

      // next();
    }
  );

  api.get(
    "/state",
    (req, res, next) => {
      getCacheMasters("state")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    stateMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("state", result);
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      // next();
    }
  );

  api.get(
    "/city",
    (req, res, next) => {
      getCacheMasters("city")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    cityMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("city", result);
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      // next();
    }
  );

  api.get(
    "/relegion",
    (req, res, next) => {
      getCacheMasters("relegion")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    relegionMaster,
    (req, res, next) => {
      setCacheMasters("relegion", req.records)
        .then(result => {
          res
            .status(utlities.AlgaehUtilities().httpStatus().ok)
            .json({
              success: true,
              records: result
            })
            .end();
        })
        .catch(error => {
          next(error);
        });
    }
    // (req, res, next) => {
    //   let result = req.records;

    //   setCacheData(
    //     {
    //       key: "relegion",
    //       value: result
    //     },
    //     resultData => {
    //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
    //         success: true,
    //         records: resultData
    //       });
    //       next();
    //     }
    //   );
    // }
  );

  // api.get(
  //   "/countryStateCity",
  //   (req, res, next) => {
  //     const masterDir = path.join(
  //       __dirname,
  //       "../../Masters/countryStateCity.json"
  //     );
  //     if (fs.existsSync(masterDir)) {
  //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //         records: JSON.parse(fs.readFileSync(masterDir)),
  //         success: true
  //       });
  //     } else {
  //       countryStateCity(req, res, next);
  //     }
  //   },
  //   (req, res, next) => {
  //     let result;
  //     if (req.records != null) {
  //       if (req.records.length != 0) {
  //         result = new LINQ(req.records[0])
  //           .SelectMany(items => {
  //             return {
  //               hims_d_country_id: items.hims_d_country_id,
  //               country_name: items.country_name,
  //               arabic_country_name: items.arabic_country_name,
  //               states: new LINQ(req.records[1])
  //                 .Where(state => state.country_id == items.hims_d_country_id)
  //                 .Select(s => {
  //                   return {
  //                     hims_d_state_id: s.hims_d_state_id,
  //                     state_name: s.state_name,
  //                     country_id: s.country_id,
  //                     cities: new LINQ(req.records[2])
  //                       .Where(c => c.state_id == s.hims_d_state_id)
  //                       .ToArray()
  //                   };
  //                 })
  //                 .ToArray()
  //             };
  //           })
  //           .ToArray();
  //       }
  //       // bulkMasters("countryStateCity", result);
  //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //         records: result,
  //         success: true
  //       });
  //       next();
  //     }
  //   }
  // );

  api.get(
    "/countryStateCity",
    (req, res, next) => {
      getCacheMasters("countryStateCity")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
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
          setCacheMasters("countryStateCity", result);
        }
        // bulkMasters("countryStateCity", result);
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            records: result,
            success: true
          })
          .end();
        // next();
      }
    }
  );

  api.get(
    "/nationality",

    // (req, res, next) => {
    //   getCacheData({ key: "nationality" }, result => {
    //     if (result != null) {
    //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
    //         success: true,
    //         records: result
    //       });
    //     } else {
    //       next();
    //     }
    //   });
    // },
    (req, res, next) => {
      getCacheMasters("nationality")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    nationalityMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("nationality", result);
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      // setCacheData(
      //   {
      //     key: "nationality",
      //     value: result
      //   },
      //   resultData => {
      //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      //       success: true,
      //       records: resultData
      //     });
      //     next();
      //   }
      // );
    }
  );

  api.get("/autogen", autoGenMaster, (req, res, next) => {
    let result = req.records;
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: result
      })
      .end();
    // next();
  });

  api.get(
    "/visa",
    (req, res, next) => {
      getCacheMasters("visa")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    // (req, res, next) => {
    //   getCacheData({ key: "visa" }, result => {
    //     if (result != null) {
    //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
    //         success: true,
    //         records: result
    //       });
    //     } else {
    //       next();
    //     }
    //   });
    // },
    visaMaster,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("visa", result);
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      // setCacheData(
      //   {
      //     key: "visa",
      //     value: result
      //   },
      //   resultData => {
      //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      //       success: true,
      //       records: resultData
      //     });
      //     next();
      //   }
      // );
    }
  );

  api.get(
    "/subDeptClinicalNonClinicalAll",
    (req, res, next) => {
      getCacheMasters("subDeptClinicalNonClinicalAll")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },

    // (req, res, next) => {
    //   getCacheData({ key: "subDeptClinicalNonClinicalAll" }, result => {
    //     if (result != null) {
    //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
    //         success: true,
    //         records: result
    //       });
    //     } else {
    //       next();
    //     }
    //   });
    // },
    clinicalNonClinicalAll,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("subDeptClinicalNonClinicalAll", result);
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      // setCacheData(
      //   {
      //     key: "subDeptClinicalNonClinicalAll",
      //     value: result
      //   },
      //   resultData => {
      //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      //       success: true,
      //       records: resultData
      //     });
      //     next();
      //   }
      // );
    }
  );

  api.get("/killDbConnections", killDbConnections, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
