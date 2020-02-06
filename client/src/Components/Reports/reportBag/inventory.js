export default function Inventory({
  hospital_id,
  algaehApiCall,
  EXPIRY_STATUS,
  moment
}) {
  return {
    name: "Inventory",
    submenu: [
      {
        subitem: "Consumption List",
        reportName: "consumptionListInventory",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "stockUsed",

            isImp: true,
            label: "Show for Last (month's)",

            dataSource: {
              textField: "stockUsed",
              valueField: "stockUsedValue",
              data: [
                {
                  stockUsed: "1 months",
                  stockUsedValue: moment()
                    .add(-1, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "2 months",
                  stockUsedValue: moment()
                    .add(-2, "months")
                    .format("YYYY-MM-DD")
                },
                {
                  stockUsed: "3 months",
                  stockUsedValue: moment()
                    .add(-3, "months")
                    .format("YYYY-MM-DD")
                }
              ]
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/inventory/getItemMaster",
              module: "inventory"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_inventory_item_master_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          }
        ]
      },
      {
        subitem: "Items Consumption Report",
        reportName: "itemsConsumptionInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "portrait", //"landscape",
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
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "sub_department_id",
            initialLoad: true,
            isImp: true,
            label: "Department",
            link: {
              //uri: "/department/get/subdepartment"
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              module: "masterSettings"
            },
            manupulation: (response, reportState, stateProperty) => {
              reportState.setState({
                [stateProperty]: response.records.departmets
              });
            },
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: undefined
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                reportState.setState({
                  sub_department_id: currentEvent.value,
                  provider_id_list: currentEvent.selected.doctors
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  provider_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "provider_id",
            initialLoad: true,
            isImp: false,
            label: "Filter by Doctor",
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/pharmacy/getItemMaster",
              module: "pharmacy"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: undefined
            }
          }
        ]
      },

      // {
      //   subitem: "Items Issued Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      // },
      // {
      //   subitem: "Items Received Report",
      //   template_name: "asset_war_exp",
      //   reportParameters: []
      // },
      {
        subitem: "Item Expiry Report",
        reportName: "itemExpiryInventory",
        requireIframe: true,
        pageSize: "A4",
        pageOrentation: "landscape", //"portrait",
        reportParameters: [
          {
            className: "col-2 mandatory form-group",
            type: "dropdown",
            name: "hospital_id",
            initialLoad: true,
            isImp: true,
            label: "branch",
            link: {
              uri: "/organization/getOrganizationByUser"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "expiry_status",
            initialLoad: true,
            isImp: true,
            label: "Expiry Status",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: EXPIRY_STATUS
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
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
            name: "location_id",
            initialLoad: true,
            isImp: false,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "group_id",
            initialLoad: true,
            isImp: false,
            label: "Group",
            dataSource: {
              textField: "group_description",
              valueField: "hims_d_item_group_id",
              data: []
            },
            link: {
              uri: "/inventory/getItemGroup",
              module: "inventory"
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemCategory",
                  module: "inventory",
                  method: "GET",
                  data: { hims_d_item_category_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      category_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  category_id_list: []
                });
              }
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "category_id",
            initialLoad: true,
            isImp: false,
            label: "Category",
            dataSource: {
              textField: "category_desc",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getItemMaster",
                  module: "inventory",
                  method: "GET",
                  data: { category_id: currentEvent.value },

                  onSuccess: result => {
                    reportState.setState({
                      item_id_list: result.data.records
                    });
                  }
                });
              },
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined,
                  item_id_list: []
                });
              }
            }
          },

          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_item_master_id",
              data: []
            }
          }
        ]
      },
      // {
      //   subitem: "Inventory Store Report",
      //   reportName: "inventoryStoreReport",
      //   requireIframe: true,
      //   reportParameters: [
      //     {
      //       className: "col-2 form-group mandatory",
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
      //       className: "col-2 form-group mandatory",
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
      //       className: "col-2 mandatory  form-group",
      //       type: "date",
      //       name: "from_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-2 mandatory  form-group",
      //       type: "date",
      //       name: "to_date",
      //       isImp: true,
      //       others: {
      //         maxDate: new Date(),
      //         minDate: null
      //       }
      //     },

      //     {
      //       className: "col-2 form-group",
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
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "to_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          }
          // {
          //   className: "col-2 form-group mandatory",
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
        ]
      },
      {
        subitem: "Transfer Report",
        reportName: "InventoryTransferReport",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },
          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },

          {
            className: "col-2 mandatory  form-group",
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
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "From Location ",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            }
          }
        ]
      },
      {
        subitem: "Inventory Aging",
        reportName: "InventoryAgingReport",
        requireIframe: true,
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
            events: {
              onChange: (reportState, currentEvent) => {
                //provider_id_list CONTROL NAME AND APPEND BY _LIST
                algaehApiCall({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
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
            value: hospital_id,
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: undefined
            }
          },

          {
            className: "col-2 form-group mandatory",
            type: "dropdown",
            name: "location_id",
            initialLoad: true,
            isImp: true,
            label: "Location",
            dataSource: {
              textField: "location_description",
              valueField: "hims_d_inventory_location_id",
              data: []
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          },

          {
            className: "col-2 mandatory  form-group",
            type: "date",
            name: "from_date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            className: "col-2 form-group",
            type: "dropdown",
            name: "item_id",
            initialLoad: true,
            isImp: false,
            label: "Item",

            link: {
              uri: "/inventory/getItemMaster",
              module: "inventory"
            },
            dataSource: {
              textField: "item_description",
              valueField: "hims_d_inventory_item_master_id",
              data: undefined
            },
            events: {
              onClear: (reportState, currentName) => {
                reportState.setState({
                  [currentName]: undefined
                });
              }
            }
          }
        ]
      }
    ]
  };
}
