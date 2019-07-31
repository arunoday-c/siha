import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";

export default function PackageSetupEvent() {
  return {
    onPackageChange: ($this, e) => {
      debugger;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        ...$this.state,
        ...e.selected
      });
    },
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let refundAmount = 0;
      let cancel_amount = 0;
      if (name === "closed_type" && value === "R") {
        if ($this.state.cancellation_policy === "AC") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.actual_utilize_amount);
          cancel_amount = $this.state.can_amt;
          refundAmount = refundAmount - parseFloat(cancel_amount);
        } else if ($this.state.cancellation_policy === "AP") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.utilize_amount);
          cancel_amount = $this.state.can_amt;
          refundAmount = refundAmount - parseFloat(cancel_amount);
        }
      }

      if (name === "cancel_amount") {
        if ($this.state.cancellation_policy === "AC") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.actual_utilize_amount);
          refundAmount = refundAmount - value === "" ? 0 : parseFloat(value);
        } else if ($this.state.cancellation_policy === "AP") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.utilize_amount);
          refundAmount = refundAmount - value === "" ? 0 : parseFloat(value);
        }
      }
      $this.setState({
        [name]: value,
        cash_amount: refundAmount,
        total_amount: refundAmount,
        cancel_amount: cancel_amount
      });
    },
    onquantitycol: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let oldvalue = row["quantity"];

      if (parseFloat(value) > parseFloat(row["available_qty"])) {
        swalMessage({
          title: "Quantity cannot be greater than Avaiable Quantity. ",
          type: "warning"
        });
        return;
      }

      let package_details = $this.state.package_details;
      const _index = package_details.indexOf(row);
      let consumtion_items = $this.state.consumtion_items;

      if (value !== "") {
        if (consumtion_items.length > 0) {
          for (let i = 0; i < consumtion_items.length; i++) {
            if (consumtion_items[i].service_id === row.service_id) {
              consumtion_items[i].quantity = value;
              consumtion_items[i].unit_cost =
                parseFloat(value) * parseFloat(consumtion_items[i].sale_price);
              consumtion_items[i].extended_cost =
                parseFloat(value) * parseFloat(consumtion_items[i].sale_price);
            }
          }
        }
      }

      row[name] = value;
      package_details[_index] = row;
      $this.setState({
        package_details: package_details
      });
    },

    UtilizeService: ($this, e) => {
      let InputObj = $this.state;

      if (InputObj.hims_f_package_header_id === null) {
        swalMessage({
          title: "Please Selecte Package",
          type: "warning"
        });
        return;
      }

      if (InputObj.package_visit_type === "S" && InputObj.billed === "N") {
        swalMessage({
          title: " Bill Not Yet done for the package.",
          type: "warning"
        });
      }
      const package_details = _.filter(
        InputObj.package_details,
        f => parseFloat(f.quantity) > 0
      );

      const inventory_item = _.filter(
        InputObj.package_details,
        f => f.service_type_id === 4 && f.quantity > 0
      );

      if (inventory_item.length > 0) {
        if (InputObj.consumtion_items.length > 0) {
          for (let k = 0; k < inventory_item.length; k++) {
            const selected_item = _.filter(
              InputObj.consumtion_items,
              f => f.service_id === inventory_item[k].service_id
            );
            if (selected_item.length === 0) {
              swalMessage({
                title: "Please Select The batch for all Inventory Items",
                type: "warning"
              });
              return;
            }
          }
        } else {
          swalMessage({
            title: "Please Select The batch for all Inventory Items",
            type: "warning"
          });
          return;
        }
      }

      if (package_details.length === 0 && InputObj.package_utilize === false) {
        swalMessage({
          title: "Please Select atleast one service to Utilize",
          type: "warning"
        });
        return;
      }

      InputObj.package_details = package_details;
      let utilize_amount = 0,
        actual_utilize_amount = 0;

      swal({
        title: "Confirmation.",
        text: "Are you sure you want to Utilize, Once Utilized cannot Revert?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          for (let i = 0; i < InputObj.package_details.length; i++) {
            InputObj.package_details[i].utilized_qty =
              parseFloat(InputObj.package_details[i].utilized_qty) +
              parseFloat(InputObj.package_details[i].quantity);
            InputObj.package_details[i].available_qty =
              parseFloat(InputObj.package_details[i].available_qty) -
              parseFloat(InputObj.package_details[i].quantity);

            InputObj.package_details[i].created_date = new Date();
            utilize_amount =
              utilize_amount +
              (parseFloat(InputObj.package_details[i].appropriate_amount) /
                parseFloat(InputObj.package_details[i].qty)) *
                parseFloat(InputObj.package_details[i].quantity);

            actual_utilize_amount =
              actual_utilize_amount +
              (parseFloat(InputObj.package_details[i].tot_service_amount) /
                parseFloat(InputObj.package_details[i].qty)) *
                parseFloat(InputObj.package_details[i].quantity);

            InputObj.package_details[i].patient_id = $this.props.patient_id;
            InputObj.package_details[i].visit_id = $this.props.visit_id;
            InputObj.package_details[i].doctor_id = $this.props.doctor_id;
            InputObj.package_details[i].trans_package_detail_id =
              InputObj.package_details[i].hims_f_package_detail_id;
          }

          if ($this.state.package_visit_type === "M") {
            InputObj.utilize_amount = (
              parseFloat(InputObj.utilize_amount) + utilize_amount
            ).toFixed(2);

            InputObj.actual_utilize_amount = (
              parseFloat(InputObj.actual_utilize_amount) + actual_utilize_amount
            ).toFixed(2);

            InputObj.balance_amount =
              parseFloat(InputObj.advance_amount) -
              parseFloat(InputObj.utilize_amount);
            if (parseFloat(InputObj.balance_amount) <= 0) {
              swalMessage({
                title:
                  "Advance not sufficient to utilize these services.Please collect the advance",
                type: "warning"
              });
              if ($this.props.from_billing === true) {
                return;
              }
            }
          }

          if ($this.state.consultation === true) {
            debugger;
            const cons_service = _.find(
              InputObj.package_details,
              f => f.service_type_id === 1
            );
            let inputObj = {};
            if (cons_service === null || cons_service === undefined) {
              inputObj.employee_id = InputObj.doctor_id;
            } else {
              inputObj.services_id = cons_service.service_id;
            }
            algaehApiCall({
              uri: "/billing/getEmployeeAndDepartments",
              module: "billing",
              method: "get",
              data: inputObj,
              onSuccess: response => {
                if (response.data.success) {
                  InputObj.doctor_id = response.data.records[0].employee_id;
                  InputObj.sub_department_id =
                    response.data.records[0].sub_department_id;
                  InputObj.services_id = response.data.records[0].services_id;

                  $this.setState($this.baseState, () => {
                    $this.props.onClose && $this.props.onClose(InputObj);
                  });
                }
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          } else {
            algaehApiCall({
              uri: "/billing/updatePatientPackage",
              module: "billing",
              method: "PUT",
              data: $this.state,
              onSuccess: response => {
                if (response.data.success) {
                  if (InputObj.consumtion_items.length > 0) {
                    InputObj.transaction_type = "CS";
                    InputObj.location_id = $this.props.inventory_location_id;
                    InputObj.inventory_stock_detail =
                      $this.state.consumtion_items;
                    InputObj.transaction_date = new Date();
                    InputObj.provider_id = Window.global["provider_id"];
                    algaehApiCall({
                      uri: "/inventoryconsumption/addInventoryConsumption",
                      module: "inventory",
                      data: InputObj,
                      onSuccess: response => {
                        if (response.data.success === true) {
                          $this.setState($this.baseState, () => {
                            $this.props.onClose && $this.props.onClose(e);
                          });
                          swalMessage({
                            title: "Successful...",
                            type: "success"
                          });
                        }
                      },
                      onFailure: err => {
                        swalMessage({
                          title: err.message,
                          type: "error"
                        });
                      }
                    });
                  } else {
                    $this.setState($this.baseState, () => {
                      $this.props.onClose && $this.props.onClose(e);
                    });
                    swalMessage({
                      title: "Successful...",
                      type: "success"
                    });
                  }
                }
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },

    ShowVistUtilizedSer: $this => {
      if ($this.state.hims_f_package_header_id === null) {
        swalMessage({
          title: "Please Selecte Package",
          type: "warning"
        });
        return;
      }
      $this.setState({
        visitPackageser: !$this.state.visitPackageser
      });
    },
    CloseVistUtilizedSer: ($this, e) => {
      if (e === true) {
        $this.setState($this.baseState, () => {
          $this.props.onClose && $this.props.onClose(e);
        });
      } else {
        $this.setState({ visitPackageser: !$this.state.visitPackageser });
      }
    },
    ShowAdvanceScreen: $this => {
      if ($this.state.hims_f_package_header_id === null) {
        swalMessage({
          title: "Please Selecte Package",
          type: "warning"
        });
        return;
      }
      $this.setState({
        AdvanceOpen: !$this.state.AdvanceOpen
      });
    },
    ShowCloseScreen: $this => {
      if ($this.state.hims_f_package_header_id === null) {
        swalMessage({
          title: "Please Selecte Package",
          type: "warning"
        });
        return;
      }
      $this.setState({
        closePackage: !$this.state.closePackage
      });
    },
    ClosePackageScreen: ($this, e) => {
      if (e === true) {
        $this.setState(
          { closePackage: !$this.state.closePackage, package_details: [] },
          () => {
            $this.props.onClose && $this.props.onClose(e);
          }
        );
      } else {
        $this.setState({
          closePackage: !$this.state.closePackage
        });
      }
    },

    ShowBatchDetails: ($this, row) => {
      algaehApiCall({
        uri: "/inventory/getItemMaster",
        data: { service_id: row.service_id },
        module: "inventory",
        method: "GET",
        onSuccess: response => {
          if (response.data.success === true) {
            let inputObj = {
              item_id: response.data.records[0].hims_d_inventory_item_master_id,
              inventory_location_id: $this.props.inventory_location_id
            };
            let item_category_id = response.data.records[0].category_id;
            let item_group_id = response.data.records[0].group_id;
            let package_details = $this.state.package_details;
            let _index = package_details.indexOf(row);
            row.inventory_item_id =
              response.data.records[0].hims_d_inventory_item_master_id;
            row.inventory_location_id = $this.props.inventory_location_id;
            row.inventory_uom_id = response.data.records[0].sales_uom_id;
            package_details[_index] = row;
            if ($this.state.batch_wise_item.length === 0) {
              algaehApiCall({
                uri: "/inventoryGlobal/getItemandLocationStock",
                module: "inventory",
                method: "GET",
                data: inputObj,
                onSuccess: response => {
                  if (response.data.success === true) {
                    let batch_data = response.data.records;
                    for (let i = 0; i < batch_data.length; i++) {
                      batch_data[i].select_qty = 0;
                    }
                    $this.setState({
                      itemBatches: !$this.state.itemBatches,
                      batch_wise_item: response.data.records,
                      service_id: row.service_id,
                      item_category_id: item_category_id,
                      item_group_id: item_group_id,
                      package_details: package_details,
                      available_qty: row.available_qty,
                      selectd_row_id: _index
                    });
                  }
                },
                onFailure: error => {
                  swalMessage({
                    title: error.message,
                    type: "error"
                  });
                }
              });
            } else {
              $this.setState({
                itemBatches: !$this.state.itemBatches,
                service_id: row.service_id,
                item_category_id: item_category_id,
                item_group_id: item_group_id,
                package_details: package_details,
                available_qty: row.available_qty,
                selectd_row_id: _index
              });
            }
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },

    getCashiersAndShiftMAP: $this => {
      let year = moment().format("YYYY");
      let month = moment().format("MM");

      algaehApiCall({
        uri: "/shiftAndCounter/getCashiersAndShiftMAP",
        module: "masterSettings",
        method: "GET",
        data: { year: year, month: month, for: "T" },
        onSuccess: response => {
          if (response.data.success) {
            if (response.data.records.length > 0) {
              $this.setState({ shift_id: response.data.records[0].shift_id });
            }
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  };
}
