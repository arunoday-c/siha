export default function Clinical({ hospital_id }) {
  return {
    name: "Clinical",
    submenu: [
      {
        subitem: "Cancelled Service by Patient",
        reportName: "cancelServiceByPatient",
        componentCode: "RPT_MIS_CAN_PAT",
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
        subitem: "Discounted Services by Patient",
        reportName: "discountServiceByPatient",
        componentCode: "RPT_MIS_DIS_SRV_PAT",
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
        subitem: "Ordred Package by Patient",
        reportName: "orderdPackageByPatient",
        componentCode: "RPT_MIS_ORD_PCK_PAT",
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
        subitem: "Utlized Package by Patient",
        reportName: "utlizePackageByPatient",
        componentCode: "RPT_MIS_UTL_PCK_PAT",
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
        subitem: "Outstanding Package by Patient",
        reportName: "outstandingPackageByPatient",
        componentCode: "RPT_MIS_OUT_PCK_PAT",
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
        subitem: "Cancelled Package by Patient",
        reportName: "cancelPackageByPatient",
        componentCode: "RPT_MIS_CAN_PCK_PAT",
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
        subitem: "Type Package by Branch",
        reportName: "typePackageByBranch",
        componentCode: "RPT_MIS_PCK_BNH",
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
        subitem: "Count by Services",
        reportName: "countByService",
        componentCode: "RPT_MIS_CNT_SRV",
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
        ],
      },
    ],
  };
}
