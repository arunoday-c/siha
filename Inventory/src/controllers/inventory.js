import { Router } from "express";
import utlities from "algaeh-utilities";
import serviceModels from "algaeh-master-settings/src/models/serviceTypes";
import invModels from "../models/inventory";
import invGlobals from "../models/inventoryGlobal";
import Excel from "exceljs";

const { downloadInvStock, downloadInvStockDetails } = invGlobals;

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
  updateInventoryOptions,
  addInvLocationReorder,
  getInvLocationReorder,
  updateInvLocationReorder,
} = invModels;

const { addServices, updateServicesOthrs } = serviceModels;

export default () => {
  let api = Router();

  api.get("/getItemMaster", getItemMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getItemCategory", getItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getItemGroup", getItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getInventoryUom", getInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getInventoryLocation", getInventoryLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getItemMasterAndItemUom",
    getItemMasterAndItemUom,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getLocationPermission", getLocationPermission, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post(
    "/addItemMaster",
    addServices,
    addItemMaster,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post("/addItemCategory", addItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/addItemGroup", addItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/addInventoryUom", addInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/addInventoryLocation", addInventoryLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post(
    "/addLocationPermission",
    addLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put("/updateItemCategory", updateItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateItemGroup", updateItemGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateInventoryUom", updateInventoryUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateInventoryLocation",
    updateInventoryLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
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
        records: req.records,
      });
    }
  );

  api.put(
    "/updateLocationPermission",
    updateLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post("/addProcedureItems", addProcedureItems, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getItemMasterWithSalesPrice",
    getItemMasterWithSalesPrice,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getInventoryOptions", getInventoryOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addInventoryOptions", addInventoryOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateInventoryOptions",
    updateInventoryOptions,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/addInvLocationReorder",
    addInvLocationReorder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getInvLocationReorder", getInvLocationReorder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateInvLocationReorder",
    updateInvLocationReorder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/downloadInvStock", downloadInvStock, (req, res, next) => {
    const columns = Object.keys(req.records[0]);
    const pharStocks = req.records;
    //location_name,
    //Create instance of excel
    var workbook = new Excel.Workbook();
    workbook.creator = "Algaeh technologies private limited";
    // workbook.lastModifiedBy = "Pharmacy Stock ";
    workbook.created = new Date();
    workbook.modified = new Date();
    // Set workbook dates to 1904 date system
    // workbook.properties.date1904 = true;

    //Work worksheet creation
    var worksheet = workbook.addWorksheet("Inventory Location Stock", {
      properties: {
        tabColor: {
          argb: "FFC0000",
        },
      },
    });
    //Adding columns
    worksheet.columns = columns.map((item) => {
      return {
        header: item,
        key: item,
        width: 30,
      };
    }); //require("../../testDB/data.json");
    // Add a couple of Rows by key-value, after the last current row, using the column keys
    for (let i = 0; i < pharStocks.length; i++) {
      const rest = pharStocks[i];
      worksheet.addRow(rest);
    }
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Report.xlsx"
    );
    workbook.xlsx.write(res).then(function (data) {
      res.end();
      console.log("File write done........");
    });
  });

  api.get(
    "/downloadInvStockDetails",
    downloadInvStockDetails,
    (req, res, next) => {
      const columns = Object.keys(req.records[0]);
      const pharStocks = req.records;
      //location_name,
      //Create instance of excel
      var workbook = new Excel.Workbook();
      workbook.creator = "Algaeh technologies private limited";
      // workbook.lastModifiedBy = "Pharmacy Stock ";
      workbook.created = new Date();
      workbook.modified = new Date();
      // Set workbook dates to 1904 date system
      // workbook.properties.date1904 = true;

      //Work worksheet creation
      var worksheet = workbook.addWorksheet(
        "Inventory Location Stock Details",
        {
          properties: {
            tabColor: {
              argb: "FFC0000",
            },
          },
        }
      );
      //Adding columns
      worksheet.columns = columns.map((item) => {
        return {
          header: item,
          key: item,
          width: 30,
        };
      }); //require("../../testDB/data.json");
      // Add a couple of Rows by key-value, after the last current row, using the column keys
      for (let i = 0; i < pharStocks.length; i++) {
        const rest = pharStocks[i];
        worksheet.addRow(rest);
      }
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Report.xlsx"
      );
      workbook.xlsx.write(res).then(function (data) {
        res.end();
        console.log("File write done........");
      });
    }
  );

  return api;
};
