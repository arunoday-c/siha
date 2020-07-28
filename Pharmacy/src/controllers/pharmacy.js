import { Router } from "express";
import utlities from "algaeh-utilities";
import serviceModels from "algaeh-master-settings/src/models/serviceTypes";
import pharmacyModels from "../models/pharmacy";
import pharmaGlobal from "../models/pharmacyGlobal";
import Excel from "exceljs";
const { getItemandLocationStock, getItemLocationStock } = pharmaGlobal;
const {
  addItemMaster,
  addItemCategory,
  addItemGeneric,
  addItemGroup,
  addPharmacyUom,
  addPharmacyLocation,
  addItemForm,
  addItemStorage,
  addLocationPermission,
  getItemMaster,
  getItemCategory,
  getItemGeneric,
  getItemGroup,
  getPharmacyUom,
  getPharmacyLocation,
  getItemStorage,
  getItemForm,
  getLocationPermission,
  getItemMasterAndItemUom,
  updateItemCategory,
  updateItemGroup,
  updateItemGeneric,
  updatePharmacyUom,
  updatePharmacyLocation,
  updateItemForm,
  updateItemStorage,
  updateItemMasterAndUom,
  updateLocationPermission,
  getItemMasterWithSalesPrice,
  getPharmacyUsers,
  getPharmacyOptions,
  addPharmacyOptions,
  updatePharmacyOptions,
  addLocationReorder,
  getLocationReorder,
  updateLocationReorder,
  downloadPharStock,
} = pharmacyModels;
const { addServices, updateServicesOthrs } = serviceModels;

export default () => {
  const api = Router();
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

  api.get("/getItemGeneric", getItemGeneric, (req, res, next) => {
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

  api.get("/getPharmacyUom", getPharmacyUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getPharmacyLocation", getPharmacyLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getItemStorage", getItemStorage, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getItemForm", getItemForm, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getLocationPermission", getLocationPermission, (req, res, next) => {
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

  api.post("/addItemMaster", addServices, addItemMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addItemCategory", addItemCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addItemGeneric", addItemGeneric, (req, res, next) => {
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

  api.post("/addPharmacyUom", addPharmacyUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/addPharmacyLocation", addPharmacyLocation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addItemForm", addItemForm, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addItemStorage", addItemStorage, (req, res, next) => {
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

  api.put("/updateItemGeneric", updateItemGeneric, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updatePharmacyUom", updatePharmacyUom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updatePharmacyLocation",
    updatePharmacyLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put("/updateItemForm", updateItemForm, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateItemStorage", updateItemStorage, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateItemMasterAndUom",
    updateServicesOthrs,
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
  api.get("/getPharmacyUsers", getPharmacyUsers, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getPharmacyOptions", getPharmacyOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addPharmacyOptions", addPharmacyOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updatePharmacyOptions", updatePharmacyOptions, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addLocationReorder", addLocationReorder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getLocationReorder", getLocationReorder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateLocationReorder", updateLocationReorder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  // api.get("/getItemLocationStock", getItemLocationStock, (req, res, next) => {
  //   res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //     success: true,
  //     records: req.records,
  //   });
  // });

  api.get("/downloadPharStock", getItemandLocationStock, (req, res, next) => {
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
    var worksheet = workbook.addWorksheet("Pharmacy Location Stock", {
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
    "/downloadPharStockDetails",
    getItemLocationStock,
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
      var worksheet = workbook.addWorksheet("Pharmacy Location Stock Details", {
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
    }
  );

  return api;
};
