import {
  APPT_TYPE,
  LEAVE_STATUS,
  MONTHS,
  RECEIPT_TYPE,
  LOCAL_TYPE
} from "../../utils/GlobalVariables.json";
import { getYears } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall";
let allYears = getYears();

export default [
  {
    name: "Appointment",
    submenu: [
      {
        subitem: "Patient Wise Appointment Details",
        template_name: "appt_availability",
        reportParameters: [
          {
            type: "date",
            name: "from_date",
            label: "From Date",
            isImp: true,
            others: {
              maxDate: new Date()
            }
          }
        ]
      },
      {
        subitem: "Doctor and Status wise report",
        reportName: "departmentDoctorConsumption",
        pageSize: "A4",
        requireIframe:true,
        pageOrentation: "landscap", //"portrait",
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
              textField: "description",
              valueField: "hims_d_appointment_status_id",
              data: undefined
            }
          },
         
        ]
      },
      {
        subitem: "Patient Recall Report",
        template_name: "appt_availability",
        reportParameters: []
      }
    ]
  },

  {
    name: "Income",
    submenu: [
      {
        subitem: "Department Wise Income",
        template_name: "Income/departmentIncome",
        reportQuery: "subDepartmentIncome",
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
      },
      {
        subitem: "OP Billing Summary",
        template_name: "Income/opBillSummary",
        reportQuery: "OPBillSummary",
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
      },
      {
        subitem: "OP Billing Detail",
        template_name: "Income/opBillDetails",
        reportQuery: "OPBillDetails",
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
            name: "service_type_id",
            initialLoad: true,
            isImp: true,
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
        subitem: "Daily Cash Collection",
        template_name: "Income/dailyCashCollection",
        reportQuery: "staffCashCollection",
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
      },
      {
        subitem: "Daily Transaction",
        template_name: "Income/DailyTransaction",
        reportQuery: "dailyTransaction",
        //reportUri: "/projectjobcosting/getProjectWiseJobCost",
        module: "IncomeModule",

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
              uri: "/department/get/subdepartment"
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Select Doctor",
            link: {
              uri: "/employee/get",
              module: "hrManagement",
              data: {
                isdoctor: "Y"
              }
            },
            dataSource: {
              textField: "full_name",
              valueField: "hims_d_employee_id",
              data: undefined
            }
          }
        ]
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Receipt",
        template_name: "Income/ReceiptList",
        reportQuery: "opBillReceipt",
        // module: "IncomeModule",
        reportParameters: [
          {
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
                    : currentValue.value === "POS"
                    ? "posReceipt"
                    : currentValue.value === "AD"
                    ? "advanceReceipt"
                    : currentValue.value === "OPC"
                    ? "opCreditReceipt"
                    : currentValue.value === "POSC"
                    ? "posCreditReceipt"
                    : "";
                callback({ reportQuery: reportQuery });
              }
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
          },
          {
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
            name: "V.sub_department_id",
            initialLoad: true,
            isImp: false,
            label: "Select Department",
            link: {
              uri: "/department/get/subdepartment"
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "hims_d_sub_department_id",
              data: undefined
            }
          },
          {
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Select Doctor",
            link: {
              uri: "/employee/get",
              // uri: "/employee/get?isdoctor='Y'",
              module: "hrManagement",
              data: {
                isdoctor: "Y"
              }
            },
            dataSource: {
              textField: "full_name",
              valueField: "hims_d_employee_id",
              data: undefined
            }
          }
        ]
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "Finance",
    submenu: [
      {
        subitem: "List of Payments",
        template_name: "Finance/paymentList",
        reportQuery: "paymentList",
        module: "FinanceModule",
        reportParameters: [
          {
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
                    : currentValue.value === "POS"
                    ? "posReceipt"
                    : currentValue.value === "AD"
                    ? "advanceReceipt"
                    : currentValue.value === "OPC"
                    ? "opCreditReceipt"
                    : currentValue.value === "POSC"
                    ? "posCreditReceipt"
                    : "";
                callback({ reportQuery: reportQuery });
              }
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
          },
          {
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
            name: "V.sub_department_id",
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
          },
          {
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: true,
            label: "Select Doctor",
            link: {
              uri: "/employee/get",
              // uri: "/employee/get?isdoctor='Y'",
              module: "hrManagement",
              data: {
                isdoctor: "Y"
              }
            },
            dataSource: {
              textField: "full_name",
              valueField: "hims_d_employee_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Balance Sheet Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cash Flow Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis - Monthly Summary",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis Consumables - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis Summary - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Day Book",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger - Bank Reconciliation",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger Consolidated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger Consolidated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Payment Received Invoices",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Payment Received Invoices - Detailed",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Profit and Loss",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Profit And Loss MonthWise Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Reconciliation",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Ledger- Detailed",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Trial Balance",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "MIS",
    submenu: [
      {
        subitem: " Count Of Medications - By Trade Name",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor Wise Patient Statistics",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "File Tracking Report ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Growth Chart - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Investigations Doing Outside",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Discharged Patients - Day Care",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List of Discharged Patients - Day Care ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List Of Encounter Reopen",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Insurance Providers ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Invoices - Specific Patient",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Patients",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List Of Patients - Demography Details",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Surgery Patients - Day Care",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Marketing - Sources Report Detailed",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Purchase Order Report - Supplier Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Medical Service Illustrative Report ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "No of Consultations - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Patient Encounter Status Report ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Encounter Type Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Per Day Analysis - Doctor Wise ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Wise Payment History",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Wise Vital Signs Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Consultations",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Investigations",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Treatments",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Preapproval Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Investigations",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Treatments ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Salary Calculation - Doctors",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sick Leave Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT - Nurse Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " TestResult Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "Payroll Reports",
    submenu: [
      {
        subitem: "Leave Reports",
        template_name: "PayrollReports/leave_reports",
        reportQuery: "leaveReport",
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
        subitem: "Employee Details",
        template_name: "PayrollReports/employee_details",
        reportQuery: "employeeDetails",
        reportParameters: []
      },
      {
        subitem: "Salary Statement",
        template_name: "PayrollReports/salary_statement",
        reportQuery: "salaryStatement",
        input: "sub_department_id=?",
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
        template_name: "PayrollReports/leave_accrual",
        reportQuery: "leaveAccrual",
        input: "sub_department_id=?",
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
        template_name: "PayrollReports/gratuity_provision",
        reportQuery: "gratuityProvision",
        input: "sub_department_id=?",
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
        template_name: "PayrollReports/absent_report",
        reportQuery: "absentReport",
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
      },
      {
        subitem: "Employee Loan report",
        template_name: "PayrollReports/employee_loans",
        reportQuery: "loanApplication",
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
        subitem: "Employee Advance report",
        template_name: "PayrollReports/employee_loans",
        reportQuery: "loanApplication",
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
        subitem: "Salary Slips",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Recon Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Salary Statement Detail",
        reportUri: "/salary/detailSalaryStatement",
        module: "hrManagement",
        template_name: "PayrollReports/salary_statement_detail",
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
        subitem: "Bank Transfer letter with statement",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Employee Statistics reports",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Final Settlement report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },

      {
        subitem: "Shift Rostering reports",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },

      {
        subitem: "Salary Component Wise reports",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Employee Ledger",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Attendance Reports",
        template_name: "PayrollReports/attendence_report",
        reportUri: "/attendance/loadAttendance",
        module: "hrManagement",
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
      },
      {
        subitem: "Document Expiry Reports",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },

      {
        subitem: "Nationality Wise and Department Wise Statistics",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "Inventory",
    submenu: [
      {
        subitem: "Items Consumption Report",
        reportName: "departmentDoctorConsumption",
        pageSize: "A4",
        requireIframe:true,
        pageOrentation: "landscap", //"portrait",
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
            type: "dropdown",
            name: "status_id",
            initialLoad: true,
            isImp: false,
            label: "Select Items",
            link: {
              uri: "/appointment/getAppointmentStatus",
              module: "frontDesk"
            },
            dataSource: {
              textField: "description",
              valueField: "hims_d_appointment_status_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Items Stock Register - Category wise",
        template_name: "asset_war_exp",
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
            type: "dropdown",
            name: "status_id",
            initialLoad: true,
            isImp: false,
            label: "Select Items",
            link: {
              uri: "/appointment/getAppointmentStatus",
              module: "frontDesk"
            },
            dataSource: {
              textField: "description",
              valueField: "hims_d_appointment_status_id",
              data: undefined
            }
          }]
        //reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
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
  },
  {
    name: "Pharmacy",
    submenu: [
      {
        subitem: "List of Receipts",
        template_name: "SalesReciptList",
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
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sales Invoice",
        template_name: "SalesInvoiceList",
        reportParameters: [{
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
          }]
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Daily Collection - Consolidated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Bill Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Date Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statment ItemWise Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Claims Generated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "Incentives",
    submenu: [
      {
        subitem: "Clinic - Doctor Invoices Summary",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Clinic / Doctor Invoices",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor's Incentives",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Incentives",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Monthly Summary - Referred Cases",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Outside Referrals",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referral Clinics - Overdue Payments",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referral Clinics - Overdue Receipts",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referrals External",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referrals Internal",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "Insurance",
    submenu: [
      {
        subitem: "Claim Rejection Reports",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Outstanding",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Outstanding - Remittence Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Received",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Received - Remittence Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Rejected - Reason Count",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Summary - Monthly",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Company wise Claim Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Consolidated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Overdue",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Received - Ageing Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Report - Consolidated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Status Report - Invoice Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Claims Generated",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Claims Write Off",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Services Report -Undelivered",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary Of Claims Generated - Formats",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Consolidated - Company Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Consolidated - Year Wise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Overdue and Outstanding",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Write Off Claims List-Servicewise",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "Laboratory",
    submenu: [
      {
        subitem: " Accession TAT",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "  Antimicrobial Resistence Surveillance Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Clinic wise Net Sale Report  ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Collection Summary - Investigations",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Delete Bill Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor wise Test Register",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Email Delivery Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Email Log",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Equipment Wise Test Details  ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Equipment Wise Test Param Details",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Incentive Payable Report ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Incentive Receivable Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Lab Result Statistics Report     ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Credit Bills ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Office Wise Clinic Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Pending Reports  ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Lab Test",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Print TRF   ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Problem Samples Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Revenue Summary ",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Reverse Authentication Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "SMS Log",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT- Analytical Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Test Wise Income",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " TRF List",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Unpaid Bill Report",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Workload Register",
        template_name: "asset_war_exp",
        reportParameters: []
        //reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "Tax Reports",
    submenu: [
      {
        subitem: "Tax Report Summary",
        template_name: "tax_report_summary",
        reportParameters: []
        //reportParameters: () => <VatReports ui="vat_report_detailed" />
      },
      {
        subitem: "Tax Report Detail",
        template_name: "tax_report_detailed",
        reportParameters: []
        //reportParameters: () => <VatReports ui="vat_report_detailed" />
      }
    ]
  },
  {
    name: "Project Payroll",
    submenu: [
      {
        subitem: "Project wise Payroll",
        template_name: "ProjectPayroll/projectWisePayroll",
        reportQuery: "projectWisePayroll",
        reportUri: "/projectjobcosting/getProjectWiseJobCost",
        module: "hrManagement",
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
