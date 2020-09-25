export default function Income({ hospital_id, RECEIPT_TYPE, cashier_id }) {
  return {
    name: "Income",
    excel: "true",
    submenu: [
      {
        subitem: "Income by Department",
        reportName: "departmentWiseIncome",
        // reportQuery: "subDepartmentIncome",
        componentCode: "RPT_INC_DEPT",
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
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
        ],
      },
      {
        subitem: "Income by Doctor",
        reportName: "depDocWiseReport",
        componentCode: "RPT_INC_DOC",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"portrait",
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
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
            link: {
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings",
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets,
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors,
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: [],
                });
              },
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Income by Cashier",
        reportName: "userWiseBill",
        componentCode: "RPT_INC_CASH",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"portrait",
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
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "cashier_name",
            initialLoad: true,
            isImp: false,
            label: "Select Cashier",
            link: {
              uri: "/shiftAndCounter/getCashiers",
              module: "masterSettings",
            },
            value: cashier_id,
            dataSource: {
              textField: "cashier_name",
              valueField: "cashier_id",
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Income by Patient",
        reportName: "patientWiseIncome",
        componentCode: "RPT_INC_PAT",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"portrait",
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
        ],
      },
      {
        subitem: "Income by Service Type",
        reportName: "opBillSummary",
        componentCode: "RPT_INC_SVR_TYPE",
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
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
        ],
      },
      {
        subitem: "Income by Services",
        reportName: "opBillDetails",
        componentCode: "RPT_INC_SVRS",
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
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
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
        ],
      },
      {
        subitem: "Income by Receipt Type",
        reportName: "opBillIncomeReceipt",
        requireIframe: true,
        componentCode: "RPT_INC_REC_TYP",
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "receipt_type",
            initialLoad: true,
            isImp: true,
            label: "Receipt Type",

            dataSource: {
              textField: "name",
              valueField: "value",
              data: RECEIPT_TYPE,
            },
            events: {
              onChange: (reportState, currentValue, callback) => {
                let reportQuery =
                  currentValue.value === "OP"
                    ? "opBillReceipt"
                    : currentValue.value === "AD"
                    ? "advanceReceipt"
                    : currentValue.value === "OPC"
                    ? "opCreditReceipt"
                    : "";
                callback({ reportQuery: reportQuery });
              },
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
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
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: false,
            label: "Department",
            link: {
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings",
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets,
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors,
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: [],
                });
              },
            },
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
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Daily Cash Collection - Summary",
        //template_name: "Income/dailyCashCollection",
        reportName: "RPT_DLY_COLL",
        componentCode: "RPT_INC_CASH_COLL",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
        ],
      },
      {
        subitem: "Income by Sales",
        reportName: "salesWiseIncome",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_INC_SALES",
        reportParameters: [
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "hospital_id",
          //   initialLoad: true,
          //   isImp: true,
          //   label: "Branch",
          //   link: {
          //     uri: "/organization/getOrganizationByUser",
          //   },
          //   value: hospital_id,
          //   dataSource: {
          //     textField: "hospital_name",
          //     valueField: "hims_d_hospital_id",
          //     data: undefined,
          //   },
          // },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            type: "dropdown",
            name: "employee_id",
            initialLoad: true,
            isImp: false,
            label: "Sales Person",
            link: {
              uri: "/employee/get",
              module: "hrManagement",
              data: { department_type: "S" },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "full_name",
              valueField: "hims_d_employee_id",
              data: undefined,
            },
          },
          {
            type: "dropdown",
            name: "customer_id",
            initialLoad: true,
            isImp: false,
            label: "Customer",
            link: {
              uri: "/customer/getCustomerMaster",
              module: "masterSettings",
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "customer_name",
              valueField: "hims_d_customer_id",
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Daily Transaction",
        reportName: "DailyTransaction",
        directEcel: true,
        componentCode: "RPT_DAILY_TRANSACTION",
        hideButtons: ["preview", "downloadpdf"],
        requireIframe: true,
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "date",
            isImp: true,
            others: {
              maxDate: new Date(),
            },
          },
        ],
      },
    ],
  };
}
