export default function Vat({
  hospital_id,
  moment,
  allYears,
  MONTHS,
  algaehApiCall,
}) {
  return {
    name: "VAT Reports",
    excel: "true",
    submenu: [
      {
        subitem: "Bill Wise VAT Report",
        reportName: "billWiseVatReport",
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
        subitem: "Detail VAT Report",
        reportName: "detailVatReport",
        requireIframe: true,
        // pageSize: "A4",
        // pageOrentation: "landscape", //"portrait",
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
        subitem: "Monthly VAT Report",
        reportName: "monthVatReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
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
          },
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "year",
            isImp: true,
            initialLoad: true,
            value: moment().year(),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: allYears,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            sort: "off",
            name: "month",
            isImp: false,
            initialLoad: true,
            value: moment().format("M"),
            dataSource: {
              textField: "name",
              valueField: "value",
              data: MONTHS,
            },
            others: {
              sort: "off",
            },
          },
        ],
      },
      {
        subitem: "Company wise VAT Report",
        reportName: "companyVATReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "primary_sub_id",
            initialLoad: true,
            isImp: false,
            label: "Sub Company",
            link: {
              uri: "/insurance/getSubInsurance",
              module: "insurance",
            },
            dataSource: {
              textField: "insurance_sub_name",
              valueField: "hims_d_insurance_sub_id",
            },
          },
        ],
      },
      {
        subitem: "Patient Wise VAT Report",
        reportName: "patientwiseReport",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
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
    ],
  };
}
