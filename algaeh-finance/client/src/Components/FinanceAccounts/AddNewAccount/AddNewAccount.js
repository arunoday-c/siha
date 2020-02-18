import React, { useState, useEffect } from "react";
import { AlgaehModal, AlgaehMessagePop } from "algaeh-react-components";
import { Checkbox, Spin } from "antd";
import "./addnewaccount.scss";
import { AlgaehFormGroup, AlgaehDropDown } from "../../../Wrappers";
// import ButtonType from "../../../Wrappers/algaehButton";
import { AccountType } from "../../../utils/GlobalVariables";
import { AddNewAccountDetails } from "./AddNewAccEvent";
import { newAlgaehApi } from "../../../hooks";
// import { swalMessage } from "../../../utils/algaehApiCall";

export default function AddNewAccount({
  showPopup,
  onClose,
  selectedNode,
  okText,
  accountCode,
  accountName,
  accountType,
  openingBal,
  propOnOK,
  isNewAccount,
  ledgerCode
}) {
  debugger
  const [lodingAddtoList, setLoadingAddtoList] = useState(false);
  // const [account_code, setAccountCode] = useState("");
  const [account_name, setAccountName] = useState("");
  const [ledger_code, setLedgerCode] = useState("");
  const [account_type, setAccountType] = useState("G");
  const [opening_balance, setOpeningBalance] = useState(0);
  const [enableOP, setEnableOP] = useState(true);
  // const [opening_balance_date, setOpeningBalanceDate] = useState("");

  useEffect(() => {
    async function getOpeningBalance(child_id) {
      try {
        const response = await newAlgaehApi({
          uri: "/finance/getOpeningBalance",
          method: "GET",
          data: {
            child_id
          },
          module: "finance"
        });
        return response.data.result;
      } catch (error) {
        throw Error(error.message);
      }
    }

    if (accountName) {
      setAccountName(accountName);
      setLedgerCode(ledgerCode);

      // eslint-disable-next-line eqeqeq
      if (accountType !== "G" && !(accountCode === 4 || accountCode === 5)) {
        setLoadingAddtoList(true);
        getOpeningBalance(selectedNode.node.finance_account_child_id)
          .then(res => {
            setLoadingAddtoList(false);
            setOpeningBalance(res.opening_bal);
          })
          .catch(e => {
            setLoadingAddtoList(false);
            AlgaehMessagePop({
              type: "error",
              display: e.message
            });
          });
      }
      setEnableOP(false);
    }
    if (accountType) {
      setAccountType(accountType);
    }
  }, [accountName, accountType, openingBal, selectedNode, accountCode, ledgerCode]);

  function onCancel() {
    setLoadingAddtoList(false);
    // setAccountCode("");
    setAccountName("");
    setLedgerCode("");
    setAccountType("G");
    setOpeningBalance(0);
    onClose();
  }

  function onOK() {
    if (ledger_code === "") {
      AlgaehMessagePop({
        type: "warning",
        display: "Enter Account Code."
      });
      return
    }

    if (account_name === "") {
      AlgaehMessagePop({
        type: "warning",
        display: "Enter Account Name."
      });
      return
    }

    setLoadingAddtoList(true);
    if (accountName && propOnOK) {
      const input = {
        child_name: account_name,
        finance_account_child_id: selectedNode.node.finance_account_child_id,
        leaf_node: account_type === "G" ? "N" : "Y"
      };
      if (enableOP) {
        input.opening_balance = opening_balance;
      }
      propOnOK(input, () => setLoadingAddtoList(false));
    } else {
      const {
        finance_account_head_id,
        account_code,
        parent_acc_id
      } = selectedNode.node;
      AddNewAccountDetails(
        {
          finance_account_head_id: finance_account_head_id,
          account_name: account_name,
          account_code: account_code,
          chart_of_account: parent_acc_id,
          leaf_node: account_type === "G" ? "N" : "Y",
          opening_bal: opening_balance,
          ledger_code: ledger_code
        },
        errorMessage => {
          // setAccountCode("");
          setAccountName("");
          setLedgerCode("");
          setAccountType("G");
          setOpeningBalance(0);
          setLoadingAddtoList(false);
          AlgaehMessagePop({
            type: "error",
            display: errorMessage
          });
          onClose();
        },
        result => {
          // setAccountCode("");
          setAccountName("");
          setLedgerCode("");
          setAccountType("G");
          setOpeningBalance(0);
          const {
            finance_account_head_id,
            account_code,
            head_id,
            child_id
          } = result;
          onClose({
            title: account_name,
            subtitle: opening_balance ? `${opening_balance}.00` : `0.00`,
            leafnode: account_type === "G" ? "N" : "Y",
            head_created_from: "U",
            finance_account_head_id: finance_account_head_id,
            account_code: account_code,
            head_id,
            finance_account_child_id: child_id
          });
          setLoadingAddtoList(false);
          AlgaehMessagePop({
            type: "success",
            display: "Added Successfully ..."
          });
        }
      );
    }
  }

  return (
    <AlgaehModal
      title="Add/Modify Account"
      visible={showPopup}
      okButtonProps={{
        loading: lodingAddtoList
      }}
      okText={okText === undefined ? "Add" : okText}
      maskClosable={false}
      cancelButtonProps={{ disabled: lodingAddtoList }}
      closable={false}
      onCancel={onCancel}
      onOk={onOK}
    >
      <Spin tip="Please wait submitting data.." spinning={lodingAddtoList}>
        <div>
          <div className="row">
            <AlgaehDropDown
              div={{
                className: "col form-group"
              }}
              label={{
                forceLabel: "Select Default Currency",
                isImp: true
              }}
              selector={{
                className: "form-control",
                value: account_type,
                name: "account_type",
                disabled: accountName,
                onChange: e => {
                  setAccountType(e.target.value);
                }
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: AccountType
              }}
            />

            {(selectedNode.node !== undefined && selectedNode.node.leafnode === "Y") || account_type === "C" ?
              <AlgaehFormGroup
                div={{
                  className: "col form-group"
                }}
                label={{
                  forceLabel: "Ledger Code",
                  isImp: true
                }}
                textBox={{
                  type: "text",
                  value: ledger_code,
                  className: "form-control",
                  id: "name",
                  onChange: e => {
                    setLedgerCode(e.target.value);
                  },
                  placeholder: " Enter Ledger Code",
                  autoComplete: false
                }}
              /> : null}

            <AlgaehFormGroup
              div={{
                className: "col form-group"
              }}
              label={{
                forceLabel: "Account Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: account_name,
                className: "form-control",
                id: "name",
                onChange: e => {
                  setAccountName(e.target.value);
                },
                placeholder: " Enter Account Name",
                autoComplete: false,
                disabled: isNewAccount === true ? false : selectedNode.node !== undefined && selectedNode.node.created_status === "S" ? true : false
              }}
            />
          </div>
          {account_type === "C" ? (
            accountCode !== 4 && accountCode !== 5 ? (
              <div className="row">
                {accountName ? (
                  <div className="col">
                    <Checkbox
                      style={{ margin: 16 }}
                      checked={enableOP}
                      onChange={() => setEnableOP(state => !state)}
                    >
                      Edit Balance
                    </Checkbox>
                  </div>
                ) : null}
                <AlgaehFormGroup
                  div={{
                    className: "form-group algaeh-text-fld col"
                  }}
                  label={{
                    forceLabel: "Opening Balance",
                    isImp: true
                  }}
                  textBox={{
                    type: "number",
                    value: opening_balance,
                    className: "form-control",
                    id: "name",
                    onChange: e => {
                      setOpeningBalance(e.target.value);
                    },
                    placeholder: " Enter Opening Balance",
                    autoComplete: false,
                    disabled: !enableOP && accountName
                  }}
                />
              </div>
            ) : null
          ) : null}
        </div>
      </Spin>
    </AlgaehModal>
  );
}
