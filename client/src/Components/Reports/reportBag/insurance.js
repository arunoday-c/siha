export default function Insurance({
  hospital_id,
  algaehApiCall,
  spotlightSearch,
}) {
  return {
    name: "Insurance",
    excel: "true",
    submenu: [
      {
        subitem: "All Claim Statement",
        reportName: "allClaimStatementInsurance",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_INS_ALL_CLM",

        // subitem: "All Claim Statement",
        // template_name: "allClaimStatementInsurance",
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
            name: "insurance_provider_id",
            initialLoad: true,
            isImp: false,
            label: "Company",
            link: {
              uri: "/insurance/getInsuranceProviders",
              module: "insurance",
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  insurance_provider_id: null,
                  sub_insurance_id: null,
                  claims: [],
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  insurance_provider_id: null,
                  sub_insurance_id: null,
                  claims: [],
                });
              },
            },
            dataSource: {
              textField: "insurance_provider_name",
              valueField: "hims_d_insurance_provider_id",
              data: undefined,
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
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Sub Company",
          //   dataSource: {
          //     textField: "insurance_sub_name",
          //     valueField: "hims_d_insurance_sub_id",
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
        ],
      },
      {
        subitem: "Company Price List",
        reportName: "insuranceCompanyPriceListReport",
        requireIframe: true,
        componentCode: "RPT_INS_COM_PST_LST",
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
            name: "insurance_provider_id",
            initialLoad: true,
            isImp: false,
            label: "Company",
            link: {
              uri: "/insurance/getInsuranceProviders",
              module: "insurance",
            },
            events: {
              onChange: (reportState, currentEvent) => {
                reportState.setState({
                  insurance_provider_id: null,
                  sub_insurance_id: null,
                  claims: [],
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  insurance_provider_id: null,
                  sub_insurance_id: null,
                  claims: [],
                });
              },
            },
            dataSource: {
              textField: "insurance_provider_name",
              valueField: "hims_d_insurance_provider_id",
              data: undefined,
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
        ],
      },
      {
        subitem: "Statement Detail Report",
        reportName: "claimStatementDetailReport",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_INS_CLM_DTL",

        // subitem: "All Claim Statement",
        // template_name: "allClaimStatementInsurance",
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
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "insurance_provider_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Company",
          //   link: {
          //     uri: "/insurance/getInsuranceProviders",
          //     module: "insurance",
          //   },

          //   events: {
          //     onChange: (reportState, currentEvent) => {
          //       algaehApiCall({
          //         uri: "/insurance/getSubInsurance",
          //         module: "insurance",
          //         method: "GET",
          //         data: { insurance_provider_id: currentEvent.value },

          //         onSuccess: (result) => {
          //           reportState.setState({
          //             hims_d_insurance_sub_id_list: result.data.records,
          //           });
          //         },
          //       });
          //     },
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //         hims_d_insurance_sub_id_list: [],
          //       });
          //     },
          //   },

          //   dataSource: {
          //     textField: "insurance_provider_name",
          //     valueField: "hims_d_insurance_provider_id",
          //     data: undefined,
          //   },
          // },

          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "hims_d_insurance_sub_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Sub Company",
          //   dataSource: {
          //     textField: "insurance_sub_name",
          //     valueField: "hims_d_insurance_sub_id",
          //     data: [],
          //   },
          //   events: {
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //       });
          //     },
          //   },
          // },
          {
            className: "col-6 form-group AutosearchClass",
            type: "Autosearch",
            name: "item_id",
            isImp: false,
            columns: spotlightSearch.Insurance.InsuranceStatementReport,
            displayField: "insurance_statement_number",
            primaryDesc: "insurance_statement_number",
            secondaryDesc: "insurance_sub_name",
            // value: null,
            searchName: "InsuranceStatementReport",
            label: "Statement No",
          },
        ],
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
    ],
  };
}
