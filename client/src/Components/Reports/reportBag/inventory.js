export default function Inventory({
  hospital_id,
  algaehApiCall,
  EXPIRY_STATUS,
  moment,
  spotlightSearch,
  FORMAT_YESNO,
}) {
  return {
    name: "Inventory",
    excel: "true",
    submenu: [
      {
        subitem: "Items Stock Report",
        reportName: "itemsStockInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
        componentCode: "RPT_INV_ITM_STK",
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
              valueField: "hims_d_inventory_location_id",
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
            columns: spotlightSearch.Items.Invitemmaster,
            searchName: "PurchaseOrderForInventry",
            value: null, //"item_description",
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
        ],
      },
      {
        subitem: "Consumption List",
        reportName: "consumptionListInventory",
        requireIframe: true,
        componentCode: "RPT_INV_CONS_LST",
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
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "stockUsed",
            isImp: true,
            label: "Show for Last",

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
          {
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Invitemmaster,
            searchName: "PurchaseOrderForInventry",
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
          //     uri: "/inventory/getItemMaster",
          //     module: "inventory",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_inventory_item_master_id",
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
        subitem: "Items Consumption Report",
        reportName: "itemsConsumptionInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
        componentCode: "RPT_INV_ITM_CONS",
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
              valueField: "hims_d_inventory_location_id",
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
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/pharmacy/getItemMaster",
              module: "pharmacy",
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: undefined,
            },
          },
        ],
      },
      {
        subitem: "Item Expiry Report",
        reportName: "itemExpiryInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        componentCode: "RPT_INV_ITM_EXP",
        reportParameters: [
          {
            className: "col-3 mandatory form-group",
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
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS,
            },
          },
          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            hide: (state) => {
              return state.parameterCollection?.expiry_status === "E";
            },
            // others: {
            //   maxDate: new Date(),
            //   minDate: null,
            // },
          },

          {
            className: "col-3 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            hide: (state) => {
              return state.parameterCollection?.expiry_status === "E";
            },
            // others: {
            //   maxDate: ,
            //   minDate: new Date(),
            // },
          },

          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            link: {
              uri: "/inventory/getInventoryLocation",
              module: "inventory",
              // method: "GET",
              data: { hospital_id: hospital_id },
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: [],
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "group_id",
            initialLoad: true,
            isImp: false,
            label: "Group",

            link: {
              uri: "/inventory/getItemGroup",
              module: "inventory",
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records,
              });
            },
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_inventory_item_group_id",
              data: [],
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemCategory",
                  module: "inventory",
                  method: "GET",
                  data: { hims_d_item_category_id: currentEvent.value },

                  onSuccess: (result) => {
                    reportState.setState({
                      category_id_list: result.data.records,
                    });
                  },
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  category_id_list: [],
                });
              },
            },
          },
          {
            className: "col-3 form-group",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: false,
            label: "Category",
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_inventory_tem_category_id",
              data: [],
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemMaster",
                  module: "inventory",
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
              valueField: "hims_d_inventory_item_master_id",
              data: [],
            },
          },
        ],
      },
      // {
      //   subitem: "Inventory Store Report",
      //   reportName: "inventoryStoreReport",
      //   requireIframe: true,
      //   reportParameters: [
      //     {
      //       className: "col-3 form-group mandatory",
      //       type: "dropdown",
      //       name: "hospital_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "branch",
      //       link: {
      //         uri: "/organization/getOrganizationByUser"
      //       },
      //       events: {
      //         onChange: (reportState, currentEvent) => {
      //           //provider_id_list CONTROL NAME AND APPEND BY _LIST
      //           algaehApiCall({
      //             uri: "/inventory/getInventoryLocation",
      //             module: "inventory",
      //             method: "GET",
      //             data: { hospital_id: currentEvent.value },

      //             onSuccess: result => {
      //               reportState.setState({
      //                 location_id_list: result.data.records
      //               });
      //             }
      //           });
      //         },
      //         onClear: (reportState, currentName) => {
      //           reportState.setState({
      //             [currentName]: undefined,
      //             location_id_list: []
      //           });
      //         }
      //       },
      //       value: hospital_id,
      //       dataSource: {
      //         textField: "hospital_name",
      //         valueField: "hims_d_hospital_id",
      //         data: undefined
      //       }
      //     },

      //     {
      //       className: "col-3 form-group mandatory",
      //       type: "dropdown",
      //       name: "location_id",
      //       initialLoad: true,
      //       isImp: true,
      //       label: "Location",
      //       dataSource: {
      //         textField: "location_description",
      //         valueField: "hims_d_inventory_location_id",
      //         data: []
      //       }
      //     },

      //     {
      //       className: "col-3 mandatory  form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-3 mandatory  form-group",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-3 form-group",
      //       type: "dropdown",
      //       name: "item_id",
      //       initialLoad: true,
      //       isImp: false,
      //       label: "Item",

      //       link: {
      //         uri: "/inventory/getItemMaster",
      //         module: "inventory"
      //       },
      //       dataSource: {
      //         textField: "item_description",
      //         valueField: "hims_d_item_master_id",
      //         data: undefined
      //       }
      //     }
      //   ]
      // },
      {
        subitem: "Purchase Report",
        reportName: "inventoryPurchaseReport",
        componentCode: "RPT_INV_PUR",
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
        subitem: "Purchase Receipt Report",
        reportName: "inventoryReceiptReport",
        componentCode: "RPT_INV_REE",
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
        reportName: "inventoryPurchaseReturnReport",
        requireIframe: true,
        // pageSize: "A3",
        componentCode: "INV_PUR_RTN_RPT",
        // pageOrentation: "landscape",
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
        reportName: "inventoryPurchaseReportItemSupplier",
        requireIframe: true,
        // componentCode: "RPT_INV_PUR",
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
            columns: spotlightSearch.Items.Invitemmaster,
            searchName: "PurchaseOrderForInventry",
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
          //     uri: "/inventory/getItemMaster",
          //     module: "inventory",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_inventory_item_master_id",
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
        reportName: "InventoryTransferReport",
        requireIframe: true,
        componentCode: "RPT_INV_TRAN",
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
            className: "col-3 form-group",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "From Location ",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
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
      {
        subitem: "Inventory Aging",
        reportName: "InventoryAgingReport",
        requireIframe: true,
        componentCode: "RPT_INV_INV_AGI",
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
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
            className: "col-3 form-group",
            type: "Autosearch",
            name: "item_id",
            // initialLoad: true,
            isImp: false,
            // label: "Item",
            columns: spotlightSearch.Items.Invitemmaster,
            searchName: "PurchaseOrderForInventry",
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
          //     uri: "/inventory/getItemMaster",
          //     module: "inventory",
          //   },
          //   dataSource: {
          //     textField: "item_description",
          //     valueField: "hims_d_inventory_item_master_id",
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
        subitem: "Stock Cost Report",
        reportName: "stockReport",
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
            className: "col-3 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
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
        ],
      },
    ],
  };
}
