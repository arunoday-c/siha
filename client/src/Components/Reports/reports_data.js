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
import moment from "moment";

let allYears = getYears();

let hospital_id = null;

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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Department",
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
                  [currentEvent.name]: currentEvent.value,
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
            className: "col-2 form-group mandatory",
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
            className: "col-2 form-group",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",

            initialLoad: true,
            isImp: true,
            label: "Branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "receipt_type",
            initialLoad: true,
            isImp: true,
            label: "Receipt Type",

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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
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
            label: "Department",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
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
            label: "Department",
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
            className: "col-2 form-group mandatory",
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
  },
  {
    name: "VAT Reports",
    submenu: [
      {
        subitem: "Detail VAT Report",
        reportName: "detailVatReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
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
        subitem: "Monthly VAT Report",
        reportName: "monthVatReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
            initialLoad: true,
            value: moment().format("M"),
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
      },
      {
        subitem: "Company wise VAT Report",
        reportName: "companyVATReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Company",
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
          }
        ]
      },
      {
        subitem: "Patient Wise VAT Report",
        reportName: "patientwiseReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Company",
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
          }
        ]
      }
    ]
  }
];

const HR_Payroll_Reports = [
  {
    name: "HR report",
    excel: "true",
    submenu: [
      {
        subitem: "Employee - Dept/Sub Dept Wise",
        reportName: "staffListReport",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
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
            className: "col-2 form-group",
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
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "age_range",
            initialLoad: true,
            isImp: true,
            label: "RANGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: COMPARISON
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "text",
            name: "age",
            initialLoad: false,
            isImp: true,
            label: "ENTER AGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Gender Wise",
        reportName: "genderWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
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
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Nationality Wise",
        reportName: "nationalityWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Religion Wise",
        reportName: "religionWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "religion_id",
            initialLoad: true,
            isImp: false,
            label: "Religion",
            link: {
              uri: "/masters/get/relegion"
            },
            dataSource: {
              textField: "religion_name",
              valueField: "hims_d_religion_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - Designation Wise",
        reportName: "designationWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "designation_id",
            initialLoad: true,
            isImp: false,
            label: "designation",
            link: {
              uri: "/hrsettings/getDesignations",
              module: "hrManagement"
            },
            dataSource: {
              textField: "designation",
              valueField: "hims_d_designation_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 ",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Employee - New Joinee Month Wise",
        reportName: "newJoiningEmployee",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "year",
            isImp: false,
            initialLoad: true,
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          }
        ]
      }
    ]
  },
  {
    name: "Payroll Reports",
    excel: "true",
    submenu: [
      {
        subitem: "Attendance Reports",
        reportName: "attendanceReports",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-1 mandatory form-group",
            type: "dropdown",
            name: "year",
            sort: "off",
            isImp: true,
            initialLoad: true,
            label: "year",
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Leave Reports",
        reportName: "leaveReportPayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "hims_d_leave_id",
            initialLoad: true,
            // isImp: true,
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
            className: "col-2 form-group",
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
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Leave Accrual",
        reportName: "leaveAccuralPayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape", //"portrait",
        input: "sub_department_id=?",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Gratuity Provision",
        reportName: "gratuityProvisionStatementPayroll",
        input: "sub_department_id=?",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      // {
      //   subitem: "Absent Report",
      //   reportName: "absentReportPayroll",
      //   requireIframe: true,
      //   pageSize: "A4",
      //   pageOrentation: "landscape", //"portrait",
      //   reportParameters: [
      //     {
      //       className: "col-2 form-group",
      //       type: "dropdown",
      //       name: "hospital_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "branch",
      //       link: {
      //         uri: "/organization/getOrganizationByUser"
      //       },
      //       dataSource: {
      //         textField: "hospital_name",
      //         valueField: "hims_d_hospital_id",
      //         data: undefined
      //       }
      //     },
      //     {
      //       className: "col-2 form-group",
      //       type: "dropdown",
      //       name: "department_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "Department",
      //       link: {
      //         uri: "/department/get",
      //         module: "masterSettings"
      //       },
      //       dataSource: {
      //         textField: "department_name",
      //         valueField: "hims_d_department_id",
      //         data: undefined
      //       },
      //       events: {
      //         onChange: (reportState, currentEvent) => {
      //           //provider_id_list CONTROL NAME AND APPEND BY _LIST
      //           algaehApiCall({
      //             uri: "/department/get/subdepartment",
      //             module: "masterSettings",
      //             method: "GET",
      //             data: { department_id: currentEvent.value },

      //             onSuccess: result => {
      //               reportState.setState({
      //                 sub_department_id_list: result.data.records
      //               });
      //             }
      //           });
      //         },
      //         onClear: (reportState, currentName) => {
      //           reportState.setState({
      //             [currentName]: undefined,
      //             sub_department_id_list: []
      //           });
      //         }
      //       }
      //     },
      //     {
      //       className: "col-2 form-group",
      //       type: "dropdown",
      //       name: "sub_department_id",
      //       isImp: false,
      //       label: "Sub-Department",
      //       dataSource: {
      //         textField: "sub_department_name",
      //         valueField: "hims_d_sub_department_id",
      //         data: undefined
      //       }
      //     },
      //     {
      //       className: "col-2 form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },
      //     {
      //       className: "col-2 form-group",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     }
      //   ]
      // },
      {
        subitem: "Employee Loan report",
        reportName: "EmployeeLoanReport",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
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
        subitem: "Salary Statement",
        reportName: "salaryStatementPayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 mandatory form-group",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Salary Statement Detail",
        reportName: "salaryStatementDetailsPayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 mandatory form-group",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
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
        subitem: "Leave Salary Statement",
        reportName: "leaveSalaryStatementPayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Earnings & Deductions Report",
        reportName: "employeeE&D",

        requireIframe: true,
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            sort: "off",
            isImp: true,
            initialLoad: true,
            label: "year",
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "edType",

            isImp: true,
            label: "Miscellaneous Category",

            dataSource: {
              textField: "edType",
              valueField: "edTypeValue",
              data: [
                {
                  edType: "Earnings",
                  edTypeValue: "E"
                },
                {
                  edType: "Deductions",
                  edTypeValue: "D"
                },
                {
                  edType: "Bonus",
                  edTypeValue: "B"
                }
              ]
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                if (currentEvent.value === "E" || currentEvent.value === "B") {
                  algaehApiCall({
                    uri: "/payrollSettings/getMiscEarningDeductions",
                    module: "hrManagement",
                    method: "GET",
                    data: {
                      component_category: "E",
                      miscellaneous_component: "Y"
                    },

                    onSuccess: result => {
                      reportState.setState({
                        earning_deductions_id_list: result.data.records
                      });
                    }
                  });
                } else if (currentEvent.value === "D") {
                  algaehApiCall({
                    uri: "/payrollSettings/getMiscEarningDeductions",
                    module: "hrManagement",
                    method: "GET",
                    data: {
                      component_category: "D",
                      miscellaneous_component: "Y"
                    },

                    onSuccess: result => {
                      reportState.setState({
                        earning_deductions_id_list: result.data.records
                      });
                    }
                  });
                }
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  earning_deductions_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement"
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id"
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "earning_deductions_id",
            isImp: false,
            label: "Miscellaneous Type",
            dataSource: {
              textField: "earning_deduction_description",
              valueField: "hims_d_earning_deduction_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Leave Encashment Reports",
        reportName: "leaveReportEncashment",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      department_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            sort: "off",
            isImp: true,
            initialLoad: true,
            label: "year",
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS
            },
            others: {
              sort: "off"
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "hims_d_leave_id",
            initialLoad: true,
            // isImp: true,
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      }
    ]
  },
  {
    name: "Project Payroll",
    excel: "true",
    submenu: [
      {
        subitem: "Project wise Payroll",
        //template_name: "ProjectPayroll/projectWisePayroll",
        // reportQuery: "projectWisePayroll",
        //  reportUri: "/projectjobcosting/getProjectWiseJobCost",
        // module: "hrManagement",
        reportName: "projectWisePayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "project_id",
            initialLoad: true,
            label: "Project",
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
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "sub_department_id",
            isImp: false,
            label: "Sub-Department",
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
          }
        ]
      },
      {
        subitem: "Designation Wise Project Payroll",
        //template_name: "ProjectPayroll/projectWisePayroll",
        // reportQuery: "projectWisePayroll",
        //  reportUri: "/projectjobcosting/getProjectWiseJobCost",
        // module: "hrManagement",
        reportName: "designationProjectWisePayroll",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: true,
            initialLoad: true,
            value: moment().format("M"),
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "designation_id",
            initialLoad: true,
            isImp: false,
            label: "designation",
            link: {
              uri: "/hrsettings/getDesignations",
              module: "hrManagement"
            },
            dataSource: {
              textField: "designation",
              valueField: "hims_d_designation_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "project_id",
            initialLoad: true,
            label: "Project",
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
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
            label: "Employee Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "is_local",
            initialLoad: true,
            // isImp: true,
            label: "Employee Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOCAL_TYPE
            }
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
        subitem: "Consumption List",
        reportName: "consumptionListInventory",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "stockUsed",

            isImp: true,
            label: "Show for Last (month's)",

            dataSource: {
              textField: "stockUsed",
              valueField: "stockUsedValue",
              data: [
                {
                  stockUsed: "1 months",
                  stockUsedValue: moment()
                    .add(-1, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "2 months",
                  stockUsedValue: moment()
                    .add(-2, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "3 months",
                  stockUsedValue: moment()
                    .add(-3, "months")
                    .format("YYYY-MM-DD")
                }
              ]
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/inventory/getItemMaster",
              module: "inventory"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_inventory_item_master_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          }
        ]
      },
      {
        subitem: "Items Consumption Report",
        reportName: "itemsConsumptionInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Department",
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
            className: "col-2 form-group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

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

      // {
      //   subitem: "Items Issued Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      // },
      // {
      //   subitem: "Items Received Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      // },
      {
        subitem: "Item Expiry Report",
        reportName: "itemExpiryInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 mandatory form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "group_id",
            initialLoad: true,
            isImp: false,
            label: "Group",
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_item_group_id",
              data: []
            },
            link: {
              uri: "/inventory/getItemGroup",
              module: "inventory"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemCategory",
                  module: "inventory",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: false,
            label: "Category",
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemMaster",
                  module: "inventory",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          }
        ]
      },
      // {
      //   subitem: "Inventory Store Report",
      //   reportName: "inventoryStoreReport",
      //   requireIframe: true,
      //   reportParameters: [
      //     {
      //       className: "col-2 form-group mandatory",
      //       type: "dropdown",
      //       name: "hospital_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "branch",
      //       link: {
      //         uri: "/organization/getOrganizationByUser"
      //       },
      //       events: {
      //         onChange: (reportState, currentEvent) => {
      //           //provider_id_list CONTROL NAME AND APPEND BY _LIST
      //           algaehApiCall({
      //             uri: "/inventory/getInventoryLocation",
      //             module: "inventory",
      //             method: "GET",
      //             data: { hospital_id: currentEvent.value },

      //             onSuccess: result => {
      //               reportState.setState({
      //                 location_id_list: result.data.records
      //               });
      //             }
      //           });
      //         },
      //         onClear: (reportState, currentName) => {
      //           reportState.setState({
      //             [currentName]: undefined,
      //             location_id_list: []
      //           });
      //         }
      //       },
      //       value: hospital_id,
      //       dataSource: {
      //         textField: "hospital_name",
      //         valueField: "hims_d_hospital_id",
      //         data: undefined
      //       }
      //     },

      //     {
      //       className: "col-2 form-group mandatory",
      //       type: "dropdown",
      //       name: "location_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "Location",
      //       dataSource: {
      //         textField: "location_description",
      //         valueField: "hims_d_inventory_location_id",
      //         data: []
      //       }
      //     },

      //     {
      //       className: "col-2 mandatory  form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-2 mandatory  form-group",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-2 form-group",
      //       type: "dropdown",
      //       name: "item_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "Item",

      //       link: {
      //         uri: "/inventory/getItemMaster",
      //         module: "inventory"
      //       },
      //       dataSource: {
      //         textField: "item_description",
      //         valueField: "hims_d_item_master_id",
      //         data: undefined
      //       }
      //     }
      //   ]
      // },
      {
        subitem: "Purchase Report",
        reportName: "inventoryPurchaseReport",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
          // {
          //   className: "col-2 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ]
      },
      {
        subitem: "Transfer Report",
        reportName: "InventoryTransferReport",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "From Location ",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            }
          }
        ]
      },
      {
        subitem: "Inventory Aging",
        reportName: "InventoryAgingReport",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/inventory/getItemMaster",
              module: "inventory"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_inventory_item_master_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          }
        ]
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "time",
            name: "from_time",
            label: "From Time",
            isImp: true,
            value: "00:00"
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "time",
            name: "to_time",
            label: "To Time",
            isImp: true,
            value: "23:59"
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",

            initialLoad: true,
            isImp: true,
            label: "Location",
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
            className: "col-2 form-group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "cashier_id",

            label: "User/Employee",

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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "group_id",
            initialLoad: true,
            isImp: false,
            label: "Group",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: false,
            label: "Category",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          }
        ]
      },
      {
        subitem: "Consumption List",
        reportName: "consumptionListPharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "stockUsed",

            isImp: true,
            label: "Show for Last (month's)",

            dataSource: {
              textField: "stockUsed",
              valueField: "stockUsedValue",
              data: [
                {
                  stockUsed: "1 months",
                  stockUsedValue: moment()
                    .add(-1, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "2 months",
                  stockUsedValue: moment()
                    .add(-2, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "3 months",
                  stockUsedValue: moment()
                    .add(-3, "months")
                    .format("YYYY-MM-DD")
                }
              ]
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/pharmacy/getItemMaster",
              module: "pharmacy"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            label: "From Date",
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            label: "To Date",
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: true,
            label: "Category",

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
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          }
        ]
      },
      {
        subitem: "Items Stock Register - Date wise",
        reportName: "itemStockEnquiryDateWisePharmacy",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: true,
            label: "Item",

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
        subitem: "GP Statement - Bill Wise",
        template_name: "gpBillwisePharmacy",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
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
        subitem: "Purchase Report",
        reportName: "pharmacyPurchaseReport",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
          // {
          //   className: "col-2 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ]
      },
      ,
      {
        subitem: "Transfer Report",
        reportName: "PharmacyTransferReport",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "From Location ",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: []
            }
          }
        ]
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
      //       className: "col-2 form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },
      //     {
      //       className: "col-2 form-group",
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
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: true,
            label: "Company",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Sub Company",
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
export default function loadActiveReports(userToken) {
  // if (sessionStorage.getItem("CurrencyDetail") !== null) {
  //   hospital_id = JSON.parse(
  //     AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  //   ).hims_d_hospital_id;
  // }
  const {hims_d_hospital_id,product_type} = userToken;
  hospital_id = hims_d_hospital_id;
  return {
    data: () => {
      let result = [];
     if(product_type
      ==="HIMS_ERP")  {
        result = pushData(result, Hims_Reports);
        result = pushData(result, HR_Payroll_Reports);
        result = pushData(result, insurance_reports);
        result = pushData(result, Pharmacy_Reports);
        result = pushData(result, Inventory_Reports);
      } else if(product_type ==="HIMS_CLINICAL"){
        result = pushData(result, Hims_Reports);
        result = pushData(result, insurance_reports);
        result = pushData(result, Pharmacy_Reports);
        result = pushData(result, Inventory_Reports);
      } else if(product_type==="HRMS"){
        result = pushData(result, HR_Payroll_Reports);
      } else if(product_type === "ONLY_PHARMACY"){
        result = pushData(result, Pharmacy_Reports);
      } else if(product_type === "FINANCE_ERP"){
        result = pushData(result, HR_Payroll_Reports);
        result = pushData(result, Inventory_Reports);
        result = pushData(result, Pharmacy_Reports);
      }

    
     
      // for (let i = 0; i < Activated_Modueles.length; i++) {
      //   const item = Activated_Modueles[i];
      //   switch (item.module_code) {
      //     case "FTDSK":
      //       result = pushData(result, Hims_Reports);
      //       break;
      //     case "PAYROLL":
      //       result = pushData(result, HR_Payroll_Reports);
      //       break;
      //     case "INS":
      //       result = pushData(result, insurance_reports);
      //       break;
      //     case "PHCY":
      //       result = pushData(result, Pharmacy_Reports);
      //       break;
      //     case "INVTRY":
      //       result = pushData(result, Inventory_Reports);
      //       break;
      //   }
      // }
      return result;
    }
  };
}
