import { Router } from "express";
import utlities from "algaeh-utilities";
import empModels from "../models/employee";
import Excel from "exceljs/modern.browser";


import OpenBalExcelModels from "../models/OpeningBalanceExcel";
import openingBalanceUpload from "../models/openingBalanceUpload";

const {
  uploadEmployeeGratuity,
  uploadEmployeeLeaveSalary,
  uploadEmployeeLeaveBalance
} = openingBalanceUpload;

const {
  excelEmployeeGratuityOpenBalance,
  excelEmployeeLeaveSalaryOpenBalance,
  excelEmployeeLeaveOpenBalance,
  excelEmployeeOpeningBalanceRead
} = OpenBalExcelModels;

const {
  addMisEarnDedcToEmployee,
  getEmployee,
  addEmployeeMaster,
  updateEmployee,
  getEmployeeWorkExperience,
  getEmployeeDepartments,
  addEmployeeWorkExperience,
  updateEmployeeWorkExperience,
  deleteEmployeeWorkExperience,
  getEmployeeEducation,
  addEmployeeEducation,
  updateEmployeeEducation,
  deleteEmployeeEducation,
  getEmpEarningComponents,
  getEmpDeductionComponents,
  getEmpContibuteComponents,
  getFamilyIdentification,
  getDoctorServiceCommission,
  getDoctorServiceTypeCommission,
  getEmployeesForMisED,
  addMisEarnDedcToEmployees,
  getEmployeeDepartmentsWise,
  getEmployeeDesignationWise,
  UpdateEmployeeRejoined,
  getBulkEmployeeLeaves,
  InsertOpeningBalanceLeaveSalary,
  getBulkEmployeeLeaveSalary,
  getBulkEmployeeGratuity,
  getEmployeeGratuity,
  InsertOpeningBalanceGratuity,
  UpdateOpeningBalanceGratuity,
  InsertOpeningBalanceLoan,
  UpdateOpeningBalanceLoan,
  updateMisEarnDedcToEmployees,
  downloadEmployeeMaster
} = empModels;

export default () => {
  const api = Router();
  api.post(
    "/addMisEarnDedcToEmployee",
    addMisEarnDedcToEmployee,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.get(
    "/getBulkEmployeeLeaves",
    getBulkEmployeeLeaves,

    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records
          });
      } else {
        next();
      }
    },
    excelEmployeeLeaveOpenBalance
  );

  api.get("/getEmployeeGratuity", getEmployeeGratuity, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/get", getEmployee, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addEmployeeMaster", addEmployeeMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/updateEmployee", updateEmployee, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getEmployeeDepartments",
    getEmployeeDepartments,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmployeeDepartmentsWise",
    getEmployeeDepartmentsWise,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmployeeDesignationWise",
    getEmployeeDesignationWise,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmployeeWorkExperience",
    getEmployeeWorkExperience,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.post(
    "/addEmployeeWorkExperience",
    addEmployeeWorkExperience,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateEmployeeWorkExperience",
    updateEmployeeWorkExperience,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.delete(
    "/deleteEmployeeWorkExperience",
    deleteEmployeeWorkExperience,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getEmployeeEducation", getEmployeeEducation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post("/addEmployeeEducation", addEmployeeEducation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updateEmployeeEducation",
    updateEmployeeEducation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.delete(
    "/deleteEmployeeEducation",
    deleteEmployeeEducation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmpEarningComponents",
    getEmpEarningComponents,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmpDeductionComponents",
    getEmpDeductionComponents,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getEmpContibuteComponents",
    getEmpContibuteComponents,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getFamilyIdentification",
    getFamilyIdentification,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getDoctorServiceCommission",
    getDoctorServiceCommission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getDoctorServiceTypeCommission",
    getDoctorServiceTypeCommission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getEmployeesForMisED", getEmployeesForMisED, (req, res, next) => {
    let result = req.records;

    if (result.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
    }
  });
  api.post(
    "/addMisEarnDedcToEmployees",
    addMisEarnDedcToEmployees,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result
        });
      }
    }
  );

  api.put(
    "/UpdateEmployeeRejoined",
    UpdateEmployeeRejoined,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/UpdateOpeningBalanceLoan",
    UpdateOpeningBalanceLoan,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/UpdateOpeningBalanceGratuity",
    UpdateOpeningBalanceGratuity,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/InsertOpeningBalanceLeaveSalary",
    InsertOpeningBalanceLeaveSalary,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/InsertOpeningBalanceGratuity",
    InsertOpeningBalanceGratuity,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/InsertOpeningBalanceLoan",
    InsertOpeningBalanceLoan,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getBulkEmployeeLeaveSalary",
    getBulkEmployeeLeaveSalary,

    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records
          });
      } else {
        next();
      }
    },
    excelEmployeeLeaveSalaryOpenBalance
  );

  api.get(
    "/getBulkEmployeeGratuity",
    getBulkEmployeeGratuity,

    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records
          });
      } else {
        next();
      }
    },
    excelEmployeeGratuityOpenBalance
  );

  api.post(
    "/excelEmployeeOpeningBalanceRead",
    excelEmployeeOpeningBalanceRead,
    (req, res, next) => {
      if (req.filter == "GR") {
        uploadEmployeeGratuity(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (req.filter == "LS") {
        uploadEmployeeLeaveSalary(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (req.filter == "LE") {
        uploadEmployeeLeaveBalance(req, res, next);
      } else {
        next();
      }
    },

    (req, res, next) => {
      if (
        req.records.invalid_input !== undefined &&
        req.records.invalid_input == true
      ) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );
  api.put(
    "/updateMisEarnDedcToEmployees",
    updateMisEarnDedcToEmployees,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/downloadEmployeeMaster",
    downloadEmployeeMaster,

    (req, res, next) => {
    const {hospital_name,
    columns,
    employees}=  req.records;
   
      //Create instance of excel
var workbook = new Excel.Workbook();
workbook.creator = "Algaeh technologies private limited";
workbook.lastModifiedBy = "Manual Time sheet";
workbook.created = new Date();
workbook.modified = new Date();
// Set workbook dates to 1904 date system
        // workbook.properties.date1904 = true;

        //Work worksheet creation
        var worksheet = workbook.addWorksheet(hospital_name,{
          properties: { tabColor: { argb: "FFC0000" } }
        });
        //Adding columns
        worksheet.columns = columns.map(item=>{
          return {
            header:item,
            key:item,
            width:30
          }
        });
        ; //require("../../testDB/data.json");

  // Add a couple of Rows by key-value, after the last current row, using the column keys
    for (let i = 0; i < employees.length; i++) {
          const rest = employees[i];
          
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
        workbook.xlsx.write(res).then(function(data) {
          res.end();
          console.log("File write done........");
        });
      
      
    

      // if (req.records.invalid_input == true) {
      //   res
      //     .status(utlities.AlgaehUtilities().httpStatus().internalServer)
      //     .json({
      //       success: false,
      //       message: req.records.message
      //     });
      // } else {
      //   res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      //     success: true,
      //     records: req.records
      //   });
      // }
    }
  );

  return api;
};
