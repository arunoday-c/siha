export default function Insurance({ hospital_id }) {
  return {
    name: "Insurance",
    excel: "true",
    submenu: [
      {
        subitem: "All Claim Statement",
        reportName: "allClaimStatementInsurance",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        // componentCode: "RPT_INC_SALES",

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
        ],
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
    ],
  };
}
