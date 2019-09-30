import { Router } from "express";
import utlities from "algaeh-utilities";
import empModels from "../models/employee";

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
  UpdateEmployeeRejoined
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

  return api;
};
