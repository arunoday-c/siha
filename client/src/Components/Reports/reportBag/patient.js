export default function Patient({ hospital_id, COMPARISON, spotlightSearch }) {
  return {
    name: "Patient Reports",
    excel: "true",
    submenu: [
      {
        subitem: "Patient Outstanding",
        reportName: "patOutstandingSum",
        componentCode: "RPT_PAT_OUTS",
        requireIframe: true,
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "till_date",
            label: "Till Date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "search",
            name: "patient",
            label: "Patient",
            isImp: true,
            search: {
              searchName: "onlycreditpatients",
              columns: ["full_name", "patient_code", "contact_number"],
            },
          },
        ],
      },
      {
        subitem: "Patient - Age Wise",
        reportName: "ageWisePatient",
        componentCode: "RPT_PAT_AGE",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait",
        reportParameters: [
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
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
              onChange: (reportState, currentEvent) => {},
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
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
        ],
      },
      {
        subitem: "Patient - Service Type Wise",
        reportName: "serviceTypeWisePatientReport",
        componentCode: "RPT_PAT_SER_TYP",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait",
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
        ],
      },
      {
        subitem: "Patient - Service Wise",
        reportName: "serviceWisePatientReport",
        componentCode: "RPT_PAT_SER",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait",
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
          //   events: {
          //     onChange: (reportState, currentEvent) => {
          //       //provider_id_list CONTROL NAME AND APPEND BY _LIST
          //       algaehApiCall({
          //         uri: "/serviceTypes/getOnlyServiceList",
          //         module: "masterSettings",
          //         method: "GET",
          //         data: { service_type_id: currentEvent.value },

          //         onSuccess: (result) => {
          //           reportState.setState({
          //             service_id_list: result.data.records,
          //           });
          //         },
          //       });
          //     },
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //         service_id_list: [],
          //       });
          //     },
          //   },
          // },
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
            className: "col-6 form-group AutosearchClass",
            type: "Autosearch",
            name: "item_id",
            isImp: false,
            columns: spotlightSearch.Services.onlyService,
            displayField: "service_name",
            primaryDesc: "service_name",
            secondaryDesc: "service_code",
            // value: null,
            searchName: "hospitalserviceonly",
            label: "Services List",
          },
        ],
      },
    ],
  };
}
