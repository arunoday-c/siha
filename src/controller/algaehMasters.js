import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addAlgaehGroupMAster,
  updateAlgaehGroupMAster,
  deleteAlgaehGroupMAster,
  addAlgaehRoleMAster,
  updateAlgaehRoleMAster,
  deleteAlgaehRoleMAster,
  addAlgaehModule,
  getRoleBaseActiveModules, //Done
  getRoleBaseInActiveComponents, //Done
  getAlgaehModules,
  getAlgaehScreens,
  addAlgaehScreen,
  updateAlgaehScreen,
  deleteAlgaehScreen,
  addAlgaehComponent,
  getAlgaehComponents,
  addAlgaehScreenElement,
  getAlgaehScreenElement,
  getFormulas,
  addFormula,
  updateFormula,
  deleteFormula,
  deleteScreenForRole,
  deleteModuleForRole,
  assignScreens,
  assignComponents,
  updateAlgaehModules,
  deleteUserLogin,
  method1
} from "../model/algaehMasters";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post("/addAlgaehGroupMAster", addAlgaehGroupMAster, (req, res, next) => {
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
  });

  // created by irfan :to add
  api.put(
    "/updateAlgaehGroupMAster",
    updateAlgaehGroupMAster,
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
    }
  );
  // created by irfan :to add
  api.delete(
    "/deleteAlgaehGroupMAster",
    deleteAlgaehGroupMAster,
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
    }
  );

  // created by irfan :to add
  api.post("/addAlgaehRoleMAster", addAlgaehRoleMAster, (req, res, next) => {
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
  });

  // created by irfan :to add
  api.put(
    "/updateAlgaehRoleMAster",
    updateAlgaehRoleMAster,
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
    }
  );
  // created by irfan :to add
  api.delete(
    "/deleteAlgaehRoleMAster",
    deleteAlgaehRoleMAster,
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
    }
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
    }
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
    }
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

  // created by irfan :to delete a screen for a role
  api.delete(
    "/deleteScreenForRole",
    deleteScreenForRole,
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

  // created by irfan :to delete a module with all secreens for a role
  api.delete(
    "/deleteModuleForRole",
    deleteModuleForRole,
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
  api.post(
    "/assignScreens",
    assignScreens,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
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
    "/assignComponents",
    assignComponents,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
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

  api.put("/updateAlgaehModules", updateAlgaehModules, (req, res, next) => {
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
  });

  api.put("/updateAlgaehScreen", updateAlgaehScreen, (req, res, next) => {
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
  });

  api.delete("/deleteAlgaehScreen", deleteAlgaehScreen, (req, res, next) => {
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
  });
  api.delete("/deleteUserLogin", deleteUserLogin, (req, res, next) => {
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
  });

  api.post("/method1", method1, (req, res, next) => {
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
  });

  return api;
};
