export default function Insurance({ algaehApiCall }) {
  return {
    name: "Insurance",
    submenu: [
      {
        subitem: "All Claim Statement",
        template_name: "allClaimStatementInsurance",
        reportParameters: [
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: true,
            label: "Company",
            link: {
              uri: "/insurance/getInsuranceProviders"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      location_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: []
                });
              }
            },
            dataSource: {
              textField: "insurance_provider_name",
              valueField: "hims_d_insurance_provider_id"
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
            label: "Sub Company",
            dataSource: {
              // textField: "full_name",
              // valueField: "employee_id",
              // data: undefined
            }
          }
        ]
        //reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      }
    ]
  };
}
