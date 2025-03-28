export default function Hr({
  hospital_id,
  algaehApiCall,
  MONTHS,
  EMPLOYEE_STATUS,
  EMPLOYEE_TYPE,
  COMPARISON,
  EMP_FORMAT_GENDER,
  DATE_OF_JOIN,
  moment,
  allYears,
  EXPIRY_STATUS,
}) {
  return {
    name: "HR report",
    excel: "true",
    submenu: [
      {
        subitem: "Employee - Dept/Sub Dept Wise",
        reportName: "staffListReport",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_HR_EMP_DEP",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_status",
            initialLoad: true,
            isImp: false,
            label: "Employee Status",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_STATUS,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - Age Wise",
        reportName: "ageWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_HR_EMP_AGE",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "age_range",
            initialLoad: true,
            isImp: true,
            label: "RANGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: COMPARISON,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "text",
            name: "age",
            initialLoad: false,
            isImp: true,
            label: "ENTER AGE",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - Gender Wise",
        reportName: "genderWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_HR_GEN",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "sex",
            initialLoad: true,
            isImp: false,
            label: "Employee Gender",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMP_FORMAT_GENDER,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - Nationality Wise",
        reportName: "nationalityWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_HR_EMP_NAT",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality",
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      // {
      //   subitem: "Employee - Country & Wise",
      //   reportName: "countryStateWiseEmployee",
      //   requireIframe: true,
      //   pageSize: "A3",
      //   componentCode: "RPT_HR_EMP_NAT",
      //   pageOrentation: "landscape",
      //   reportParameters: [
      //     {
      //       className: "col-3 form-group mandatory",
      //       type: "dropdown",
      //       name: "hospital_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "branch",
      //       link: {
      //         uri: "/organization/getOrganizationByUser",
      //       },
      //       value: hospital_id,
      //       dataSource: {
      //         textField: "hospital_name",
      //         valueField: "hims_d_hospital_id",
      //         data: undefined,
      //       },

      //       events: {
      //         onChange: (reportState, currentEvent) => {
      //           //provider_id_list CONTROL NAME AND APPEND BY _LIST
      //           algaehApiCall({
      //             uri: "/branchMaster/getBranchWiseDepartments",
      //             module: "masterSettings",
      //             method: "GET",
      //             data: { hospital_id: currentEvent.value },

      //             onSuccess: (result) => {
      //               reportState.setState({
      //                 department_id_list: result.data.records,
      //               });
      //             },
      //           });
      //         },
      //         onClear: (reportState, currentName) => {
      //           reportState.setState({
      //             [currentName]: undefined,
      //             department_id_list: [],
      //           });
      //         },
      //       },
      //     },
      //     {
      //       className: "col-3 form-group",
      //       type: "dropdown",
      //       name: "country_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "country",
      //       link: {
      //         uri: "/masters/get/country",
      //       },
      //       dataSource: {
      //         textField: "country_name",
      //         valueField: "hims_d_country_id",
      //         data: undefined,
      //       },
      //     },
      //     {
      //       className: "col-3 form-group",
      //       type: "dropdown",
      //       name: "employee_group_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "Employee Group",
      //       link: {
      //         uri: "/hrsettings/getEmployeeGroups",
      //         module: "hrManagement",
      //       },
      //       dataSource: {
      //         textField: "group_description",
      //         valueField: "hims_d_employee_group_id",
      //       },
      //     },
      //     {
      //       className: "col-3 form-group",
      //       type: "dropdown",
      //       name: "department_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "Department",
      //       link: {
      //         uri: "/department/get",
      //         module: "masterSettings",
      //       },
      //       dataSource: {
      //         textField: "department_name",
      //         valueField: "hims_d_department_id",
      //         data: undefined,
      //       },
      //       events: {
      //         onChange: (reportState, currentEvent) => {
      //           reportState.setState({
      //             [currentEvent.name]: currentEvent.value,
      //             department_id: currentEvent.value,
      //             sub_department_id_list: currentEvent.selected.subDepts,
      //           });
      //         },
      //         onClear: (reportState, currentName) => {
      //           reportState.setState({
      //             [currentName]: undefined,
      //             sub_department_id_list: [],
      //           });
      //         },
      //       },
      //     },
      //     {
      //       className: "col-3 form-group",
      //       type: "dropdown",
      //       name: "sub_department_id",
      //       isImp: false,
      //       label: "Sub Department",
      //       dataSource: {
      //         textField: "sub_department_name",
      //         valueField: "hims_d_sub_department_id",
      //         data: undefined,
      //       },
      //     },
      //   ],
      // },
      {
        subitem: "Employee - Religion Wise",
        reportName: "religionWiseEmployee",
        requireIframe: true,
        pageSize: "A3",
        componentCode: "RPT_HR_EMP_REG",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "religion_id",
            initialLoad: true,
            isImp: false,
            label: "Religion",
            link: {
              uri: "/masters/get/relegion",
            },
            dataSource: {
              textField: "religion_name",
              valueField: "hims_d_religion_id",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - Designation Wise",
        reportName: "designationWiseEmployee",
        componentCode: "RPT_HR_EMP_DESG",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "designation_id",
            initialLoad: true,
            isImp: false,
            label: "designation",
            link: {
              uri: "/hrsettings/getDesignations",
              module: "hrManagement",
            },
            dataSource: {
              textField: "designation",
              valueField: "hims_d_designation_id",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 ",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - Status Wise",
        reportName: "statusWiseEmployee",
        componentCode: "RPT_HR_EMP_STAT",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_status",
            initialLoad: true,
            isImp: false,
            label: "Employee Status",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_STATUS,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Employee - New Joinee Month Wise",
        reportName: "newJoiningEmployee",
        componentCode: "RPT_HR_WMP_NEW",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "date_of_join",
            initialLoad: true,
            isImp: false,
            label: "Joined",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: DATE_OF_JOIN,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "year",
            isImp: false,
            initialLoad: true,
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_group_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "employee_type",
            initialLoad: true,
            isImp: false,
            label: "Employee Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EMPLOYEE_TYPE,
            },
          },
        ],
      },
      {
        subitem: "Identification Expiry Report",
        reportName: "idExpiryEmployee",
        componentCode: "RPT_HR_ID_EXP",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS,
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            hide: (state) => {
              return state.parameterCollection?.expiry_status === "E";
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            hide: (state) => {
              return state.parameterCollection?.expiry_status === "E";
            },
          },
        ],
      },
    ],
  };
}
