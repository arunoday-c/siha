import React, { useState, useEffect } from "react";
import {
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop,
} from "algaeh-react-components";
// import { getAmountFormart } from "../../utils/GlobalFunctions";
import { getCostCentersForVoucher } from "./event";
import { algaehApiCall } from "../../utils/algaehApiCall";

export default function EditVoucher({ visible, voucherNo, inVisible, data }) {
  debugger;
  const baseJournalList = [
    {
      child_id: undefined,
      head_id: undefined,
      slno: 1,
      payment_type: "CR",
      payment_mode: "CA",
    },
    {
      child_id: undefined,
      head_id: undefined,
      slno: 2,
      payment_type: "DR",
      payment_mode: "CA",
    },
  ];

  const [costCenterField, setCostCenterField] = useState(undefined);
  const [cost_center_id, setCostCenter] = useState(undefined);
  const [hospital_id, setHospitalID] = useState(null);
  const [branchData, setbranchData] = useState([]);
  const [finOptions, setFinOptions] = useState(false);
  const [accounts, setAccounts] = useState([{}]);
  const [disableAmount, setDisableAmount] = useState(false);
  const [journerList, setJournerList] = useState(baseJournalList);

  // let narration = data[0];
  useEffect(() => {
    getCostCentersForVoucher().then((result) => {
      setbranchData(result);
      algaehApiCall({
        uri: "/finance_masters/getFinanceOption",
        module: "finance",
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success === true) {
            const [options] = response.data.result;

            setFinOptions(options);
            setHospitalID(options.default_branch_id.toString());
            if (options.cost_center_required === "Y") {
              const [center] = result.filter(
                (el) => el.hims_d_hospital_id === options.default_branch_id
              );
              // console.log("result", JSON.stringify(result));
              // setcostCenterdata(center.cost_centers);
              setCostCenterField({
                fieldName: "cost_center_id",
                label: "Cost Center",
                displayTemplate: (row) => {
                  const valueRow =
                    options["default_branch_id"] !== undefined &&
                    options["default_branch_id"] !== "" &&
                    options["default_cost_center_id"] !== undefined &&
                    options["default_cost_center_id"] !== ""
                      ? `${options["default_branch_id"]}-${options["default_cost_center_id"]}`
                      : "";
                  return (
                    <AlgaehTreeSearch
                      tree={{
                        treeDefaultExpandAll: true,
                        updateInternally: true,
                        data: result,
                        disableHeader: true,
                        textField: "hospital_name",
                        valueField: "hims_d_hospital_id",
                        children: {
                          node: "cost_centers",
                          textField: "cost_center",
                          valueField: (node) => {
                            const { hims_d_hospital_id, cost_center_id } = node;
                            if (cost_center_id === undefined) {
                              return hims_d_hospital_id;
                            } else {
                              return `${hims_d_hospital_id}-${cost_center_id}`;
                            }
                          },
                        },
                        value: valueRow,
                        onChange: (value) => {
                          if (value !== undefined) {
                            const detl = value.split("-");
                            row["hims_d_hospital_id"] = detl[0];
                            row["cost_center_id"] = detl[1];
                          } else {
                            row["hims_d_hospital_id"] = undefined;
                            row["cost_center_id"] = undefined;
                          }
                        },
                      }}
                    />
                  );
                },
                others: {
                  width: 300,
                },
              });
              const costCenterId = center.cost_centers.find(
                (f) => f.cost_center_id === options.default_cost_center_id
              );
              let defaultCenter = options.default_cost_center_id;
              if (
                costCenterId === undefined &&
                center.cost_centers.length > 0
              ) {
                defaultCenter = center.cost_centers[0]["cost_center_id"];
              }
              setCostCenter(defaultCenter);
            }
          }
        },
        onCatch: (error) => {
          AlgaehMessagePop({
            type: "error",
            display: error.message || error.response.data.message,
          });
        },
      });
    });
  }, []);

  const gridTree = (row, record) => {
    let isDisabled = record
      ? record.disabled
        ? { disabled: record.disabled }
        : {}
      : {};

    return (
      <AlgaehTreeSearch
        // div={{}}
        // label={{}}
        tree={{
          ...isDisabled,
          treeDefaultExpandAll: true,
          updateInternally: true,
          onChange: (value, label) => {
            if (value !== undefined) {
              record["sourceName"] = value;
              const source = value.split("-");
              record["child_id"] = source[1];
              record["head_id"] = source[0];
              row = label;
            } else {
              record["sourceName"] = "";
              record["child_id"] = "";
              record["head_id"] = "";
              row = "";
            }
          },
          data: accounts,
          textField: "label",
          valueField: (node) => {
            if (node["leafnode"] === "Y") {
              return `${node["head_id"]}-${node["finance_account_child_id"]}`;
            } else {
              return node["finance_account_head_id"];
            }
          },
          value: row,
          // defaultValue: row,
        }}
      />
    );
  };

  const PaymentInput = (record) => {
    let isDisabled = record
      ? record.paytypedisable
        ? { disabled: record.paytypedisable }
        : record.disabled
        ? { disabled: record.disabled }
        : {}
      : {};

    return (
      <AlgaehAutoComplete
        selector={{
          value: record["payment_type"],
          dataSource: {
            //TODO: need to change as per the backend requirement discussion happned on 09-12-2019
            data: [
              { value: "DR", label: "Debit" },
              { value: "CR", label: "Credit" },
            ],
            valueField: "value",
            textField: "label",
          },
          updateInternally: true,
          onChange: (selected) => {
            record["payment_type"] = selected.value;
          },
          onClear: () => {
            record["payment_type"] = undefined;
          },
          others: { ...isDisabled },
        }}
      />
    );
  };

  const AmountInput = (row, records) => {
    // const isDisabled = records
    //   ? records.disabled
    //     ? { disabled: records.disabled }
    //     : {}
    //   : {};
    return (
      <AlgaehFormGroup
        type="number"
        textBox={{
          disabled: disableAmount,
          updateInternally: true,
          value: row,
          onChange: (e) => {
            records["amount"] = e.target.value === "" ? "" : e.target.value;
            // if (records["payment_type"] === "DR")
            //   records["debit_amount"] = records["amount"];
            // else records["credit_amount"] = records["amount"];
          },
          // ...isDisabled,
        }}
      />
    );
  };
  const NarrationBox = (row, records) => {
    return (
      <AlgaehFormGroup
        multiline={true}
        no_of_lines={2}
        textBox={{
          type: "text",
          className: "form-control",
          placeholder: "Enter Narration ex:- Electricity Bill",
          value: row,
          onChange: (e) => {
            records["narration"] = e.target.value;
          },
        }}
      />
    );
  };

  return (
    <AlgaehModal
      title={`Edit Voucher Details - ${voucherNo}`}
      visible={visible}
      destroyOnClose={true}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        inVisible();
      }}
      className={`row algaehNewModal JVModalDetail`}
    >
      <div className="col-12">
        <AlgaehDataGrid
          className="JLVoucherListGrid"
          columns={[
            {
              fieldName: "slno",
              label: "Sl No.",
              sortable: true,
              others: {
                width: 80,
              },
            },
            costCenterField,
            {
              fieldName: "sourceName",
              label: "Account",
              displayTemplate: gridTree,
            },
            {
              fieldName: "payment_type",
              label: "Payment Type ",
              displayTemplate: PaymentInput,
              others: {
                width: 150,
              },
            },
            {
              fieldName: "amount",
              label: "Amount",
              displayTemplate: AmountInput,
              others: {
                width: 100,
              },
            },
            {
              fieldName: "narration",
              label: "Narration",
              displayTemplate: NarrationBox,
              others: {
                width: 200,
              },
            },
          ]}
          loading={false}
          height="34vh"
          data={journerList}
          rowUnique="slno"
          others={{
            id: "voucher_table",
          }}
        />
      </div>
    </AlgaehModal>
  );
}
