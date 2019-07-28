import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";

export default function PackageSetupEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let refundAmount = 0;
      if (name === "closed_type" && value === "R") {
        if ($this.state.cancellation_policy === "AC") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.actual_utilize_amount);
        } else if ($this.state.cancellation_policy === "AP") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.utilize_amount);
        }
      }

      if (name === "cancel_amount") {
        if ($this.state.cancellation_policy === "AC") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.actual_utilize_amount);
          refundAmount = refundAmount - parseFloat(value);
        } else if ($this.state.cancellation_policy === "AP") {
          refundAmount =
            parseFloat($this.state.advance_amount) -
            parseFloat($this.state.utilize_amount);
          refundAmount = refundAmount - parseFloat(value);
        }
      }
      $this.setState({
        [name]: value,
        cash_amount: refundAmount,
        total_amount: refundAmount
      });
    },
    onquantitycol: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let oldvalue = row["quantity"];

      if (parseFloat(value) > parseFloat(row["available_qty"])) {
        swalMessage({
          title: "Quantity cannot be gretare than Avaiable Quantity. ",
          type: "warning"
        });
        return;
      }

      let package_details = $this.state.package_details;
      const _index = package_details.indexOf(row);

      

      row[name] = value;
      package_details[_index] = row;
      $this.setState({
        package_details: package_details
      });
    },
    advanceAmount: ($this, e) => {
      if (e.target.value === undefined) {
        $this.setState({
          [e.target.name]: ""
        });
      } else {
        $this.setState({
          [e.target.name]: e.target.value
        });
      }
    },
    UtilizeService: ($this, e) => {
      
      let InputObj = $this.state;

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
      if (package_details.length === 0) {
        swalMessage({
          title: "Please Select atleast one service",
          type: "warning"
        });
        return;
      }
      InputObj.package_details = package_details;
      let utilize_amount = 0,
        actual_utilize_amount = 0;
      // if (parseFloat(InputObj.advance_amount) === 0) {
      //   swalMessage({
      //     title: "Please collect the advance",
      //     type: "warning"
      //   });
      // }
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
            const cons_service = _.find(
              $this.state.package_details,
              f => f.service_type_id === 1
            );

            algaehApiCall({
              uri: "/billing/getEmployeeAndDepartments",
              module: "billing",
              method: "get",
              data: { services_id: cons_service.service_id },
              onSuccess: response => {
                if (response.data.success) {
                  InputObj.doctor_id = response.data.records[0].employee_id;
                  InputObj.sub_department_id =
                    response.data.records[0].sub_department_id;
                  InputObj.services_id = cons_service.service_id;
                  InputObj.hims_f_package_detail_id =
                    InputObj.package_details[0].hims_f_package_detail_id;
                  InputObj.quantity = InputObj.package_details[0].quantity;
                  $this.props.onClose && $this.props.onClose(InputObj);
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
                  
                  $this.props.onClose && $this.props.onClose(e);
                  swalMessage({
                    title: "Successful...",
                    type: "success"
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
          }
        }
      });
    },

    ShowAdvanceScreen: $this => {
      $this.setState({
        AdvanceOpen: !$this.state.AdvanceOpen
      });
    },
    ShowCloseScreen: $this => {
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
            algaehApiCall({
              uri: "/inventoryGlobal/getItemandLocationStock",
              module: "inventory",
              method: "GET",
              data: inputObj,
              onSuccess: response => {
                if (response.data.success === true) {
                  $this.setState({
                    itemBatches: !$this.state.itemBatches,
                    batch_wise_item: response.data.records
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
