export default function Payroll({
  hospital_id,
  LOCAL_TYPE,
  allYears,
  MONTHS,
  LEAVE_STATUS,
  LOAN_STATUS,
  ADV_LOAN_STATUS,
  algaehApiCall,
  moment,
}) {
  return {
    name: "Payroll Reports",
    excel: "true",
    submenu: [
      {
        subitem: "Attendance Reports",
        reportName: "attendanceReports",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_ATT",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Leave Reports",
        reportName: "leaveReportPayroll",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_LEAV",
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
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: [],
                });
              },
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  [currentEvent.name]: currentEvent.value,
                  department_id: currentEvent.value,
                  sub_department_id_list: currentEvent.selected.subDepts,
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "hims_d_leave_id",
            initialLoad: true,
            // isImp: true,
            link: {
              uri: "/selfService/getLeaveMaster",
              module: "hrManagement",
            },
            dataSource: {
              textField: "leave_description",
              valueField: "hims_d_leave_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "status",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LEAVE_STATUS,
            },
            events: {
              onChange: (reportState, currentValue) => {},
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Leave Accrual",
        reportName: "leaveAccuralPayroll",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_LEA_ACC",
        pageOrentation: "landscape", //"portrait",
        input: "sub_department_id=?",
        reportParameters: [
          // {
          //   className: "col-2 form-group mandatory",
          //   type: "dropdown",
          //   name: "year",
          //   isImp: true,
          //   initialLoad: true,
          //   value: moment().year(),
          //   dataSource: {
          //     textField: "name",
          //     valueField: "value",
          //     data: allYears
          //   }
          //   // events: {
          //   //   onChange: (reportState, currentValue) => {}
          //   // }
          // },
          // {
          //   className: "col-2 form-group mandatory",
          //   type: "dropdown",
          //   sort: "off",
          //   name: "month",
          //   isImp: true,
          //   initialLoad: true,
          //   value: moment().format("M"),
          //   dataSource: {
          //     textField: "name",
          //     valueField: "value",
          //     data: MONTHS
          //   },
          //   others: {
          //     sort: "off"
          //   }
          // },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Gratuity Provision",
        reportName: "gratuityProvisionStatementPayroll",
        input: "sub_department_id=?",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_GRA",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
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
        subitem: "Employee Loan Report",
        reportName: "EmployeeLoanReport",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_EMP_LOA",
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
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "status",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: LOAN_STATUS,
            },
            events: {
              onChange: (reportState, currentValue) => {},
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Salary Statement",
        reportName: "salaryStatementPayroll",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_SAL_STM",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
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
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Salary Statement Detail",
        reportName: "salaryStatementDetailsPayroll",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_SAL_STM_DTL",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
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
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Leave Salary Statement",
        reportName: "leaveSalaryStatementPayroll",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_PAY_LEA_SAL_STM",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Final Salary Statement Detail",
        reportName: "finalSalaryStatementDetails",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_FIN_SAL_STM_DTL",
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
              data: allYears,
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
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
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
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
              module: "masterSettings",
            },
            dataSource: {
              textField: "department_name",
              valueField: "hims_d_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/department/get/subdepartment",
                  module: "masterSettings",
                  method: "GET",
                  data: { department_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      sub_department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  sub_department_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
        //reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Earnings & Deductions Report",
        reportName: "employeeE&D",
        pageSize: "A3",
        componentCode: "RPT_PAY_EAR_DED",
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
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: allYears,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
                  edTypeValue: "E",
                },
                {
                  edType: "Deductions",
                  edTypeValue: "D",
                },
                {
                  edType: "Bonus",
                  edTypeValue: "B",
                },
              ],
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
                      miscellaneous_component: "Y",
                    },

                    onSuccess: (result) => {
                      reportState.setState({
                        earning_deductions_id_list: result.data.records,
                      });
                    },
                  });
                } else if (currentEvent.value === "D") {
                  algaehApiCall({
                    uri: "/payrollSettings/getMiscEarningDeductions",
                    module: "hrManagement",
                    method: "GET",
                    data: {
                      component_category: "D",
                      miscellaneous_component: "Y",
                    },

                    onSuccess: (result) => {
                      reportState.setState({
                        earning_deductions_id_list: result.data.records,
                      });
                    },
                  });
                }
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  earning_deductions_id_list: [],
                });
              },
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: undefined,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Leave Encashment Reports",
        reportName: "leaveReportEncashment",
        pageSize: "A3",
        componentCode: "RPT_PAY_LEA_ENC",
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
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },

            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/branchMaster/getBranchWiseDepartments",
                  module: "masterSettings",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      department_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  department_id_list: [],
                });
              },
            },
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
              data: allYears,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            label: "Employee Group",
            link: {
              uri: "/hrsettings/getEmployeeGroups",
              module: "hrManagement",
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_employee_group_id",
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "hims_d_leave_id",
            initialLoad: true,
            // isImp: true,
            link: {
              uri: "/selfService/getLeaveMaster",
              module: "hrManagement",
            },
            dataSource: {
              textField: "leave_description",
              valueField: "hims_d_leave_id",
              data: undefined,
            },
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
              data: LOCAL_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Advance Request Report",
        reportName: "employeeAdvanceReport",
        pageSize: "A3",
        componentCode: "RPT_PAY_ADV_REQ",
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
              uri: "/organization/getOrganizationByUser",
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },

            // events: {
            //   onChange: (reportState, currentEvent) => {
            //     //provider_id_list CONTROL NAME AND APPEND BY _LIST
            //     algaehApiCall({
            //       uri: "/branchMaster/getBranchWiseDepartments",
            //       module: "masterSettings",
            //       method: "GET",
            //       data: { hospital_id: currentEvent.value },

            //       onSuccess: (result) => {
            //         reportState.setState({
            //           department_id_list: result.data.records,
            //         });
            //       },
            //     });
            //   },
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //       department_id_list: [],
            //     });
            //   },
            // },
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
              data: allYears,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
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
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "status",
            initialLoad: true,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: ADV_LOAN_STATUS,
            },
            events: {
              onChange: (reportState, currentValue) => {},
            },
          },
        ],
      },
    ],
  };
}
