export default function Patient({
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
}) {
  return {
    name: "Patient Reports",
    excel: "true",
    submenu: [
      {
        subitem: "Patient Outstanding",
        template_name: "PatientReports/PatOutstandingSum",
        reportQuery: "patOutstandingSum",
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
        ],
      },
      {
        subitem: "Patient - Age Wise",
        reportName: "ageWisePatient",
        requireIframe: true,
        pageSize: "A4",
        componentCode: "RPT_HR_EMP_AGE",
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
    ],
  };
}
