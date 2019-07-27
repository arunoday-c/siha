import {
  APPT_TYPE,
  LEAVE_STATUS,
  MONTHS,
  RECEIPT_TYPE,
  LOCAL_TYPE,
  FORMAT_PAYTYPE,
  EXPIRY_STATUS,
  EMPLOYEE_STATUS,
  COMPARISON,
  EMP_FORMAT_GENDER,
  DATE_OF_JOIN,
  EMPLOYEE_TYPE
} from "../../utils/GlobalVariables.json";
import { getYears, AlgaehOpenContainer } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall";
import _ from "lodash";

let allYears = getYears();

const Hims_Reports = [
  {
    name: "Appointment",
    submenu: [
      {
        subitem: "Doctor and Status wise report",
        reportName: "doctor_Status_wise_appointment",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Select Department",
            link: {
              //uri: "/department/get/subdepartment"
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings"
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: []
                });
              }
            }
          },
          {
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "status_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Status",
            link: {
              uri: "/appointment/getAppointmentStatus",
              module: "frontDesk"
            },
            dataSource: {
              textField: "statusDesc",
              valueField: "hims_d_appointment_status_id",
              data: undefined
            }
          }
        ]
      }
    ]
  },
  {
    name: "Income",
    submenu: [
      {
        subitem: "Department Wise Income",
        reportName: "departmentWiseIncome",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      },
      {
        subitem: "OP Billing Summary",
        reportName: "opBillSummary",
        //reportQuery: "OPBillSummary",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select Branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      },
      {
        subitem: "OP Billing Detail",
        reportName: "opBillDetails",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select Branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "service_type_id",
            initialLoad: true,
            isImp: false,
            link: {
              uri: "/serviceType",
              module: "masterSettings"
            },
            dataSource: {
              textField: "service_type",
              valueField: "hims_d_service_type_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Daily Cash Collection Consolidated",
        //template_name: "Income/dailyCashCollection",
        reportName: "dailyCashCollection",
        //reportQuery: "staffCashCollection",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      },
      {
        subitem: "List of Receipt",
        reportName: "opBillIncomeReceipt",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "receipt_type",
            initialLoad: true,
            isImp: true,
            label: "Select Receipt Type",

            dataSource: {
              textField: "name",
              valueField: "value",
              data: RECEIPT_TYPE
            },
            events: {
              onChange: (reportState, currentValue, callback) => {
                let reportQuery =
                  currentValue.value === "OP"
                    ? "opBillReceipt"
                    : // : currentValue.value === "POS"
                    // ? "posReceipt"
                    currentValue.value === "AD"
                    ? "advanceReceipt"
                    : currentValue.value === "OPC"
                    ? "opCreditReceipt"
                    : // : currentValue.value === "POSC"
                      // ? "posCreditReceipt"
                      "";
                callback({ reportQuery: reportQuery });
              }
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select Branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings"
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: []
                });
              }
            }
          },
          {
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Daily Transaction",
        reportName: "dailyTransactionIncomeReceipt",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select Branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings"
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: []
                });
              }
            }
          },
          {
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          }
        ]
      }
    ]
  },
  {
    name: "Patient Reports",
    submenu: [
      {
        subitem: "Patient Outstanding",
        template_name: "PatientReports/PatOutstandingSum",
        reportQuery: "patOutstandingSum",
        reportParameters: [
          {
            type: "date",
            name: "till_date",
            label: "Till Date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      }
    ]
  }
];

const HR_Payroll_Reports = [
  {
    name: "HR report",
    submenu: [
      {
        subitem: "Employee - Dept/Sub Dept Wise",
        reportName: "staffListReport",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "employee_status",
            initialLoad: true,
            isImp: false,
            label: "Employee Status",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_STATUS
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE
            }
          }
        ]
      },
      {
        subitem: "Employee - Age Wise",
        reportName: "ageWiseEmployee",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "age_range",
            initialLoad: true,
            isImp: false,
            label: "SELECT RANGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: COMPARISON
            }
          },
          {
            className: "col-2",
            type: "text",
            name: "age",
            initialLoad: false,
            isImp: false,
            label: "ENTER AGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Gender Wise",
        reportName: "genderWiseEmployee",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sex",
            initialLoad: true,
            isImp: false,
            label: "Employee Gender",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMP_FORMAT_GENDER
            }
          }
        ]
      },
      {
        subitem: "Employee - Nationality Wise",
        reportName: "nationalityWiseEmployee",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "Select nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Designation Wise",
        reportName: "designationWiseEmployee",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "designation_id",
            initialLoad: true,
            isImp: false,
            label: "Select designation",
            link: {
              uri: "/hrsettings/getDesignations",
              module: "hrManagement"
            },
            dataSource: {
              textField: "designation",
              valueField: "hims_d_designation_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - New Joinee Month Wise",
        reportName: "newJoiningEmployee",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get",
              module: "masterSettings"
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      sub_department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Select Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "date_of_join",
            initialLoad: true,
            isImp: false,
            label: "Joined",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: DATE_OF_JOIN
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "year",
            isImp: false,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          }
        ]
      }
    ]
  },
  {
    name: "Payroll Reports",
    submenu: [
      {
        subitem: "Leave Reports",
        reportName: "leaveReportPayroll",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hims_d_leave_id",
            initialLoad: true,
            isImp: true,
            link: {
              uri: "/selfService/getLeaveMaster",
              module: "hrManagement"
            },
            dataSource: {
              textField: "leave_description",
              valueField: "hims_d_leave_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "status",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LEAVE_STATUS
            },
            events: {
              onChange: (reportState, currentValue) => {}
            }
          }
        ]
      },
      {
        subitem: "Salary Statement",
        reportName: "salaryStatementPayroll",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            className: "col-2",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Select Department",
            link: {
              uri: "/department/get/subdepartment"
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Leave Accrual",
        reportName: "leaveAccuralPayroll",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        input: "sub_department_id=?",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            className: "col-2",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Select Department",
            link: {
              uri: "/department/get/subdepartment"
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Gratuity Provision",
        reportName: "gratuityProvisionStatementPayroll",
        input: "sub_department_id=?",
        requireIframe: true,

        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            className: "col-2",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Select Department",
            link: {
              uri: "/department/get/subdepartment"
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Absent Report",
        reportName: "absentReportPayroll",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      },
      {
        subitem: "Employee Loan report",
        reportName: "EmployeeLoanReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Salary Statement Detail",
        // reportUri: "/salary/detailSalaryStatement",
        // module: "hrManagement",
        //template_name: "PayrollReports/salary_statement_detail",
        reportName: "salaryStatementDetailsPayroll",
        pageOrentation: "landscape",
        requireIframe: true,
        reportParameters: [
          {
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: true,
            label: "Select Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement"
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id"
            }
          },
          {
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Select Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Attendance Reports",
        reportName: "attendanceReports",

        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            type: "dropdown",
            name: "year",
            sort: "off",
            isImp: true,
            initialLoad: true,
            label: "year",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Select Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement"
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id"
            }
          }
        ]
      }
    ]
  },
  {
    name: "Project Payroll",
    submenu: [
      {
        subitem: "Project wise Payroll",
        //template_name: "ProjectPayroll/projectWisePayroll",
        // reportQuery: "projectWisePayroll",
        //  reportUri: "/projectjobcosting/getProjectWiseJobCost",
        // module: "hrManagement",
        reportName: "projectWisePayroll",
        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            type: "dropdown",
            name: "year",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          },
          {
            type: "dropdown",
            sort: "off",
            name: "month",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            }
          },
          {
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "project_id",
            initialLoad: true,
            label: "Select Project",
            link: {
              uri: "/hrsettings/getProjects",
              module: "hrManagement"
            },
            dataSource: {
              textField: "project_desc",
              valueField: "hims_d_project_id"
            }
            // events: {
            //   onChange: (reportState, currentValue) => {}
            // }
          }
        ]
      }
    ]
  }
];

const Inventory_Reports = [
  {
    name: "Inventory",
    submenu: [
      {
        subitem: "Items Consumption Report",
        reportName: "itemsConsumptionInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Select Department",
            link: {
              //uri: "/department/get/subdepartment"
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings"
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Select Item",

            link: {
              uri: "/pharmacy/getItemMaster",
              module: "pharmacy"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: undefined
            }
          }
        ]
      },

      {
        subitem: "Items Issued Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Received Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Expiry Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      }
    ]
  }
];

const Pharmacy_Reports = [
  {
    name: "Pharmacy",
    submenu: [
      {
        subitem: "List of Receipts",
        reportName: "salesReceiptListPharmacy",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "time",
            name: "from_time",
            label: "From Time",
            isImp: true,
            value: "00:00"
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "time",
            name: "to_time",
            label: "To Time",
            isImp: true,
            value: "23:59"
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyUsers",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      cashier_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  cashier_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",

            initialLoad: true,
            isImp: true,
            label: "Select Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y"
              }
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id"
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "pay_type",
            initialLoad: true,
            isImp: false,
            label: "Receipt Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_PAYTYPE
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "cashier_id",

            label: "Select User/Employee",

            dataSource: {
              textField: "full_name",
              valueField: "algaeh_d_app_user_id",
              data: []
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sales Invoice",
        reportName: "salesInvoiceListPharmacy",
        // template_name: "salesInvoiceListPharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Select Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y"
              }
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id"
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sales Return",
        reportName: "salesReturnListPharmacy",
        // template_name: "salesReturnListPharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Select Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y"
              }
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id"
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Daily Collection - Consolidated",
        //template_name: "dailyCollectionPharmacy",
        reportName: "dailyCollectionPharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Select Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y"
              }
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id"
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Expiry Report",
        reportName: "itemExpiryPharmacy",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Select Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "group_id",
            initialLoad: true,
            isImp: false,
            label: "Select Group",
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_item_group_id",
              data: []
            },
            link: {
              uri: "/pharmacy/getItemGroup",
              module: "pharmacy"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getItemCategory",
                  module: "pharmacy",
                  method: "GET",
                  data: { hims_d_item_category_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      category_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  category_id_list: []
                });
              }
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: false,
            label: "Select Category",
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_item_category_id",
              data: []
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getItemMaster",
                  module: "pharmacy",
                  method: "GET",
                  data: { category_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      item_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  item_id_list: []
                });
              }
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Select Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Select Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS
            }
          },

          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
      },
      {
        subitem: "Items Stock Register - Category wise",
        reportName: "itemStockEnquiryCategoryWisePharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            label: "Select a Date",
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Select Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: true,
            label: "Select a Category",

            link: {
              uri: "/pharmacy/getItemCategory",
              module: "pharmacy"
            },
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_item_category_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getItemMaster",
                  module: "pharmacy",
                  method: "GET",
                  data: { category_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      item_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  item_id_list: []
                });
              }
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Select Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          }
        ]
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Stock Register - Date wise",
        reportName: "itemStockEnquiryDateWisePharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Select Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: true,
            label: "Select Item",

            link: {
              uri: "/pharmacy/getItemMaster",
              module: "pharmacy"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: undefined
            }
          },

          {
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
        ]
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Bill Wise",
        template_name: "gpBillwisePharmacy",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Select Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Date Wise",
        reportName: "gpDatewisePharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
            label: "Select branch",
            link: {
              uri: "/organization/getOrganization"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Select Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          }
        ]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      }
      // {
      //   subitem: "GP Statment ItemWise Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      //   //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      // },
      // {
      //   subitem: "List of Claims Generated",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      //   //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      // }

      // {
      //   subitem: "Items Consumption Report",
      //   reportName: "itemsConsumptionPharmacy",
      //   requireIframe: true,
      //   pageSize: "A4",
      //   pageOrentation: "portrait", //"portrait",
      //   reportParameters: [
      //     {
      //       className: "col-2",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },
      //     {
      //       className: "col-2",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     }
      //   ]
      // }
    ]
  }
];

const insurance_reports = [
  {
    name: "Insurance",
    submenu: [
      {
        subitem: "All Claim Statement",
        template_name: "allClaimStatementInsurance",
        reportParameters: [
          {
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: true,
            label: "Select Company",
            link: {
              uri: "/insurance/getInsuranceProviders"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "insurance_provider_name",
              valueField: "hims_d_insurance_provider_id"
            }
          },
          {
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Select Sub Company",
            dataSource: {
              // textField: "full_name",
              // valueField: "employee_id",
              // data: undefined
            }
          }
        ]
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      }
    ]
  }
];

// case "LAB":
//   result = pushData(result, HR_Payroll_Reports);
//   break;
const pushData = (result, current) => {
  if (result.length === 0) {
    result = current;
  } else {
    result = result.concat(current);
  }
  return result;
};
export default function loadActiveReports() {
  return {
    data: () => {
      const Activated_Modueles =
        sessionStorage.getItem("ModuleDetails") !== null
          ? JSON.parse(
              AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
            )
          : [];
      let result = [];
      for (let i = 0; i < Activated_Modueles.length; i++) {
        const item = Activated_Modueles[i];
        switch (item.module_code) {
          case "FTDSK":
            result = pushData(result, Hims_Reports);
            break;
          case "PAYROLL":
            result = pushData(result, HR_Payroll_Reports);
            break;
          case "INS":
            result = pushData(result, insurance_reports);
            break;
          case "PHCY":
            result = pushData(result, Pharmacy_Reports);
            break;
          case "INVTRY":
            result = pushData(result, Inventory_Reports);
            break;
        }
      }
      return result;
    }
  };
}
