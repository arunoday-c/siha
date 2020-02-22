export default function ProjectPayroll({
  hospital_id,
  LOCAL_TYPE,
  moment,
  allYears,
  MONTHS,
  algaehApiCall
}) {
  return {
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
        componentCode: "RPT_PRO_PROJ",
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
        componentCode: "RPT_PRO_DES",
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
  };
}
