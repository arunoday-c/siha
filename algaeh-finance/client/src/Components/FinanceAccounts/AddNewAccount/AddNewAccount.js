
import React, { useState } from "react";
import {AlgaehModal,Spin,AlgaehMessagePop} from "algaeh-react-components";
import "./addnewaccount.scss";
import {
  AlgaehFormGroup,
  AlgaehDropDown
} from "../../../Wrappers";
// import ButtonType from "../../../Wrappers/algaehButton";
import { AccountType } from "../../../utils/GlobalVariables";
import { AddNewAccountDetails } from "./AddNewAccEvent";
// import { swalMessage } from "../../../utils/algaehApiCall";

export default function AddNewAccount(props) {
  const [lodingAddtoList, setLoadingAddtoList] = useState(false);
  const [account_code, setAccountCode] = useState("");
  const [account_name, setAccountName] = useState("");
  const [account_type, setAccountType] = useState("G");
  const [opening_balance, setOpeningBalance] = useState(0);
  // const [opening_balance_date, setOpeningBalanceDate] = useState("");
  const { showPopup, onClose, selectedNode,okText } = props;

  return (
    <AlgaehModal
        title="Add/Modify Account"
        visible={showPopup}
        okButtonProps={{
            loading:lodingAddtoList
        }}
        okText={okText ===undefined? "Add":okText}
        maskClosable={false}
        cancelButtonProps={{disabled:lodingAddtoList}}
        closable={false}
        onCancel={() => {
            setLoadingAddtoList(false);
            setAccountCode("");
           setAccountName("");
           setAccountType("G");
           setOpeningBalance(0);
        onClose();
      }}
        onOk={()=>{
            setLoadingAddtoList(true);
            AddNewAccountDetails(
                {
                    finance_account_head_id:
                    selectedNode.node.finance_account_head_id,
                    account_name: account_name,
                    leaf_node: account_type === "G" ? "N" : "Y"
                },
                errorMessage => {
                    setAccountCode("");
                    setAccountName("");
                    setAccountType("G");
                    setOpeningBalance(0);
                    onClose();
                    setLoadingAddtoList(false);
                    AlgaehMessagePop({
                        type: "error",
                        display:errorMessage
                    });

                },
                result => {
                    setAccountCode("");
                    setAccountName("");
                    setAccountType("G");
                    setOpeningBalance(0);
                    onClose({
                        title: account_name,
                        leafnode: account_type === "G" ? "N" : "Y",
                        head_created_from: "U",
                        finance_account_head_id: result.insertId
                    });
                    setLoadingAddtoList(false);
                    AlgaehMessagePop({
                        type: "success",
                        display:"Added Successfully ..."
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
                    debugger;
                    setOpeningBalance(e.target.value);
                  },
                  placeholder: " Enter Opening Balance",
                  autocomplete: false
                }}
            />
        ) : null}

      </div>
      </Spin>
      {/*<div className="popupInner" data-validate="LvEdtGrd">*/}
      {/*  <div className="container-fluid addnewaccountModuleScreen">*/}
      {/*    <h5 className="card-header">New Asset Account</h5>*/}
      {/*    <div className="card-body">*/}

      {/*    </div>*/}
      {/*  </div>*/}
        {/*<div className="popupFooter">*/}
        {/*  <div className="col-lg-12">*/}
        {/*    <div className="row">*/}
        {/*      <div className="col-lg-4"> &nbsp;</div>*/}
        {/*      <ButtonType*/}
        {/*        classname="btn-primary"*/}
        {/*        loading={lodingAddtoList}*/}
        {/*        onClick={() => {*/}
        {/*          setLoadingAddtoList(true);*/}
        {/*          AddNewAccountDetails(*/}
        {/*            {*/}
        {/*              finance_account_head_id:*/}
        {/*                selectedNode.node.finance_account_head_id,*/}
        {/*              account_name: account_name,*/}
        {/*              leaf_node: account_type === "G" ? "N" : "Y"*/}
        {/*            },*/}
        {/*            errorMessage => {*/}
        {/*              setAccountCode("");*/}
        {/*              setAccountName("");*/}
        {/*              setAccountType("G");*/}
        {/*              setOpeningBalance(0);*/}
        {/*              onClose();*/}
        {/*              setLoadingAddtoList(false);*/}
        {/*              swalMessage({*/}
        {/*                type: "error",*/}
        {/*                title: errorMessage*/}
        {/*              });*/}
        {/*            },*/}
        {/*            result => {*/}
        {/*              setAccountCode("");*/}
        {/*              setAccountName("");*/}
        {/*              setAccountType("G");*/}
        {/*              setOpeningBalance(0);*/}
        {/*              onClose({*/}
        {/*                title: account_name,*/}
        {/*                leafnode: account_type === "G" ? "N" : "Y",*/}
        {/*                head_created_from: "U",*/}
        {/*                finance_account_head_id: result.insertId*/}
        {/*              });*/}
        {/*              setLoadingAddtoList(false);*/}
        {/*              swalMessage({*/}
        {/*                type: "success",*/}
        {/*                title: "Added Successfully ..."*/}
        {/*              });*/}
        {/*            }*/}
        {/*          );*/}
        {/*        }}*/}

        {/*        label={{*/}
        {/*          forceLabel: "Add to List",*/}
        {/*          returnText: true*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <button*/}
        {/*        onClick={() => {*/}
        {/*          setAccountCode("");*/}
        {/*          setAccountName("");*/}
        {/*          setAccountType("G");*/}
        {/*          setOpeningBalance(0);*/}
        {/*          onClose();*/}
        {/*        }}*/}
        {/*        type="button"*/}
        {/*        className="btn btn-default"*/}
        {/*      >*/}
        {/*        CANCEL*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      {/*</div>*/}
    </AlgaehModal>
  );
}
