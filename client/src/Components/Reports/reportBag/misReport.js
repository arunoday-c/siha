export default function misReport({
  hospital_id,
  // RECEIPT_TYPE,
  // cashier_id,
  FORMAT_YESNO,
  algaehApiCall,
}) {
  return {
    name: "misReport",
    excel: "true",
    submenu: [
      {
        subitem: "Hospital Service List",
        reportName: "hospitalServiceReport",
        // reportQuery: "subDepartmentIncome",
        // componentCode: "RPT_INC_DEPT",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Branch",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "service_type_id",
            initialLoad: true,
            isImp: false,
            link: {
              uri: "/serviceType",
              module: "masterSettings",
            },
            dataSource: {
              textField: "service_type",
              valueField: "hims_d_service_type_id",
              data: undefined,
            },
          },
          {
            className: "col-4 form-group",
            type: "dropdown",
            name: "accound_id_assigned",
            initialLoad: true,
            isImp: false,
            label: "Account not assigned Only",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
        ],
      },
      {
        subitem: "Branch Wise Department List",
        reportName: "branchDepartmentReport",
        // reportQuery: "subDepartmentIncome",
        // componentCode: "RPT_INC_DEPT",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "Branch",
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
        ],
      },
    ],
  };
}
