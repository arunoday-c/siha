export default function Vat({
  hospital_id,
  moment,
  allYears,
  MONTHS,
  algaehApiCall
}) {
  return {
    name: "VAT Reports",
    submenu: [
      {
        subitem: "Detail VAT Report",
        reportName: "detailVatReport",
        requireIframe: true,
        pageSize: "A4",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          }
        ]
      },
      {
        subitem: "Monthly VAT Report",
        reportName: "monthVatReport",
        requireIframe: true,
        pageSize: "A4",
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
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
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
          }
        ]
      },
      {
        subitem: "Company wise VAT Report",
        reportName: "companyVATReport",
        requireIframe: true,
        pageSize: "A4",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
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
          }
        ]
      },
      {
        subitem: "Patient Wise VAT Report",
        reportName: "patientwiseReport",
        requireIframe: true,
        pageSize: "A4",
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
            className: "col-2 form-group",
            type: "dropdown",
            name: "nationality_id",
            initialLoad: true,
            isImp: false,
            label: "nationality",
            link: {
              uri: "/masters/get/nationality"
            },
            dataSource: {
              textField: "nationality",
              valueField: "hims_d_nationality_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "",
            initialLoad: true,
            isImp: false,
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
          }
        ]
      }
    ]
  };
}
