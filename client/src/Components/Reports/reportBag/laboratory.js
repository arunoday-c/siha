export default function Laboratory({ hospital_id, SENDOUT_TYPE }) {
  return {
    name: "Laboratory",
    excel: "true",
    submenu: [
      {
        subitem: "Lab Send Out Report",
        reportName: "labReportSend",
        // reportQuery: "subDepartmentIncome",
        componentCode: "RPT_LAB_SEND",
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
            name: "is_SendOut",
            initialLoad: true,
            // isImp: true,
            label: "Send Out Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: SENDOUT_TYPE,
            },
          },
        ],
      },
    ],
  };
}
