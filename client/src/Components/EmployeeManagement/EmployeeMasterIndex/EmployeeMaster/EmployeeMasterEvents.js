import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import _ from "lodash";

const Validations = ($this) => {
  let isError = false;

  if ($this.state.personalDetails.date_of_joining === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Date of Joining. Cannot be blank.",
    });

    return isError;
  }

  if ($this.state.personalDetails.religion_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Religion. Cannot be blank.",
    });

    return isError;
  } else if (
    ($this.state.personalDetails.employee_status === "R" ||
      $this.state.personalDetails.employee_status === "T") &&
    $this.state.personalDetails.date_of_resignation === null
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Date of Leaving. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.appointment_type === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Appointment Type. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.employee_type === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee Type. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.employee_status === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Employee Status. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.sub_department_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Sub Department. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.hospital_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Branch. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.employee_designation_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Designation. Cannot be blank.",
    });

    return isError;
  } else if ($this.state.personalDetails.reporting_to_id === null) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Reporting To. Cannot be blank.",
    });

    return isError;
  }
  if ($this.state.personalDetails.isdoctor === "Y") {
    if ($this.state.personalDetails.services_id === null) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Service. Cannot be blank.",
      });

      return isError;
    }
  }

  if ($this.state.HRMS_Active === true) {
    if (
      $this.state.personalDetails.entitled_daily_ot === "Y" &&
      $this.state.personalDetails.overtime_group_id === null
    ) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Overtime Group. Cannot be blank.",
      });

      return isError;
    } else if ($this.state.personalDetails.employee_group_id === null) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Employee Group. Cannot be blank.",
      });

      return isError;
    } else if ($this.state.personalDetails.employee_bank_id === null) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Employee Bank. Cannot be blank.",
      });

      return isError;
    } else if ($this.state.personalDetails.employee_bank_ifsc_code === null) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "SWIFT Code. Cannot be blank.",
      });

      return isError;
    } else if ($this.state.personalDetails.employee_account_number === null) {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Account Number. Cannot be blank.",
      });
    }
    return isError;
    // } else if ($this.state.personalDetails.company_bank_id === null) {
    //   isError = true;
    //   swalMessage({
    //     type: "warning",
    //     title: "Employeer Bank. Cannot be blank."
    //   });

    //   return isError;
    // } else if ($this.state.personalDetails.mode_of_payment === null) {
    //   isError = true;
    //   swalMessage({
    //     type: "warning",
    //     title: "Mode of Payment. Cannot be blank."
    //   });

    //   return isError;
    // }
  }

  // else if ($this.state.personalDetails.deptDetails !== 0) {
  //   const activeDept = Enumerable.from($this.state.personalDetails.deptDetails)
  //     .where(w => w.dep_status === "A")
  //     .toArray();
  //
  //   if (activeDept.length > 1) {
  //     isError = true;
  //     swalMessage({
  //       type: "warning",
  //       title: "Only one Department can be Active."
  //     });
  //   }
  //   return isError;
  // }

  return false;
};

const InsertUpdateEmployee = ($this) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='empPersonal'",
    onSuccess: () => {
      const err = Validations($this);

      if (!err) {
        if ($this.state.personalDetails.insertdeptDetails.length > 0) {
          for (
            var i = 0;
            i < $this.state.personalDetails.insertdeptDetails.length;
            i++
          ) {
            if (
              $this.state.personalDetails.insertdeptDetails[i].from_date !==
              null
            ) {
              moment(
                $this.state.personalDetails.insertdeptDetails[i].from_date
              ).format("YYYY-MM-DD");
            }

            if (
              $this.state.personalDetails.insertdeptDetails[i].to_date !== null
            ) {
              moment(
                $this.state.personalDetails.insertdeptDetails[i].to_date
              ).format("YYYY-MM-DD");
            }
          }
        }

        if ($this.state.personalDetails.updatedeptDetails.length > 0) {
          for (
            var j = 0;
            j < $this.state.personalDetails.updatedeptDetails.length;
            j++
          ) {
            if (
              $this.state.personalDetails.updatedeptDetails[j].from_date !==
              null
            ) {
              moment(
                $this.state.personalDetails.updatedeptDetails[j].from_date
              ).format("YYYY-MM-DD");
            }

            if (
              $this.state.personalDetails.updatedeptDetails[j].to_date !== null
            ) {
              moment(
                $this.state.personalDetails.updatedeptDetails[j].to_date
              ).format("YYYY-MM-DD");
            }
          }
        }

        const activeDept = Enumerable.from(
          $this.state.personalDetails.deptDetails
        )
          .where((w) => w.dep_status === "A")
          .toArray();

        if (activeDept.length !== 0) {
          $this.state.personalDetails.reporting_to_id =
            activeDept[0].reporting_to_id;
          $this.state.personalDetails.sub_department_id =
            activeDept[0].sub_department_id;
          $this.state.personalDetails.employee_designation_id =
            activeDept[0].employee_designation_id;
        }
        let inputObj = $this.state.personalDetails;

        inputObj.inactive_date =
          inputObj.inactive_date !== null
            ? moment(inputObj.inactive_date).format("YYYY-MM-DD")
            : null;
        delete inputObj.countrystates;
        delete inputObj.cities;
        delete inputObj.precountrystates;
        delete inputObj.precities;
        delete inputObj.present_cities;

        const _employeeImage = inputObj.employeeImage;
        delete inputObj.employeeImage;

        const _payload = {
          hospital_id: $this.state.hospital_id,
          ...inputObj,
        };

        let _arrayImages = [];
        if (inputObj.hims_d_employee_id === null) {
          let employee_code_exists = _.find(
            $this.props.Employeedetails,
            (f) => f.employee_code === inputObj.employee_code
          );
          if (employee_code_exists !== undefined) {
            swalMessage({
              title: inputObj.employee_code + " Employee Code. Already Exists",
              type: "warning",
            });
            return;
          }
          algaehApiCall({
            uri: "/employee/addEmployeeMaster",
            module: "hrManagement",
            data: _payload,
            onSuccess: (response) => {
              if (response.data.success === true) {
                if (_employeeImage !== undefined) {
                  _arrayImages.push(
                    new Promise((resolve, reject) => {
                      _employeeImage.SavingImageOnServer(
                        undefined,
                        undefined,
                        undefined,
                        $this.state.personalDetails.employee_code,
                        () => {
                          resolve();
                        }
                      );
                    })
                  );
                }

                $this.setState(
                  {
                    hims_d_employee_id: response.data.records.insertId,
                    pageDisplay: "PersonalDetails",
                    personalDetails: {
                      ...$this.state.personalDetails,
                      insertearnComp: [],
                      insertDeductionComp: [],
                      insertContributeComp: [],
                      deleteearnComp: [],
                      updateearnComp: [],
                      deleteDeductionComp: [],
                      updateDeductionComp: [],
                      deleteContributeComp: [],
                      updateContributeComp: [],

                      insertIdDetails: [],
                      insertDependentDetails: [],
                      deleteIdDetails: [],
                      updateIdDetails: [],
                      deleteDependentDetails: [],
                      updateDependentDetails: [],

                      insertdeptDetails: [],
                      updatedeptDetails: [],

                      insertservTypeCommission: [],
                      insertserviceComm: [],
                      updateserviceComm: [],
                      updateservTypeCommission: [],
                    },
                  },
                  () => $this.props.onClose && $this.props.onClose(true)
                );

                swalMessage({
                  type: "success",
                  title: "Saved Successfully.",
                });
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.response.data.message || error.message,
                type: "error",
              });
            },
          });
        } else {
          algaehApiCall({
            uri: "/employee/updateEmployee",
            module: "hrManagement",
            data: _payload,
            method: "PUT",
            onSuccess: (response) => {
              if (response.data.success === true) {
                if (_employeeImage !== undefined) {
                  _arrayImages.push(
                    new Promise((resolve, reject) => {
                      _employeeImage.SavingImageOnServer(
                        undefined,
                        undefined,
                        undefined,
                        $this.state.personalDetails.employee_code,
                        () => {
                          resolve();
                        }
                      );
                    })
                  );
                }
                $this.setState(
                  {
                    pageDisplay: "PersonalDetails",
                    personalDetails: {
                      ...$this.state.personalDetails,
                      insertearnComp: [],
                      insertDeductionComp: [],
                      insertContributeComp: [],
                      deleteearnComp: [],
                      updateearnComp: [],
                      deleteDeductionComp: [],
                      updateDeductionComp: [],
                      deleteContributeComp: [],
                      updateContributeComp: [],

                      insertIdDetails: [],
                      insertDependentDetails: [],
                      deleteIdDetails: [],
                      updateIdDetails: [],
                      deleteDependentDetails: [],
                      updateDependentDetails: [],

                      insertdeptDetails: [],
                      updatedeptDetails: [],

                      insertservTypeCommission: [],
                      insertserviceComm: [],
                      updateserviceComm: [],
                      updateservTypeCommission: [],
                    },
                  },
                  () => $this.props.onClose && $this.props.onClose(true)
                );
                swalMessage({
                  type: "success",
                  title: "Updated Successfully.",
                });
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message || error.response.data.message,
                type: "error",
              });
            },
          });
        }
      }
    },
  });
};

const generateEmployeeContract = ($this, empEvent) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "employeeContract",
        reportParams: [
          {
            name: "hims_d_employee_id",
            value: $this.state.personalDetails.hims_d_employee_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      // const url = URL.createObjectURL(res.data);
      // let myWindow = window.open(
      //   "{{ product.metafields.google.custom_label_0 }}",
      //   "_blank"
      // );

      // myWindow.document.write(
      //   "<iframe src= '" + url + "' width='100%' height='100%' />"
      // );
      // myWindow.document.title = "Employee Contract";
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Employee Contract`;
      window.open(origin);
    },
  });
};

export { InsertUpdateEmployee, generateEmployeeContract };
