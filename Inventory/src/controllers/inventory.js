import { Router } from "express";
import utlities from "algaeh-utilities";
import serviceModels from "algaeh-master-settings/src/models/serviceTypes";
import invModels from "../models/inventory";

const {
  addItemMaster,
  addItemCategory,
  addItemGroup,
  addInventoryUom,
  addInventoryLocation,
  addLocationPermission,
  getItemMaster,
  getItemMasterAndItemUom,
  getItemCategory,
  getItemGroup,
  getInventoryUom,
  getInventoryLocation,
  getLocationPermission,
  updateItemCategory,
  updateItemGroup,
  updateInventoryUom,
  updateInventoryLocation,
  updateItemMasterAndUom,
  updateLocationPermission,
  addProcedureItems,
  getItemMasterWithSalesPrice,
  getInventoryOptions,
  addInventoryOptions,
  updateInventoryOptions
} = invModels;

const { addServices, updateServicesOthrs } = serviceModels;

export default () => {
  let api = Router();

  api.get("/getItemMaster", getItemMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getItemCategory", getItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getItemGroup", getItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getInventoryUom", getInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getInventoryLocation", getInventoryLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getItemMasterAndItemUom",
    getItemMasterAndItemUom,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getLocationPermission", getLocationPermission, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addItemMaster", (req, res, next) => {
    if (req.body.item_type === "STK" || req.body.item_type === "OITM") {
      addServices(req, res, next);
    } else {
      next();
    }
  }, addItemMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addItemCategory", addItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post("/addItemGroup", addItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post("/addInventoryUom", addInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post("/addInventoryLocation", addInventoryLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post(
    "/addLocationPermission",
    addLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put("/updateItemCategory", updateItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/updateItemGroup", updateItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/updateInventoryUom", updateInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updateInventoryLocation",
    updateInventoryLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateItemMasterAndUom",
    (req, res, next) => {
      if (req.body.item_type === "STK" || req.body.item_type === "OITM") {
        updateServicesOthrs(req, res, next);
      } else {
        next();
      }
    },
    updateItemMasterAndUom,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateLocationPermission",
    updateLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post("/addProcedureItems", addProcedureItems, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getItemMasterWithSalesPrice",
    getItemMasterWithSalesPrice,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getInventoryOptions", getInventoryOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addInventoryOptions", addInventoryOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/updateInventoryOptions", updateInventoryOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
