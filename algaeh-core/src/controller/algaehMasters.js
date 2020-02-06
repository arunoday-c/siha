import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

import masterModels from "../model/algaehMasters";
const {
  addAlgaehGroupMAster,
  updateAlgaehGroupMAster,
  deleteAlgaehGroupMAster,
  addAlgaehRoleMAster,
  updateAlgaehRoleMAster,
  deleteAlgaehRoleMAster,
  addAlgaehModule,
  deleteAlgaehModule,
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
  getHrmsAuthLevels,
  addLisMachineConfiguration,
  getLisMachineConfiguration,
  updateLisMachineConfiguration,
  getAlgaehScreensWithModules,
  getAlgaehComponentsWithScreens,
  moduleScreenAssignment,
  getComponentsForScreen,
  assignComponentScreenPermissions,
  getScreensWithComponents,
  addScreensAndComponents,
  getCurrentAssignedScreenAndComponent
} = masterModels;
const { releaseConnection } = utils;

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

  api.delete("/deleteAlgaehModule", deleteAlgaehModule, (req, res) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      message: "Successfully Deleted...."
    });
  });

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

  api.get(
    "/getAlgaehScreensWithModules",
    getAlgaehScreensWithModules,
    (req, res) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      delete req.records;
    }
  );
  api.get(
    "/getAlgaehComponentsWithScreens",
    getAlgaehComponentsWithScreens,
    (req, res) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      delete req.records;
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

  api.get("/getComponentsForScreen", getComponentsForScreen, (req, res) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    delete req.records;
  });

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

  api.post(
    "/assignComponentScreenPermissions",
    assignComponentScreenPermissions,
    (req, res) => {
      res.status(httpStatus.ok).json({
        success: true,
        message: "Successfully updated"
      });
    }
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

  api.post(
    "/moduleScreenAssignment",
    moduleScreenAssignment,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        message: "Successfully updated"
      });

      next();
    }
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

  api.get("/getHrmsAuthLevels", getHrmsAuthLevels, (req, res, next) => {
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

  api.post(
    "/addLisMachineConfiguration",
    addLisMachineConfiguration,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });

      next();
    }
  );

  api.get(
    "/getLisMachineConfiguration",
    getLisMachineConfiguration,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });

      next();
    }
  );

  api.put(
    "/updateLisMachineConfiguration",
    updateLisMachineConfiguration,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });

      next();
    }
  );
  api.get(
    "/getScreensWithComponents",
    getScreensWithComponents,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });

      next();
    }
  );
  api.post(
    "/addScreensAndComponents",
    addScreensAndComponents,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });

      next();
    }
  );
  api.get(
    "/getCurrentAssignedScreenAndComponent",
    getCurrentAssignedScreenAndComponent,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_input == true) {
        res.status(httpStatus.internalServer).json({
          success: false,
          message: result.message
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

  return api;
};
