export default function Income({
  hospital_id,
  RECEIPT_TYPE,
  cashier_id,
  FORMAT_YESNO,
  spotlightSearch,
  SENDOUT_TYPE,
  FORMAT_PAYTYPE,
}) {
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
        subitem: "Income by Cashier - POS",
        reportName: "userWiseBillPos",
        componentCode: "RPT_INC_CASH_POS",
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
          // {
          //   className: "col-6 form-group AutosearchClass",
          //   type: "Autosearch",
          //   name: "item_id",
          //   isImp: false,
          //   columns: spotlightSearch.Services.onlyService,
          //   displayField: "item_description",
          //   value: null,
          //   searchName: "hospitalserviceonly",
          //   label: "Services List",
          // },
          {
            className: "col-12 form-group AutosearchClass",
            type: "selectMultiple",
            name: "hims_d_services_ids",
            isImp: false,
            link: {
              uri: "/serviceType/serviceList",
              module: "masterSettings",
            },
            value: null,
            data: undefined,
            label: "Services List",
          },
        ],
      },
      {
        subitem: "Income Services by Customer",
        reportName: "incomeServiceByCustomer",
        componentCode: "RPT_INC_SRV_CUS",
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
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "service_type_id",
          //   initialLoad: true,
          //   isImp: false,
          //   link: {
          //     uri: "/serviceType",
          //     module: "masterSettings",
          //   },
          //   dataSource: {
          //     textField: "service_type",
          //     valueField: "hims_d_service_type_id",
          //     data: undefined,
          //   },
          // },
          {
            className: "col-6 form-group AutosearchClass",
            type: "selectMultiple",
            name: "hims_d_services_ids",
            isImp: false,
            link: {
              uri: "/serviceType/serviceList",
              module: "masterSettings",
            },
            value: null,
            data: undefined,
            label: "Services List",
          },
          {
            className: "col-6 form-group AutosearchClass",
            type: "selectMultiple",
            name: "hims_d_insurance_sub_ids",
            isImp: false,
            link: {
              uri: "/insurance/getSubInsuranceMulti",
              module: "insurance",
            },
            value: null,
            data: undefined,
            label: "Sub Company",
          },
        ],
      },
      {
        subitem: "Income by Lab Send In/Out",
        reportName: "sendInSendOutIncome",
        componentCode: "RPT_INC_SEND_IN_OUT",
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "is_SendOut",
            initialLoad: true,
            isImp: true,
            label: "Send Out Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: SENDOUT_TYPE,
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
            sort: "off",
            others: {
              sort: "off",
            },

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
                    : currentValue.value === "RF"
                    ? "refundReceipt"
                    : currentValue.value === "OPBC"
                    ? "opBillCancelReceipt"
                    : currentValue.value === "OPC"
                    ? "opCreditReceipt"
                    : "";
                callback({ reportQuery: reportQuery });
              },
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
        subitem: "Income by Payment Type",
        reportName: "opBillIncomebyType",
        requireIframe: true,
        componentCode: "RPT_INC_PAY_TYP",
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
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
            type: "dropdown",
            name: "pay_type",
            initialLoad: true,
            isImp: true,
            label: "Payment Type",
            sort: "off",
            others: {
              sort: "off",
            },

            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_PAYTYPE,
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
        subitem: "Income by Transfer Type",
        reportName: "incomebyTransferType",
        requireIframe: true,
        componentCode: "RPT_INC_TRF_TYP",
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
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
            name: "card_name",
            initialLoad: true,
            isImp: false,
            label: "Select Transfer Type",
            link: {
              uri: "/cardmaster/getCards",
              module: "masterSettings",
            },
            value: cashier_id,
            dataSource: {
              textField: "card_name",
              valueField: "hims_d_bank_card_id",
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Revenue Report",
        // template_name: "Income/dailyCashCollection",
        reportName: "revenueHisReport",
        componentCode: "RPT_INC_REV_RPT",
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "show_vat",
            initialLoad: true,
            isImp: true,
            label: "Show Vat",
            sort: "off",
            others: {
              sort: "off",
            },

            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
        ],
      },
      {
        subitem: "Company Revenue Report",
        // template_name: "Income/dailyCashCollection",
        reportName: "companyWiseRevenue",
        componentCode: "RPT_INC_COM_REV_RPT",
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
            type: "datePicker",
            picker: "week",
            name: "week_date",
            label: "Select a Week",
            // isImp: true,
            size: "small",
            maxDate: new Date(),
          },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "date",
          //   name: "from_date",
          //   isImp: true,
          //   others: {
          //     maxDate: new Date(),
          //     minDate: null,
          //   },
          // },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "date",
          //   name: "to_date",
          //   isImp: true,
          //   others: {
          //     maxDate: new Date(),
          //     minDate: null,
          //   },
          // },
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "show_vat",
            initialLoad: true,
            isImp: true,
            label: "Show with VAT",
            sort: "off",
            others: {
              sort: "off",
            },

            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "primary_sub_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Sub Company",
          //   link: {
          //     uri: "/insurance/getSubInsurance",
          //     module: "insurance",
          //   },
          //   dataSource: {
          //     textField: "insurance_sub_name",
          //     valueField: "hims_d_insurance_sub_id",
          //   },
          // },
          {
            className: "col-12 form-group AutosearchClass",
            type: "selectMultiple",
            name: "hims_d_insurance_sub_ids",
            isImp: false,
            link: {
              uri: "/insurance/getSubInsuranceMulti",
              module: "insurance",
            },
            value: null,
            data: undefined,
            label: "Sub Company",
          },
        ],
      },
      {
        subitem: "Daily Cash Collection - Summary",
        // template_name: "Income/dailyCashCollection",
        reportName: "dailyCashCollection",
        componentCode: "RPT_INC_CASH_COLL",
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
        subitem: "Daily Cash Collection - Detail",
        // template_name: "Income/dailyCashCollection",
        reportName: "dailyCashCollectionDetail",
        componentCode: "RPT_INC_CASH_COLL_DTL",
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
        subitem: "Daily Transaction",
        reportName: "DailyTransaction",
        componentCode: "RPT_INC_DLY_TRAN",
        directEcel: true,
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
