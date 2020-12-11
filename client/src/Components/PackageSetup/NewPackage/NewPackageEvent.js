import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";

export default function NewPackageEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
      });
    },
    serviceHandeler: ($this, e) => {
      $this.setState({
        s_service: e.hims_d_services_id,
        s_service_type: e.service_type_id,
        s_service_name: e.service_name,
        service_type: e.service_type,
        s_service_amount: e.standard_fee,
        qty: 1,
      });
    },
    pakageamtHandaler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      let profit_loss = "P";
      let pl_amount =
        parseFloat(value) - parseFloat($this.state.total_service_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }

      $this.setState({
        [name]: value,
        profit_loss: profit_loss,
        pl_amount: pl_amount,
      });
    },
    serviceTypeHandeler: ($this, e) => {
      $this.setState(
        {
          [e.name]: e.value,
        },
        () => {
          $this.props.getServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            data: { service_type_id: $this.state.s_service_type },
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "services",
            },
          });
        }
      );
    },
    AddToList: ($this) => {
      if ($this.state.s_service_type === null) {
        swalMessage({
          type: "warning",
          title: "Select Service Type.",
        });
        return;
      } else if ($this.state.s_service === null) {
        swalMessage({
          type: "warning",
          title: "Select Service.",
        });
        return;
      } else if ($this.state.qty === "" || $this.state.qty === 0) {
        swalMessage({
          type: "warning",
          title: "Enter Quantity.",
        });
        return;
      }
      let SelectedService = _.filter($this.state.PakageDetail, (f) => {
        return (
          f.service_type_id === $this.state.s_service_type &&
          f.service_id === $this.state.s_service
        );
      });

      debugger
      if (SelectedService.length === 0) {
        let PakageDetail = $this.state.PakageDetail;
        let insertPackage = $this.state.insertPackage;

        let profit_loss = "P";
        let InputObj = {
          service_type_id: $this.state.s_service_type,
          service_id: $this.state.s_service,
          service_amount: $this.state.s_service_amount,
          qty: $this.state.qty,
          tot_service_amount:
            parseFloat($this.state.qty) *
            parseFloat($this.state.s_service_amount),
          service_name: $this.state.s_service_name,
          service_type: $this.state.service_type,
        };

        if ($this.state.hims_d_package_header_id !== null) {
          let InsertObj = {
            package_header_id: $this.state.hims_d_package_header_id,
            service_type_id: $this.state.s_service_type,
            service_id: $this.state.s_service,
            service_amount: $this.state.s_service_amount,
            qty: $this.state.qty,
            tot_service_amount:
              parseFloat($this.state.qty) *
              parseFloat($this.state.s_service_amount),
          };
          insertPackage.push(InsertObj);
        }

        PakageDetail.push(InputObj);
        let total_service_amount = _.sumBy(PakageDetail, (s) =>
          parseFloat(s.tot_service_amount)
        );
        let pl_amount =
          parseFloat($this.state.package_amount) -
          parseFloat(total_service_amount);
        if (pl_amount < 0) {
          profit_loss = "L";
        }
        $this.setState({
          PakageDetail: PakageDetail,
          // s_service_type: null,
          S_service_name: "",
          s_service: null,
          s_service_amount: null,
          total_service_amount: total_service_amount,
          pl_amount: pl_amount,
          profit_loss: profit_loss,
          insertPackage: insertPackage,
          qty: 0,
        });
      } else {
        swalMessage({
          title: "Selected Service already exists.",
          type: "warning",
        });
      }
    },
    DeleteService: ($this, row) => {
      let PakageDetail = $this.state.PakageDetail;
      let deletePackage = $this.state.deletePackage;
      let insertPackage = $this.state.insertPackage;

      if ($this.state.hims_d_package_header_id !== null) {
        if (row.hims_d_package_detail_id !== undefined) {
          deletePackage.push({
            hims_d_package_detail_id: row.hims_d_package_detail_id,
          });
        } else {
          for (let k = 0; k < insertPackage.length; k++) {
            if (
              insertPackage[k].hims_d_package_detail_id ===
              row.hims_d_package_detail_id
            ) {
              insertPackage.splice(k, 1);
            }
          }
        }
      }

      for (let x = 0; x < PakageDetail.length; x++) {
        if (PakageDetail[x].service_id === row.service_id) {
          PakageDetail.splice(x, 1);
        }
      }

      let profit_loss = "P";

      let total_service_amount = _.sumBy(PakageDetail, (s) =>
        parseFloat(s.tot_service_amount)
      );
      let pl_amount =
        parseFloat($this.state.package_amount) -
        parseFloat(total_service_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }
      $this.setState({
        PakageDetail: PakageDetail,
        deletePackage: deletePackage,
        insertPackage: insertPackage,
        total_service_amount: total_service_amount,
        pl_amount: pl_amount,
        profit_loss: profit_loss,
      });
    },

    AddPackages: ($this, e) => {
      e.preventDefault();

      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='packagedata'",
        onSuccess: () => {
          let InputObj = $this.state;

          const package_code_exit = _.filter(
            $this.props.all_Pakage_data,
            (f) => f.package_code === $this.state.package_code
          );

          if (
            $this.state.hims_d_package_header_id === null &&
            package_code_exit.length > 0
          ) {
            swalMessage({
              type: "warning",
              title: "Package Code Already Exist.",
            });
            return;
          }
          if (parseFloat(InputObj.package_amount) === 0) {
            swalMessage({
              type: "warning",
              title: "Enter The package amount",
            });
            document.querySelector("[name='package_amount']").focus();
            return;
          } else if (InputObj.package_visit_type === "M") {
            if (
              parseFloat(InputObj.expiry_days) === 0 ||
              InputObj.expiry_days === null
            ) {
              swalMessage({
                type: "warning",
                title: "Enter Expiry Days",
              });
              document.querySelector("[name='expiry_days']").focus();
              return;
            } else if (
              InputObj.advance_type === "P" &&
              parseFloat(InputObj.advance_percentage) === 0
            ) {
              swalMessage({
                type: "warning",
                title: "Enter The Advance Percentage",
              });
              document.querySelector("[name='advance_percentage']").focus();
              return;
            } else if (
              InputObj.advance_type === "A" &&
              parseFloat(InputObj.advance_amount) === 0
            ) {
              swalMessage({
                type: "warning",
                title: "Enter The Advance Amount",
              });
              document.querySelector("[name='advance_amount']").focus();
              return;
            }
          }
          if (InputObj.PakageDetail.length === 0) {
            swalMessage({
              type: "warning",
              title: "Atleast One service is required in the list",
            });
            return;
          }

          for (let i = 0; i < InputObj.PakageDetail.length; i++) {
            let appropriate_amount =
              parseFloat(InputObj.PakageDetail[i].tot_service_amount) /
              parseFloat($this.state.total_service_amount);
            appropriate_amount =
              appropriate_amount * parseFloat($this.state.package_amount);
            appropriate_amount = appropriate_amount.toFixed(2);
            InputObj.PakageDetail[i].appropriate_amount = appropriate_amount;
          }

          if (InputObj.advance_type === "P") {
            InputObj.advance_amount =
              (parseFloat(InputObj.package_amount) *
                parseFloat(InputObj.advance_percentage)) /
              100;
          }

          if (
            $this.state.from === "doctor" ||
            $this.state.package_type === "D"
          ) {
            InputObj.approved = "Y";
          } else {
            InputObj.approved = "N";
          }

          if (InputObj.hims_d_package_header_id === null) {
            InputObj.service_code = InputObj.package_code;
            InputObj.service_type_id = "14";
            InputObj.service_name = InputObj.package_name;
            InputObj.service_status = "A";
            InputObj.standard_fee = InputObj.package_amount;
            algaehApiCall({
              uri: "/packagesetup/addPackage",
              module: "masterSettings",
              data: InputObj,
              onSuccess: (response) => {
                if (response.data.success === true) {
                  $this.setState({
                    approveEnable: false,
                  });
                  if ($this.state.from === "doctor") {
                    $this.setState($this.baseState, () => {
                      let obj = {
                        package_service_id:
                          response.data.records.package_service_id,
                        package_code: InputObj.package_code,
                      };
                      $this.props.onClose && $this.props.onClose(obj);
                    });
                  } else {
                    $this.setState($this.baseState, () => {
                      swalMessage({
                        type: "success",
                        title: "Saved successfully . .",
                      });
                      $this.setState(
                        {
                          hims_d_package_header_id: null,
                          package_code: null,
                          package_name: null,
                          package_amount: 0,
                          total_service_amount: 0,
                          profit_loss: null,
                          pl_amount: 0,

                          PakageDetail: [],
                          deletePackage: [],
                          insertPackage: [],
                          s_service_amount: null,
                          s_service_type: null,
                          s_service: null,
                          package_type: "S",
                          package_visit_type: "S",
                          advance_percentage: 0,
                          advance_amount: 0,
                          advance_type: "P",
                          qty: 1,
                          approveEnable: true,
                          approvedPack: false,
                          radioActive: true,
                          radioInactive: false,
                          package_status: "A",
                          cancellation_policy: "AC",
                          cancellation_per: 0,
                          cancellation_amount: 0,
                          cancellation_type: "P",
                          vat_applicable: "N",
                          vat_percent: 0,
                        },
                        () => {
                          $this.props.onClose && $this.props.onClose(false);
                        }
                      );
                    });
                  }
                }
              },
            });
          } else {
            for (let i = 0; i < InputObj.insertPackage.length; i++) {
              let appropriate_amount =
                parseFloat(InputObj.insertPackage[i].tot_service_amount) /
                parseFloat($this.state.total_service_amount);
              appropriate_amount =
                appropriate_amount * parseFloat($this.state.package_amount);
              appropriate_amount = appropriate_amount.toFixed(2);
              InputObj.insertPackage[i].appropriate_amount = appropriate_amount;
            }
            const updatePakageDetail = _.filter(InputObj.PakageDetail, (f) => {
              return f.hims_d_package_detail_id > 0;
            });
            InputObj.updatePakageDetail = updatePakageDetail;
            InputObj.standard_fee = InputObj.package_amount;
            InputObj.service_id = InputObj.package_service_id;
            InputObj.service_code = InputObj.package_code;
            InputObj.service_name = InputObj.package_name;

            algaehApiCall({
              uri: "/packagesetup/updatePackageSetup",
              module: "masterSettings",
              data: InputObj,
              method: "PUT",
              onSuccess: (response) => {
                if (response.data.success === true) {
                  $this.setState($this.baseState, () => {
                    swalMessage({
                      type: "success",
                      title: "Updated successfully . .",
                    });
                    $this.setState(
                      {
                        hims_d_package_header_id: null,
                        package_code: null,
                        package_name: null,
                        package_amount: 0,
                        total_service_amount: 0,
                        profit_loss: null,
                        pl_amount: 0,

                        PakageDetail: [],
                        deletePackage: [],
                        insertPackage: [],
                        s_service_amount: null,
                        s_service_type: null,
                        s_service: null,
                        package_type: "S",
                        package_visit_type: "S",
                        advance_percentage: 0,
                        advance_amount: 0,
                        advance_type: "P",
                        qty: 1,
                        approveEnable: true,
                        approvedPack: false,
                        radioActive: true,
                        radioInactive: false,
                        package_status: "A",
                        cancellation_policy: "AC",
                        cancellation_per: 0,
                        cancellation_amount: 0,
                        cancellation_type: "P",
                        vat_applicable: "N",
                        vat_percent: 0,
                      },
                      () => {
                        $this.props.onClose && $this.props.onClose(false);
                      }
                    );
                  });
                }
              },
            });
          }
        },
      });
    },

    discounthandle: ($this, e) => {
      let advance_percentage = 0,
        advance_amount = 0;
      advance_percentage =
        e.target.value === undefined ? "" : parseFloat(e.target.value);
      advance_amount =
        e.target.value === ""
          ? 0
          : (parseFloat($this.state.package_amount) * advance_percentage) / 100;

      $this.setState({
        advance_percentage: advance_percentage,
        advance_amount: advance_amount,
      });
    },

    candiscounthandle: ($this, e) => {
      let cancellation_per = 0,
        cancellation_amount = 0;
      cancellation_per =
        e.target.value === undefined ? "" : parseFloat(e.target.value);
      cancellation_amount =
        e.target.value === ""
          ? 0
          : (parseFloat($this.state.package_amount) * cancellation_per) / 100;

      $this.setState({
        cancellation_per: cancellation_per,
        cancellation_amount: cancellation_amount,
      });
    },

    makeZeroIngrid: ($this, row, e) => {
      if (e.target.value === "") {
        let PakageDetail = $this.state.PakageDetail;
        let _index = PakageDetail.indexOf(row);
        row[e.target.name] = 0;

        PakageDetail[_index] = row;
        $this.setState({
          PakageDetail: PakageDetail,
        });
      }
    },
    gridtexthandel: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let PakageDetail = $this.state.PakageDetail;
      let _index = PakageDetail.indexOf(row);
      let profit_loss = "P";
      if (value === "") {
        row[name] = value;
        row["tot_service_amount"] = 0;
      } else {
        row[name] = value;
        row["tot_service_amount"] =
          parseFloat(row["qty"]) * parseFloat(row["service_amount"]);
      }
      PakageDetail[_index] = row;
      let total_service_amount = _.sumBy(PakageDetail, (s) =>
        parseFloat(s.tot_service_amount)
      );
      let pl_amount =
        parseFloat($this.state.package_amount) -
        parseFloat(total_service_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }

      $this.setState({
        PakageDetail: PakageDetail,
        total_service_amount: total_service_amount,
        pl_amount: pl_amount,
        profit_loss: profit_loss,
      });
    },
    ApprovePackages: ($this, e) => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='packagedata'",
        onSuccess: () => {
          let InputObj = $this.state;
          if (InputObj.PakageDetail.length === 0) {
            swalMessage({
              type: "warning",
              title: "Atleast One service is required in the list",
            });
            return;
          }
          for (let i = 0; i < InputObj.PakageDetail.length; i++) {
            let appropriate_amount =
              parseFloat(InputObj.PakageDetail[i].tot_service_amount) /
              parseFloat($this.state.total_service_amount);
            appropriate_amount =
              appropriate_amount * parseFloat($this.state.package_amount);
            appropriate_amount = appropriate_amount.toFixed(2);
            InputObj.PakageDetail[i].appropriate_amount = appropriate_amount;
          }
          InputObj.approved = "Y";
          const updatePakageDetail = _.filter(InputObj.PakageDetail, (f) => {
            return f.hims_d_package_detail_id > 0;
          });
          InputObj.updatePakageDetail = updatePakageDetail;

          algaehApiCall({
            uri: "/packagesetup/updatePackageSetup",
            module: "masterSettings",
            data: InputObj,
            method: "PUT",
            onSuccess: (response) => {
              if (response.data.success === true) {
                swalMessage({
                  type: "success",
                  title: "Updated successfully . .",
                });
                $this.setState(
                  {
                    hims_d_package_header_id: null,
                    package_code: null,
                    package_name: null,
                    package_amount: 0,
                    total_service_amount: 0,
                    profit_loss: null,
                    pl_amount: 0,

                    PakageDetail: [],
                    deletePackage: [],
                    insertPackage: [],
                    s_service_amount: null,
                    s_service_type: null,
                    s_service: null,
                    package_type: "S",
                    package_visit_type: "S",
                    advance_percentage: 0,
                    advance_amount: 0,
                    advance_type: "P",
                    qty: 1,
                    approveEnable: true,
                    approvedPack: false,
                    radioActive: true,
                    radioInactive: false,
                    package_status: "A",
                    cancellation_policy: "AC",
                    cancellation_per: 0,
                    cancellation_amount: 0,
                    cancellation_type: "P",
                    vat_applicable: "N",
                    vat_percent: 0,
                  },
                  () => {
                    $this.props.onClose && $this.props.onClose(false);
                  }
                );
              }
            },
          });
        },
      });
    },

    radioChange: ($this, e) => {
      let radioActive = true;
      let radioInactive = false;
      let package_status = "A";
      if (e.target.value === "Active") {
        radioActive = true;
        radioInactive = false;
        package_status = "A";
      } else if (e.target.value === "Inactive") {
        radioActive = false;
        radioInactive = true;
        package_status = "I";
      }
      $this.setState({
        [e.target.name]: e.target.value,
        radioInactive: radioInactive,
        radioActive: radioActive,
        package_status: package_status,
      });
    },

    datehandle: ($this, ctrl, e) => {
      $this.setState({
        [e]: moment(ctrl)._d,
      });
    },

    dateValidate: ($this, value, event) => {
      let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
      if (inRange) {
        swalMessage({
          title: "Package Validate Upto cannot be past Date.",
          type: "warning",
        });
        event.target.focus();
        $this.setState({
          [event.target.name]: null,
        });
      }
    },
    CopyCreatePackage: ($this) => {
      let Package_data = $this.state;

      Package_data.qty = 1;
      Package_data.approveEnable = true;
      Package_data.approvedPack = false;
      Package_data.radioActive = true;
      Package_data.radioInactive = false;
      Package_data.hims_d_package_header_id = null;
      Package_data.package_code = null;
      $this.setState($this.baseState, () => {
        $this.setState(Package_data);
      });
    },
    VatAppilicable: ($this, e) => {
      let name = e.target.name;

      $this.state.vat_percent = 0;
      $this.setState({
        [name]: e.target.checked ? "Y" : "N",
      });
    },
    numberEventHandaler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value === "" ? null : e.value || e.target.value;

      if (parseFloat(value) < 0) {
        swalMessage({
          type: "warning",
          title: "Cannot be less than zero.",
        });
        $this.setState({
          [name]: 0,
        });
      }
      if (parseFloat(value) > 100) {
        swalMessage({
          type: "warning",
          title: "Cannot be less than zero.",
        });
        $this.setState({
          [name]: 0,
        });
      } else {
        $this.setState({
          [name]: value,
        });
      }
    },
    getFinanceAccountsMaping: ($this, e) => {
      algaehApiCall({
        uri: "/finance/getFinanceAccountsMaping",
        data: { accounts: ["DEF_INCOME_PACK"] },
        module: "finance",
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success === true) {
            if (response.data.result.length > 0) {
              $this.setState({
                head_id: response.data.result[0].head_id,
                child_id: response.data.result[0].child_id,
              });
            }
          }
        },
      });
    }
  };
}
