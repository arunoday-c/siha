import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import _ from "lodash";

export default function PackageSetupEvent() {
  return {
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

      debugger;

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
      debugger;
      let InputObj = $this.state;

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
      let utilize_amount = 0;
      if (parseFloat(InputObj.advance_amount) === 0) {
        swalMessage({
          title: "Please collect the advance",
          type: "warning"
        });
        return;
      }
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
          }

          InputObj.utilize_amount =
            parseFloat(InputObj.utilize_amount) + utilize_amount;

          InputObj.balance_amount =
            parseFloat(InputObj.advance_amount) -
            parseFloat(InputObj.utilize_amount);
          if (parseFloat(InputObj.balance_amount) <= 0) {
            swalMessage({
              title:
                "Present advance no sufficient to utilize these services.Please collect the advance",
              type: "warning"
            });
            return;
          }

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
      });
    }
  };
}
