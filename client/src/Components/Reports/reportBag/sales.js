export default function sales({
  hospital_id,
  // RECEIPT_TYPE,
  // cashier_id,
  FORMAT_YESNO,
  algaehApiCall,
}) {
  return {
    name: "sales",
    excel: "true",
    submenu: [
      {
        subitem: "Sales - By Income",
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
            className: "col-3 form-group",
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
            className: "col-3 form-group",
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
            name: "posted_status",
            initialLoad: true,
            isImp: false,
            label: "Posted",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "revert_status",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Revert",
          //   dataSource: {
          //     textField: "name",
          //     valueField: "value",
          //     data: FORMAT_YESNO,
          //   },
          // },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "return_status",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Return",
          //   dataSource: {
          //     textField: "name",
          //     valueField: "value",
          //     data: FORMAT_YESNO,
          //   },
          // },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "cancel_status",
            initialLoad: true,
            isImp: false,
            label: "Cancel",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
        ],
      },
      {
        subitem: "Sales - By Item Category",
        reportName: "salesItemCatCus",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_INC_CUST_CAT_SALES",
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
        subitem: "Sales - By Cost Center",
        reportName: "invIncomeByCostCenter",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_INC_COST_CENTER",
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
        subitem: "Sales - Item Dispatch Detail",
        reportName: "SalesTransferReport",
        requireIframe: true,
        componentCode: "RPT_SAL_ITM_DTL",
        reportParameters: [
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
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
        subitem: "Sales - Service Detail",
        reportName: "SalesServiceDetail",
        requireIframe: true,
        componentCode: "RPT_SAL_SER_DTL",
        reportParameters: [
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
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
    ],
  };
}
