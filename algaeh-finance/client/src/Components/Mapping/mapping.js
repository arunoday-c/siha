import React, { useEffect, useState } from "react";
import {
  AlgaehTreeDropDown,
  AlgaehValidator,
  AlgaehButton,
  AlgaehMessagePop
} from "algaeh-react-components";
import {
  getHeaders,
  updateFinanceAccountsMaping,
  getFinanceAccountsMaping
} from "./mapping.eventl";
export default function(props) {
  //#region State variables
  const [assets, setAssets] = useState([]);
  const [lability, setLability] = useState([]);
  const [expense, setExpense] = useState([]);
  //Its as object to send header and child id.
  const [opControl, setOpControl] = useState({});
  const [opControlLabel, setOpControlLable] = useState("");
  //Its as object to send header and child id.
  const [opPatientDeposit, setOpPatientDeposit] = useState({});
  const [opDepositLabel, setOPDepositLable] = useState("");
  //Its as object to send header and child id.
  const [opReceviable, setOPReceviable] = useState({});
  const [opReceviableLable, setOPReceviableLable] = useState("");
  //Its as object to send header and child id.
  const [opCashInHand, setOPCashInHand] = useState({});
  const [opCashInHandLabel, setopCashInHandLable] = useState("");
  //Its as object to send header and child id.
  const [opWriteOff, setOPWriteOff] = useState({});
  const [opWriteOffLabel, setopWriteOffLable] = useState("");
  //Its as object to send header and child id.
  const [opConsultCash, setOPConsultCash] = useState({});
  const [opConsultCashLabel, setOPConsultCashLable] = useState("");
  //Its as object to send header and child id.
  const [opLabTax, setOPLabTax] = useState({});
  const [opLabTaxLabel, setOPLabTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opRadTax, setOPRadTax] = useState({});
  const [opRadTaxLabel, setOPRadTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsConsultTax, setOPInsConsultTax] = useState({});
  const [opInsConsultTaxLabel, setOPInsConsultTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsLabTax, setOPInsLabTax] = useState({});
  const [opInsLabTaxLabel, setOPInsLabTaxLable] = useState("");
  //Its as object to send header and child id.
  const [opInsRadTax, setOPInsRadTax] = useState({});
  const [opInsRadTaxLabel, setOPInsRadTaxLable] = useState("");
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
          const opCon = result.find(f => f.account === "OP_CON");
          if (opCon !== undefined) {
            setOpControl(opCon);
            setOpControlLable(opCon.child_name);
          }
          const opDep = result.find(f => f.account === "OP_DEP");
          if (opDep !== undefined) {
            setOpPatientDeposit(opDep);
            setOPDepositLable(opDep.child_name);
          }

          const opRec = result.find(f => f.account === "OP_REC");
          if (opRec !== undefined) {
            setOPReceviable(opRec);
            setOPReceviableLable(opRec.child_name);
          }
          const cashInHand = result.find(f => f.account === "CH_IN_HA");
          if (cashInHand !== undefined) {
            setOPCashInHand(cashInHand);
            setopCashInHandLable(cashInHand.child_name);
          }

          const opWriteOff = result.find(f => f.account === "OP_WF");
          if (opWriteOff !== undefined) {
            setOPWriteOff(opWriteOff);
            setopWriteOffLable(opWriteOff.child_name);
          }
          const opconst = result.find(f => f.account === "OP_CONSULT_TAX");
          if (opconst !== undefined) {
            setOPConsultCash(opconst);
            setOPConsultCashLable(opconst.child_name);
          }
          const oplabTax = result.find(f => f.account === "OP_LAB_TAX");
          if (oplabTax !== undefined) {
            setOPLabTax(oplabTax);
            setOPLabTaxLable(oplabTax.child_name);
          }
          const opradTax = result.find(f => f.account === "OP_RAD_TAX");
          if (opradTax !== undefined) {
            setOPRadTax(opradTax);
            setOPRadTaxLable(opradTax.child_name);
          }
          const opconsInstax = result.find(f => f.account === "OP_INS_CONSULT_TAX");
          if (opconsInstax !== undefined) {
            setOPInsConsultTax(opconsInstax);
            setOPInsConsultTaxLable(opconsInstax.child_name);
          }
          const opinsLabTax = result.find(f => f.account === "OP_INS_LAB_TAX");
          if (opinsLabTax !== undefined) {
            setOPInsLabTax(opinsLabTax);
            setOPInsLabTaxLable(opinsLabTax.child_name);
          }
          const opinsRadTax= result.find(f => f.account === "OP_INS_RAD_TAX");
          if (opinsRadTax !== undefined) {
            setOPInsRadTax(opinsRadTax);
            setOPInsRadTaxLable(opinsRadTax.child_name);
          }


        }
      })
      .catch(error => {
        AlgaehMessagePop({ type: "error", display: error });
      });
  }, []);

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
                  updateFinanceAccountsMaping([
                    opControl,
                    opPatientDeposit,
                    opReceviable,
                    opCashInHand,
                    opWriteOff,
                    opConsultCash,
                    opLabTax,opRadTax,opInsConsultTax,opInsLabTax,opInsRadTax
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
                  <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "OP CONTROL A/C",
                      isImp: true,
                      align: "ltr"
                    }}
                    value={opControlLabel}
                    onChange={(currentNode, selectedNodes) => {
                      setOpControl({
                        head_id: currentNode.head_id,
                        child_id: currentNode.finance_account_child_id,
                        account: "OP_CON"
                      });
                      setOpControlLable(currentNode.label);
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
                  />

                  <AlgaehTreeDropDown
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
                  />
                  <AlgaehTreeDropDown
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
                  />
                  <AlgaehTreeDropDown
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
                  />

                  <AlgaehTreeDropDown
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
                  />

                  <AlgaehTreeDropDown
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
                  />

                  <AlgaehTreeDropDown
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
                  />

                    <AlgaehTreeDropDown
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
                    />

                  <AlgaehTreeDropDown
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
                  />


                  <AlgaehTreeDropDown
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
                  />
                  <AlgaehTreeDropDown
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
                  />


                  <AlgaehButton htmlType="submit" className="btn btn-primary">
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
