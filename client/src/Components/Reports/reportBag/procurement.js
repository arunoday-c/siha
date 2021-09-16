export default function Procurement({
  hospital_id,
  algaehApiCall,
  PO_FROM,
  moment,
  spotlightSearch,
  FORMAT_YESNO,
}) {
  return {
    name: "procurement",
    excel: "true",
    submenu: [
      {
        subitem: "PO & Receipt Details",
        reportName: "poTransationReport",
        // reportQuery: "subDepartmentIncome",
        requireIframe: true,
        componentCode: "RPT_PRO_PO_TRN_LOG",
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
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "PO_from",
            initialLoad: true,
            isImp: false,
            label: "PO Type",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: PO_FROM,
            },
          },
        ],
      },
    ],
  };
}
