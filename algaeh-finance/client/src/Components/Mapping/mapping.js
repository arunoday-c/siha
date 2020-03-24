import React, { useEffect, useState } from "react";
import {
  // AlgaehTreeDropDown,
  AlgaehValidator,
  AlgaehButton,
  AlgaehMessagePop,
  AlgaehTreeSearch
} from "algaeh-react-components";
import {
  getHeaders,
  updateFinanceAccountsMaping,
  getFinanceAccountsMaping
} from "./mapping.event";
export default function Mapping(props) {
  //#region State variables
  const [assets, setAssets] = useState([]);
  const [lability, setLability] = useState([]);
  const [expense, setExpense] = useState([]);
  //Its as object to send header and child id.
  // const [opControl, setOpControl] = useState(undefined);

  //Its as object to send header and child id.
  const [opPatientDeposit, setOpPatientDeposit] = useState(undefined);
  // const [opDepositLabel, setOPDepositLable] = useState("");
  //Its as object to send header and child id.
  const [opReceviable, setOPReceviable] = useState(undefined);
  // const [opReceviableLable, setOPReceviableLable] = useState("");
  //Its as object to send header and child id.
  const [opCashInHand, setOPCashInHand] = useState(undefined);
  // const [opCashInHandLabel, setopCashInHandLable] = useState("");
  //Its as object to send header and child id.
  const [opWriteOff, setOPWriteOff] = useState(undefined);
  // const [opWriteOffLabel, setopWriteOffLable] = useState("");
  //Its as object to send header and child id.
  const [opConsultCash, setOPConsultCash] = useState(undefined);
  // const [opConsultCashLabel, setOPConsultCashLable] = useState("");
  //Its as object to send header and child id.
  const [opLabTax, setOPLabTax] = useState(undefined);
  // const [opLabTaxLabel, setOPLabTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opRadTax, setOPRadTax] = useState(undefined);
  // const [opRadTaxLabel, setOPRadTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsConsultTax, setOPInsConsultTax] = useState(undefined);
  // const [opInsConsultTaxLabel, setOPInsConsultTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsLabTax, setOPInsLabTax] = useState(undefined);
  // const [opInsLabTaxLabel, setOPInsLabTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsRadTax, setOPInsRadTax] = useState(undefined);
  // const [opInsRadTaxLabel, setOPInsRadTaxLable] = useState("");
  //#endregion
  useEffect(() => {
    getHeaders({ finance_account_head_id: 1 })
      .then(result => {
        if (result.length > 0) {
          setAssets(result[0].children);
        } else {
          setAssets([]);
        }
      })
      .catch(error => {
        setAssets([]);
        AlgaehMessagePop({ type: "error", display: error });
      });
    getHeaders({ finance_account_head_id: 2 })
      .then(result => {
        if (result.length > 0) {
          setLability(result[0].children);
        } else {
          setLability([]);
        }
      })
      .catch(error => {
        setLability([]);
        AlgaehMessagePop({ type: "error", display: error });
      });
    getHeaders({ finance_account_head_id: 5 })
      .then(result => {
        if (result.length > 0) {
          setExpense(result[0].children);
        } else {
          setExpense([]);
        }
      })
      .catch(error => {
        setExpense([]);
        AlgaehMessagePop({ type: "error", display: error });
      });
    getFinanceAccountsMaping()
      .then(result => {
        if (Array.isArray(result)) {
          [
            {
              item: "OP_DEP",
              fun: res => {
                setOpPatientDeposit(res);
              }
            },
            {
              item: "OP_REC",
              fun: res => {
                setOPReceviable(res);
              }
            },
            {
              item: "cash",
              fun: res => {
                setOPCashInHand(res);
              }
            },
            {
              item: "OP_WF",
              fun: res => {
                setOPWriteOff(res);
              }
            },
            {
              item: "OP_CONSULT_TAX",
              fun: res => {
                setOPConsultCash(res);
              }
            },
            {
              item: "OP_LAB_TAX",
              fun: res => {
                setOPLabTax(res);
              }
            },
            {
              item: "OP_RAD_TAX",
              fun: res => {
                setOPRadTax(res);
              }
            },
            {
              item: "OP_INS_CONSULT_TAX",
              fun: res => {
                setOPInsConsultTax(res);
              }
            },
            {
              item: "OP_INS_LAB_TAX",
              fun: res => {
                setOPInsLabTax(res);
              }
            },
            {
              item: "OP_INS_RAD_TAX",
              fun: res => {
                setOPInsRadTax(res);
              }
            }
          ].forEach(selected => {
            debugger;
            const output = result.find(f => f.account === selected.item);
            if (output !== undefined && typeof selected.fun === "function") {
              selected.fun(output["head_id"] + "-" + output["child_id"]);
            }
          });
        }
      })
      .catch(error => {
        AlgaehMessagePop({ type: "error", display: error });
      });
  }, []);

  const breakGenerate = (data, account) => {
    if (data === undefined || data === "") {
      return;
    }
    const splitter = data.split("-");
    return {
      head_id: splitter[0],
      child_id: splitter[1],
      account: account
    };
  };

  return (
    <div className="FinanceMappingScreen">
      <div className="row margin-top-15 margin-bottom-15">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">OP Billing</h3>
              </div>
            </div>
            <div className="portlet-body">
              <AlgaehValidator
                onSubmit={() => {
                  debugger;

                  updateFinanceAccountsMaping([
                    // breakGenerate(opControl, "OP_CON"),
                    breakGenerate(opPatientDeposit, "OP_DEP"),
                    breakGenerate(opReceviable, "OP_REC"),
                    breakGenerate(opCashInHand, "cash"),
                    breakGenerate(opWriteOff, "OP_WF"),
                    breakGenerate(opConsultCash, "OP_CONSULT_TAX"),
                    breakGenerate(opLabTax, "OP_LAB_TAX"),
                    breakGenerate(opRadTax, "OP_RAD_TAX"),
                    breakGenerate(opInsConsultTax, "OP_INS_CONSULT_TAX"),
                    breakGenerate(opInsLabTax, "OP_INS_LAB_TAX"),
                    breakGenerate(opInsRadTax, "OP_INS_RAD_TAX")
                  ])
                    .then(() => {
                      AlgaehMessagePop({
                        type: "success",
                        display: "Updated successfully"
                      });
                    })
                    .catch(error => {
                      AlgaehMessagePop({
                        type: "error",
                        display: JSON.stringify(error)
                      });
                    });
                }}
              >
                <div className="row">
                  {/* <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP CONTROL A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOpControl(value);
                      },
                      data: assets,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opControl
                    }}
                  /> */}
                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Patient Deposit",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOpPatientDeposit(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opPatientDeposit
                    }}
                  />
                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Patient Deposit",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opDepositLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOpPatientDeposit({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_DEP"
                      });
                      setOPDepositLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}
                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Patient Receivable A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPReceviable(value);
                      },
                      data: assets,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opReceviable
                    }}
                  />
                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP Patient Receivable A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opReceviableLable}
                    onChange={(currentNode, selectedNodes) => {
                      setOPReceviable({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_REC"
                      });
                      setOPReceviableLable(currentNode.label);
                    }}
                    others={{
                      data: assets,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Cash In Hand A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPCashInHand(value);
                      },
                      data: assets,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opCashInHand
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Cash In Hand A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opCashInHandLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPCashInHand({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "CH_IN_HA"
                      });
                      setopCashInHandLable(currentNode.label);
                    }}
                    others={{
                      data: assets,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "Visa"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP write-off",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPWriteOff(value);
                      },
                      data: expense,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opWriteOff
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP write-off",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opWriteOffLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPWriteOff({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_WF"
                      });
                      setopWriteOffLable(currentNode.label);
                    }}
                    others={{
                      data: expense,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP write-off"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP consultation tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPConsultCash(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opConsultCash
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP consultation tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opConsultCashLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPConsultCash({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_CONSULT_TAX"
                      });
                      setOPConsultCashLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP Consultation tax for cash"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP lab tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPLabTax(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opLabTax
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP lab tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opLabTaxLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPLabTax({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_LAB_TAX"
                      });
                      setOPLabTaxLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP lab tax for cash"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP radiology tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPRadTax(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opRadTax
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP radiology tax for cash",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opRadTaxLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPRadTax({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_RAD_TAX"
                      });
                      setOPRadTaxLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP radiology tax for cash"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP consultation tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPInsConsultTax(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opInsConsultTax
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP consultation tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opInsConsultTaxLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPInsConsultTax({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_INS_CONSULT_TAX"
                      });
                      setOPInsConsultTaxLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP consultation tax for insurance"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP lab tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPInsLabTax(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opInsLabTax
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP lab tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opInsLabTaxLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPInsLabTax({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_INS_LAB_TAX"
                      });
                      setOPInsLabTaxLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP lab tax for insurance"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehTreeSearch
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP radiology tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: value => {
                        setOPInsRadTax(value);
                      },
                      data: lability,
                      textField: "label",
                      valueField: node => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      value: opInsRadTax
                    }}
                  />

                  {/* <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP radiology tax for insurance",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opInsRadTaxLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOPInsRadTax({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_INS_RAD_TAX"
                      });
                      setOPInsRadTaxLable(currentNode.label);
                    }}
                    others={{
                      data: lability,
                      texts: {
                        placeholder: "Please select account",
                        noMatches: "No records found",
                        label: "OP radiology tax for insurance"
                      },
                      mode: "radioSelect"
                    }}
                  /> */}

                  <AlgaehButton
                    htmlType="submit"
                    className="btn btn-primary"
                    style={{ marginTop: 16 }}
                  >
                    {" "}
                    MAP/UPDATE{" "}
                  </AlgaehButton>
                </div>
              </AlgaehValidator>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
