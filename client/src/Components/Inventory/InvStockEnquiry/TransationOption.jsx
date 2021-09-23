import React, { useState } from "react";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehModal,
} from "algaeh-react-components";
import "./InvStockEnquiry.scss";
// import AlgaehModalPopUp from "../../Wrapper/modulePopUp";
import { useForm, Controller, useWatch } from "react-hook-form";
import moment from "moment";
// import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import swal from "sweetalert2";
export default function TransationOption({
  item_details,
  visible,
  // trans_type,
  setVisible,
  req_warehouse,
  location_id,
  location_type,
  trans_ack_required,
  requisition_auth_level,
  git_locations,
  inventorylocations,
}) {
  const { control, errors, handleSubmit, reset } = useForm({
    shouldFocusError: true,
  });
  const [to_location_type, setToLocationType] = useState("WH");
  const { trans_type } = useWatch({
    control,
    name: ["trans_type", "location_description"],
  });
  const onClickProcess = (data) => {
    let inputOb = { item_details: item_details };

    if (data.trans_type === "C") {
      if (parseFloat(data.quantity) > parseFloat(item_details.qtyhand)) {
        swalMessage({
          title: "Quantity Cannot be greated than QTY in Hand",
          type: "warning",
        });
        return;
      }
      swal({
        title: "Are you sure you want to Consume ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willProceed) => {
        if (willProceed.value) {
          inputOb.item_details.quantity = data.quantity;
          inputOb.item_details.location_id = item_details.inventory_location_id;
          inputOb.item_details.location_type = item_details.location_type;
          inputOb.item_details.expiry_date = inputOb.item_details.expirydt;
          inputOb.item_details.uom_id = inputOb.item_details.stocking_uom_id;
          inputOb.item_details.unit_cost = inputOb.item_details.waited_avg_cost;
          inputOb.item_details.extended_cost =
            inputOb.item_details.waited_avg_cost;
          inputOb.item_details.sales_price = inputOb.item_details.sale_price;
          inputOb.item_details.operation = "-";

          inputOb.transaction_type = "CS";
          inputOb.location_id = item_details.location_id;
          inputOb.location_type = location_type;
          inputOb.inventory_stock_detail = [inputOb.item_details];
          inputOb.transaction_date = new Date();
          inputOb.ScreenCode = "INV0007";
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/inventoryconsumption/addInventoryConsumption",
            module: "inventory",
            data: inputOb,
            onSuccess: (response) => {
              AlgaehLoader({ show: false });
              if (response.data.success === true) {
                swalMessage({
                  title: "Consumed successfully . .",
                  type: "success",
                });
                reset();
                setVisible();
                // $this.setState({
                //   open_exchange: false,
                //   trans_type: null,
                //   quantity: 0,
                //   to_location_id: null,
                // });
              }
            },
            onFailure: (err) => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        }
      });
    } else if (data.trans_type === "T") {
      if (parseFloat(data.quantity) > parseFloat(item_details.qtyhand)) {
        swalMessage({
          title: "Quantity Cannot be greated than QTY in Hand",
          type: "warning",
        });
        return;
      }
      swal({
        title: "Are you sure you want to Tranfer ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willTransfer) => {
        if (willTransfer.value) {
          let gitLoaction_Exists = {};
          const settings = { header: undefined, footer: undefined };

          if (trans_ack_required === "Y") {
            if (git_locations.length === 0) {
              swalMessage({
                title: "Please Enter GIT Loaction to transfer item",
                type: "warning",
              });
              return;
            } else {
              gitLoaction_Exists = git_locations[0];
            }
            inputOb.ack_done = "N";
          } else {
            gitLoaction_Exists = {
              hims_d_inventory_location_id: data.to_location_id,
              location_type: to_location_type,
            };
            inputOb.ack_done = "Y";
          }

          inputOb.to_location_id = data.to_location_id;
          inputOb.to_location_type = to_location_type;
          inputOb.item_details.quantity = data.quantity;
          inputOb.item_details.quantity_transfer = data.quantity;
          inputOb.item_details.location_id = item_details.inventory_location_id;
          inputOb.item_details.location_type = item_details.location_type;
          inputOb.item_details.expiry_date = inputOb.item_details.expirydt;
          inputOb.item_details.uom_id = inputOb.item_details.stocking_uom_id;
          inputOb.item_details.uom_transferred_id =
            inputOb.item_details.stocking_uom_id;
          inputOb.item_details.unit_cost = inputOb.item_details.waited_avg_cost;
          inputOb.item_details.extended_cost =
            inputOb.item_details.waited_avg_cost;
          inputOb.item_details.sales_price = inputOb.item_details.sale_price;
          inputOb.item_details.operation = "-";

          inputOb.operation = "+";
          inputOb.transaction_type = "ST";
          inputOb.from_location_id = item_details.inventory_location_id;
          inputOb.from_location_type = location_type;
          inputOb.from_location_id = item_details.inventory_location_id;

          inputOb.direct_transfer = "Y";
          inputOb.stock_detail = [
            {
              item_id: inputOb.item_details.item_id,
              item_category_id: inputOb.item_details.item_category_id,
              item_group_id: inputOb.item_details.item_group_id,
              quantity_transferred: inputOb.item_details.quantity_transferred,
              uom_transferred_id: inputOb.item_details.stocking_uom_id,
              inventory_stock_detail: [inputOb.item_details],
            },
          ];
          inputOb.inventory_stock_detail = [inputOb.item_details];

          inputOb.git_location_type = gitLoaction_Exists.location_type;
          inputOb.git_location_id =
            gitLoaction_Exists.hims_d_inventory_location_id;

          inputOb.transaction_date = moment(new Date(), "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          );
          inputOb.ScreenCode = "INV0006";
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/inventorytransferEntry/addtransferEntry",
            module: "inventory",
            skipParse: true,
            data: Buffer.from(JSON.stringify(inputOb), "utf8"),
            method: "POST",
            header: {
              "content-type": "application/octet-stream",
              ...settings,
            },
            onSuccess: (response) => {
              AlgaehLoader({ show: false });
              if (response.data.success === true) {
                swalMessage({
                  title: "Transferred Successfully . .",
                  type: "success",
                });
                setVisible();
                reset();
                // $this.setState({
                //   open_exchange: false,
                //   trans_type: null,
                //   quantity: 0,
                //   to_location_id: null,
                // });
              }
            },
            onFailure: (err) => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        }
      });
    } else if (data.trans_type === "MR") {
      if (data.to_location_id === null) {
        swalMessage({
          title: "Select Location.",
          type: "warning",
        });
        return;
      }
      swal({
        title: "Are you sure?",
        text: "You want to Raise Purchase Request ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willTransfer) => {
        if (willTransfer.value) {
          inputOb.authorize1 = requisition_auth_level === "N" ? "Y" : "N";
          inputOb.authorie2 = requisition_auth_level === "N" ? "Y" : "N";

          inputOb.item_details.quantity_required = data.quantity;
          inputOb.item_details.quantity_outstanding =
            requisition_auth_level === "N" ? data.quantity : 0;
          inputOb.item_details.quantity_authorized =
            requisition_auth_level === "N" ? data.quantity : 0;

          inputOb.item_details.from_qtyhand = inputOb.item_details.qtyhand;
          inputOb.item_details.item_uom = inputOb.item_details.stocking_uom_id;

          inputOb.from_location_id = item_details.inventory_location_id;
          inputOb.from_location_type = item_details.location_type;
          // inputOb.from_location_id = $this.state.to_location_id;
          // inputOb.from_location_type = $this.props.to_location_type;
          inputOb.to_location_id = data.to_location_id;
          inputOb.to_location_type = to_location_type;
          inputOb.is_completed = "N";
          inputOb.cancelled = "N";
          inputOb.requistion_type = "MR";
          inputOb.status = "PEN";
          inputOb.no_of_transfers = 0;
          inputOb.no_of_po = 0;

          inputOb.inventory_stock_detail = [inputOb.item_details];

          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/inventoryrequisitionEntry/addinventoryrequisitionEntry",
            module: "inventory",
            data: inputOb,
            onSuccess: (response) => {
              AlgaehLoader({ show: false });
              if (response.data.success === true) {
                swalMessage({
                  title: "Requested Successfully . .",
                  type: "success",
                });
                setVisible();
                reset();
                // $this.setState({
                //   open_exchange: false,
                //   trans_type: null,
                //   quantity: 0,
                //   to_location_id: null,
                // });
              }
            },
            onFailure: (err) => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        }
      });
    }
  };
  const ware_house =
    inventorylocations === undefined
      ? []
      : inventorylocations.filter((f) => f.location_type === "WH");
  return (
    <AlgaehModal
      title="Transation Option"
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={() => {
        setVisible();
        reset();
      }}
      footer={null}
      // title="Transation Option"
      // openPopup={visible}
      // class={"MultiTransationModal"}
      // onClose={}
      className={`row algaehNewModal transationOptionModal`}
    >
      <form onSubmit={handleSubmit(onClickProcess)}>
        <div className="col-12 popupInner margin-top-15">
          <div className="row">
            <div className="col-12">
              <AlgaehLabel
                label={{
                  forceLabel: "Selected Item",
                }}
              />
              <h6>
                {item_details ? item_details.item_description : "--------"}
              </h6>
            </div>
            <div className="col-4">
              <AlgaehLabel
                label={{
                  forceLabel: "Selected Location",
                }}
              />
              <h6>
                {item_details.location_description
                  ? item_details.location_description
                  : "--------"}
              </h6>
            </div>
            <div className="col-4">
              <AlgaehLabel
                label={{
                  forceLabel: "Location Type",
                }}
              />
              <h6>
                {item_details.location_type
                  ? item_details.location_type
                  : "--------"}
              </h6>
            </div>
            <div className="col-4">
              <AlgaehLabel
                label={{
                  forceLabel: "QTY In Hand",
                }}
              />
              <h6>
                {item_details ? parseFloat(item_details.qtyhand) : "--------"}
              </h6>
            </div>
            <Controller
              name="trans_type"
              control={control}
              rules={{ required: "Select Transaction Type" }}
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-4 form-group mandatory" }}
                  label={{ forceLabel: "Transaction Type", isImp: true }}
                  error={errors}
                  selector={{
                    className: "form-control",
                    name: "trans_type",
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onClear: () => {
                      onChange(undefined);
                    },

                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: [
                        {
                          name: "Consume",
                          value: "C",
                        },
                        {
                          name: "Transfer",
                          value: "T",
                        },
                        {
                          name: "Material Request",
                          value: "MR",
                        },
                      ],
                    },
                    // others: {
                    //   disabled:
                    //     current.request_status === "APR" &&
                    //     current.work_status === "COM",
                    //   tabIndex: "4",
                    // },
                  }}
                />
              )}
            />
            {trans_type === "MR" ? (
              <Controller
                name="to_location_id"
                control={control}
                rules={{ required: "Please select date" }}
                render={({ value, onChange, onBlur }) => (
                  // <div className="col-2 algaeh-date-fld">
                  <AlgaehAutoComplete
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ forceLabel: "Request From", isImp: true }}
                    error={errors}
                    selector={{
                      value,
                      onChange: (_, selected) => {
                        debugger;
                        onChange(selected);
                        setToLocationType(_.location_type);
                      },
                      onClear: () => {
                        onChange(undefined);
                      },
                      onBlur: (_, selected) => {
                        onBlur(selected);
                      },
                      name: "to_location_id",
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_inventory_location_id",
                        data:
                          req_warehouse === "N"
                            ? inventorylocations
                            : ware_house,
                      },
                      // others: {
                      //   // disabled: disabled || current.request_status === "APR",
                      //   tabIndex: "23",
                      // },
                      autoComplete: "off",
                    }}
                  />
                )}
              />
            ) : null}
            {trans_type === "T" ? (
              <Controller
                name="to_location_id"
                control={control}
                rules={{ required: "Please select a department" }}
                render={({ value, onBlur, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ forceLabel: "Transfer To", isImp: true }}
                    error={errors}
                    selector={{
                      value,
                      onChange: (_, selected) => {
                        onChange(selected);
                        setToLocationType(_.location_type);
                      },
                      onClear: () => {
                        onChange(undefined);
                      },
                      onBlur: (_, selected) => {
                        onBlur(selected);
                      },
                      name: "to_location_id",
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_inventory_location_id",
                        data:
                          trans_type === "T" ? inventorylocations : ware_house,
                      },
                      autoComplete: "off",
                    }}
                  />
                )}
              />
            ) : null}
            <Controller
              name="quantity"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-4 form-group mandatory" }}
                  error={errors}
                  label={{
                    forceLabel: "Quantity",
                    isImp: true,
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    className: "txt-fld",
                    name: "quantity",
                    ...props,
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className=" popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  // onClick={onClickProcess.bind(this, this)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={(e) => {
                    setVisible();
                    reset();
                    // this.setState({
                    //   open_exchange: false,
                    //   trans_type: null,
                    //   quantity: 0,
                    //   to_location_id: null,
                    // });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AlgaehModal>
  );
}
