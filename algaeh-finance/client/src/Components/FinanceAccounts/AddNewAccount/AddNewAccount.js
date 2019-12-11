import React, { useState } from "react";
import { AlgaehModal, Spin, AlgaehMessagePop } from "algaeh-react-components";
import "./addnewaccount.scss";
import { AlgaehFormGroup, AlgaehDropDown } from "../../../Wrappers";
// import ButtonType from "../../../Wrappers/algaehButton";
import { AccountType } from "../../../utils/GlobalVariables";
import { AddNewAccountDetails } from "./AddNewAccEvent";
// import { swalMessage } from "../../../utils/algaehApiCall";

export default function AddNewAccount(props) {
  const [lodingAddtoList, setLoadingAddtoList] = useState(false);
  // const [account_code, setAccountCode] = useState("");
  const [account_name, setAccountName] = useState("");
  const [account_type, setAccountType] = useState("G");
  const [opening_balance, setOpeningBalance] = useState(0);
  // const [opening_balance_date, setOpeningBalanceDate] = useState("");
  const { showPopup, onClose, selectedNode, okText } = props;

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
      onCancel={() => {
        setLoadingAddtoList(false);
        // setAccountCode("");
        setAccountName("");
        setAccountType("G");
        setOpeningBalance(0);
        onClose();
      }}
      onOk={() => {
        setLoadingAddtoList(true);
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
            opening_bal: opening_balance
          },
          errorMessage => {
            // setAccountCode("");
            setAccountName("");
            setAccountType("G");
            setOpeningBalance(0);
            onClose();
            setLoadingAddtoList(false);
            AlgaehMessagePop({
              type: "error",
              display: errorMessage
            });
          },
          result => {
            // setAccountCode("");
            setAccountName("");
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
      }}
    >
      <Spin tip="Please wait submitting data.." spinning={lodingAddtoList}>
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
              autocomplete: false
            }}
          />
          {account_type === "C" ? (
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
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
                autocomplete: false
              }}
            />
          ) : null}
        </div>
      </Spin>
    </AlgaehModal>
  );
}
