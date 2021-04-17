export default function Pharmacy({
  hospital_id,
  algaehApiCall,
  FORMAT_PAYTYPE,
  EXPIRY_STATUS,
  moment,
  spotlightSearch,
  FORMAT_YESNO,
}) {
  return {
    name: "Pharmacy",
    excel: "true",
    submenu: [
      {
        subitem: "Items Stock Report",
        reportName: "itemsStockPharmacy",
        componentCode: "RPT_PHR_ITM_STK",
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },

            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",

            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: null, //"item_description",
            label: "Item Name",
          },
        ],
      },
      {
        subitem: "Consumption List",
        reportName: "consumptionListPharmacy",
        componentCode: "RPT_PHR_CONS_LST",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: "item_description",
            label: "Item Name",
            // link: {
            //   uri: "/pharmacy/getItemMaster",
            //   module: "pharmacy",
            // },

            // events: {
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //     });
            //   },
            // },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "item_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Item",

          //   link: {
          //     uri: "/pharmacy/getItemMaster",
          //     module: "pharmacy",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_item_master_id",
          //     data: undefined,
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "stockUsed",

            isImp: true,
            label: "Show for last",

            dataSource: {
              textField: "stockUsed",
              valueField: "stockUsedValue",
              data: [
                {
                  stockUsed: "1 months",
                  stockUsedValue: moment()
                    .add(-1, "months")
                    .format("YYYY-MM-DD"),
                },
                {
                  stockUsed: "2 months",
                  stockUsedValue: moment()
                    .add(-2, "months")
                    .format("YYYY-MM-DD"),
                },
                {
                  stockUsed: "3 months",
                  stockUsedValue: moment()
                    .add(-3, "months")
                    .format("YYYY-MM-DD"),
                },
              ],
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
        ],
      },
      {
        subitem: "Items Consumption Report",
        reportName: "itemsConsumptionPharmacy",
        componentCode: "RPT_PHR_ITM_CONS",
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },

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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: "item_description",
            label: "Item Name",
            // link: {
            //   uri: "/pharmacy/getItemMaster",
            //   module: "pharmacy",
            // },

            // events: {
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //     });
            //   },
            // },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "item_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Item",

          //   link: {
          //     uri: "/pharmacy/getItemMaster",
          //     module: "pharmacy",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_item_master_id",
          //     data: undefined,
          //   },
          // },
        ],
      },
      {
        subitem: "List of Receipts",
        reportName: "salesReceiptListPharmacy",
        componentCode: "RPT_PHR_LST_RCP",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
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
            type: "time",
            name: "from_time",
            label: "From Time",
            isImp: true,
            value: "00:00",
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
            className: "col-3 form-group mandatory",
            type: "time",
            name: "to_time",
            label: "To Time",
            isImp: true,
            value: "23:59",
          },
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyUsers",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      cashier_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  cashier_id_list: [],
                });
              },
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
            name: "location_id",

            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y",
              },
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "cashier_id",

            label: "User/Employee",
            link: {
              uri: "/pharmacy/getPharmacyUsers",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "full_name",
              valueField: "algaeh_d_app_user_id",
              data: [],
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "pay_type",
            initialLoad: true,
            isImp: false,
            label: "Receipt Type",
            link: {},
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_PAYTYPE,
            },
          },
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sales Invoice",
        reportName: "salesInvoiceListPharmacy",
        componentCode: "RPT_PHR_LST_SAL",
        // template_name: "salesInvoiceListPharmacy",
        requireIframe: true,
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y",
              },
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
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
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sales Return",
        reportName: "salesReturnListPharmacy",
        componentCode: "RPT_PHR_SAL_RTN",
        // template_name: "salesReturnListPharmacy",
        requireIframe: true,
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y",
              },
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
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
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Daily Collection - Consolidated",
        //template_name: "dailyCollectionPharmacy",
        reportName: "dailyCollectionPharmacy",
        componentCode: "RPT_PHR_DLY_COL_CONS",
        requireIframe: true,
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              data: {
                allow_pos: "Y",
              },
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
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
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Expiry Report",
        reportName: "itemExpiryPharmacy",
        componentCode: "RPT_PHR_ITM_EXP",
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "expiry_status",
            initialLoad: true,
            isImp: false,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS,
            },
          },

          {
            className: "col-3 form-group",
            type: "date",
            name: "from_date",
            isImp: false,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 form-group",
            type: "date",
            name: "to_date",
            isImp: false,
            others: {
              maxDate: null,
              minDate: null,
            },
          },

          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },

          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "group_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Group",
          //   dataSource: {
          //     textField: "group_description",
          //     valueField: "hims_d_item_group_id",
          //     data: [],
          //   },
          //   link: {
          //     uri: "/pharmacy/getItemGroup",
          //     module: "pharmacy",
          //   },
          //   events: {
          //     onChange: (reportState, currentEvent) => {
          //       //provider_id_list CONTROL NAME AND APPEND BY _LIST
          //       algaehApiCall({
          //         uri: "/pharmacy/getItemCategory",
          //         module: "pharmacy",
          //         method: "GET",
          //         data: { hims_d_item_category_id: currentEvent.value },

          //         onSuccess: (result) => {
          //           reportState.setState({
          //             category_id_list: result.data.records,
          //           });
          //         },
          //       });
          //     },
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //         category_id_list: [],
          //       });
          //     },
          //   },
          // },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "category_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Category",
          //   dataSource: {
          //     textField: "category_desc",
          //     valueField: "hims_d_item_category_id",
          //     data: [],
          //   },
          //   events: {
          //     onChange: (reportState, currentEvent) => {
          //       //provider_id_list CONTROL NAME AND APPEND BY _LIST
          //       algaehApiCall({
          //         uri: "/pharmacy/getItemMaster",
          //         module: "pharmacy",
          //         method: "GET",
          //         data: { category_id: currentEvent.value },

          //         onSuccess: (result) => {
          //           reportState.setState({
          //             item_id_list: result.data.records,
          //           });
          //         },
          //       });
          //     },
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //         item_id_list: [],
          //       });
          //     },
          //   },
          // },
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: "item_description",
            label: "Item Name",
            // link: {
            //   uri: "/pharmacy/getItemMaster",
            //   module: "pharmacy",
            // },

            // events: {
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //     });
            //   },
            // },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "item_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Item",

          //   link: {
          //     uri: "/pharmacy/getItemMaster",
          //     module: "pharmacy",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_item_master_id",
          //     data: undefined,
          //   },
          //   events: {
          //     onClear: (reportState, currentName) => {
          //       reportState.setState({
          //         [currentName]: undefined,
          //       });
          //     },
          //   },
          // },
        ],
      },
      {
        subitem: "Items Stock Register - Category wise",
        reportName: "itemStockEnquiryCategoryWisePharmacy",
        componentCode: "RPT_PHR_ITM_STK_CAT",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "date",
            name: "from_date",
            isImp: true,
            label: "From Date",
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
            label: "To Date",
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          {
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: true,
            label: "Category",

            link: {
              uri: "/pharmacy/getItemCategory",
              module: "pharmacy",
            },
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_item_category_id",
              data: undefined,
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getItemMaster",
                  module: "pharmacy",
                  method: "GET",
                  data: { category_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      item_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  item_id_list: [],
                });
              },
            },
          },

          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: [],
            },
          },
        ],
      },
      {
        subitem: "Items Stock Register - Date wise",
        reportName: "itemStockEnquiryDateWisePharmacy",
        componentCode: "RPT_PHR_ITM_STK_DT",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
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
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: "item_description",
            label: "Item Name",
            // link: {
            //   uri: "/pharmacy/getItemMaster",
            //   module: "pharmacy",
            // },

            // events: {
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //     });
            //   },
            // },
          },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "item_id",
          //   initialLoad: true,
          //   isImp: true,
          //   label: "Item",

          //   link: {
          //     uri: "/pharmacy/getItemMaster",
          //     module: "pharmacy",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_item_master_id",
          //     data: undefined,
          //   },
          // },
        ],
      },
      {
        subitem: "GP Statement - Bill Wise",
        reportName: "gpBillwisePharmacy",
        componentCode: "RPT_PHR_GP_STM",
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
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
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Date Wise",
        reportName: "gpDatewisePharmacy",
        componentCode: "RPT_PHR_GP_STM_DT",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
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
        ],
        //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Report",
        reportName: "pharmacyPurchaseReport",
        componentCode: "RPT_PHR_PUR",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ],
      },

      {
        subitem: "Pharmacy - Purchase Receipt Report",
        reportName: "pharmacyReceiptReport",
        componentCode: "RPT_PHR_REE",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },
            // value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
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
            name: "posted_status",
            initialLoad: true,
            isImp: false,
            label: "Posted",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "return_status",
            initialLoad: true,
            isImp: false,
            label: "Return",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: FORMAT_YESNO,
            },
          },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ],
      },
      {
        subitem: "Purchase Return Report",
        reportName: "pharmacyPurchaseReturnReport",
        componentCode: "RPT_PHR_PUR_RTN",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ],
      },
      {
        subitem: "Purchase report by item or supplier",
        reportName: "pharmacyPurchaseReportItemSupplier",
        componentCode: "RPT_PHR_PUR_ITM_SUP",
        requireIframe: true,
        pageSize: "A3",
        pageOrentation: "landscape",
        reportParameters: [
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: false,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser",
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
            },
            // value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined,
            },
          },
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Pharmacyitemmaster,
            searchName: "PurchaseOrderForPharmacy",
            value: "item_description",
            label: "Item Name",
            // link: {
            //   uri: "/pharmacy/getItemMaster",
            //   module: "pharmacy",
            // },

            // events: {
            //   onClear: (reportState, currentName) => {
            //     reportState.setState({
            //       [currentName]: undefined,
            //     });
            //   },
            // },
          },
          // {
          //   className: "col-3 form-group",
          //   type: "dropdown",
          //   name: "item_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Item",

          //   link: {
          //     uri: "/pharmacy/getItemMaster",
          //     module: "pharmacy",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_item_master_id",
          //     data: undefined,
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "vendor_id",
            initialLoad: true,
            isImp: false,
            label: "Vendor Name",

            link: {
              uri: "/vendor/getVendorMaster",
              module: "masterSettings",
            },
            dataSource: {
              textField: "vendor_name",
              valueField: "hims_d_vendor_id",
              data: undefined,
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                });
              },
            },
          },
          // {
          //   className: "col-3  form-group",
          //   type: "date",
          //   name: "from_date",
          //   isImp:false,
          //   others: {
          //     maxDate: new Date(),
          //     minDate: null,
          //   },
          // },

          // {
          //   className: "col-3  form-group",
          //   type: "date",
          //   name: "to_date",
          //   isImp: false,
          //   others: {
          //     maxDate: new Date(),
          //     minDate: null,
          //   },
          // },
          // {
          //   className: "col-3 form-group mandatory",
          //   type: "dropdown",
          //   name: "location_id",
          //   initialLoad: true,
          //   isImp: false,
          //   label: "Purchase No",
          //   dataSource: {
          //     textField: "location_description",
          //     valueField: "hims_d_inventory_location_id",
          //     data: []
          //   }
          // }
        ],
      },
      {
        subitem: "Transfer Report",
        reportName: "PharmacyTransferReport",
        componentCode: "RPT_PHR_TRAN",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/pharmacy/getPharmacyLocation",
                  module: "pharmacy",
                  method: "GET",
                  data: { hospital_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      location_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  location_id_list: [],
                });
              },
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
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "From Location ",
            link: {
              uri: "/pharmacy/getPharmacyLocation",
              module: "pharmacy",
              method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_pharmacy_location_id",
              data: [],
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null,
            },
          },

          {
            className: "col-3 mandatory  form-group",
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

      // {
      //   subitem: "GP Statment ItemWise Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      //   //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      // },
      // {
      //   subitem: "List of Claims Generated",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      //   //reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      // }

      // {
      //   subitem: "Items Consumption Report",
      //   reportName: "itemsConsumptionPharmacy",
      //   requireIframe: true,
      //   pageSize: "A4",
      //   pageOrentation: "portrait", //"portrait",
      //   reportParameters: [
      //     {
      //       className: "col-3 form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },
      //     {
      //       className: "col-3 form-group",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     }
      //   ]
      // }
    ],
  };
}
