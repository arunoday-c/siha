// @flow
import React, { useState, useEffect } from "react";
import { Accordion } from "semantic-ui-react";
import "./assets.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown,
  AlgaehModalPopUp
} from "../../../Wrappers";
import { currency_list, account_role } from "../../../data/dropdownList";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getAssetsAccounts } from "./AssetEvents";
import AddNewAccount from "./AddNewAccount";
import swal from "sweetalert2";

export default function Assets() {
  const [node_id, settreeIndex] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});

  useEffect(() => {
    if (treeData.length === 0) {
      getAssetsAccounts(data => {
        setTreeData(data);
      });
    }
  }, [treeData]);

  function addNode(rowInfo, options, addedNode) {
    debugger;
    return new Promise((resolve, reject) => {
      try {
        const { treeData } = options;
        // let NEW_NODE = { title: addedNode.account_name };
        let { node, treeIndex, path } = rowInfo;
        let parentNode = getNodeAtPath({
          treeData: treeData,
          path: path,
          getNodeKey: ({ treeIndex }) => treeIndex,
          ignoreCollapsed: true
        });
        let getNodeKey = ({ node: object, treeIndex: number }) => {
          return number;
        };
        let parentKey = getNodeKey(parentNode);
        if (parentKey == -1) {
          parentKey = null;
        }
        console.log(path, treeIndex);
        let newTree = addNodeUnderParent({
          treeData: treeData,
          newNode: addedNode,
          expandParent: true,
          parentKey: parentKey,
          getNodeKey: ({ treeIndex }) => treeIndex
        });
        resolve(newTree);
      } catch (e) {
        reject(e);
      }
    });
  }
  function removeNode(rowInfo, options) {
    return new Promise((resolve, reject) => {
      try {
        debugger;
        const { treeData } = options;
        let { node, treeIndex, path } = rowInfo;
        console.log(path, treeIndex);

        const removeNodeData = removeNodeAtPath({
          treeData: treeData,
          path: path,
          getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
            return number;
          },
          ignoreCollapsed: false
        });
        resolve(removeNodeData);
      } catch (e) {
        reject(e);
      }
    });
  }

  return (
    <div className="container-fluid assetsModuleScreen">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={selectedNode}
        onClose={e => {
          debugger;
          setShowPopup(false);
          if (e !== undefined) {
            addNode(selectedNode, { treeData }, e).then(newTree => {
              setTreeData(newTree.treeData);
            });
          }
        }}
      />
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Asset accounts</h3>
          </div>
          <div className="actions">
            <button
              className="btn btn-primary btn-circle active"
              onClick={() => {
                setShowPopup(true);
              }}
            >
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
        <div className="portlet-body">
          <div className="col">
            <div className="row">
              <div style={{ height: 400, width: "100vw" }}>
                <SortableTree
                  treeData={treeData}
                  onChange={treeData => {
                    setTreeData(treeData);
                  }}
                  isVirtualized={true}
                  canDrag={rowInfo => {
                    debugger;
                    return rowInfo.node.canDrag === true ? true : false;
                  }}
                  generateNodeProps={rowInfo => {
                    debugger;
                    return {
                      buttons: [
                        <div>
                          {rowInfo.node.head_created_from === "U" ? (
                            <button
                              label="Delete"
                              onClick={event => {
                                let child_exists =
                                  rowInfo.node.children === undefined
                                    ? ""
                                    : rowInfo.node.children.length > 0
                                    ? "This node exists Sub Accounts, If delete childs also will get delete !"
                                    : "";
                                // rowInfo
                                swal
                                  .fire({
                                    title: "Are you sure want to Remove?",
                                    text: child_exists,
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!"
                                  })
                                  .then(willProceed => {
                                    if (willProceed.value) {
                                      removeNode(rowInfo, { treeData })
                                        .then(newTree => {
                                          setTreeData(newTree);
                                        })
                                        .catch(error => {
                                          alert(error);
                                        });
                                    }
                                  });
                              }}
                            >
                              Remove
                            </button>
                          ) : null}

                          {rowInfo.node.leafnode === "N" ? (
                            <button
                              label="Add"
                              onClick={event => {
                                debugger;
                                setShowPopup(true);
                                setSelectedNode(rowInfo);
                              }}
                            >
                              Add
                            </button>
                          ) : null}
                        </div>
                      ],
                      style: {
                        height: "50px"
                      }
                    };
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*<div className="card">
        <h5 className="card-header">New Asset Account</h5>
        <div className="card-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Asset Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Asset Name",
                autocomplete: false
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Default Currency",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: currency_list
              }}
            />
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "IBAN",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "Enter IBAN",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "BIC",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter BIC",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Account number",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Account number",
                autocomplete: false
              }}
            />{" "}
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
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Opening Balance",
                autocomplete: false
              }}
            />
            <AlgaehDateHandler
              div={{
                className: "form-group algaeh-email-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Opening balance date",
                isImp: true
              }}
              textBox={{
                name: "enter_date",
                className: "form-control"
              }}
              events={{
                onChange: e => console.log(e.target)
              }}
              value={new Date()}
              maxDate={new Date()}
              minDate={new Date()}
            />
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Account role",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: account_role
              }}
            />{" "}
            <div className="form-group algaeh-checkbox-fld col-xs-4 col-md-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="includeNetWorth"
                />
                <label className="form-check-label" for="includeNetWorth">
                  Include in net worth
                </label>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="card-footer text-muted ">
          <button className="btn btn-primary" style={{ float: "right" }}>
            Add to List
          </button>{" "}
          <button
            className="btn btn-default"
            style={{ float: "right", marginRight: 10 }}
          >
            Clear
          </button>
        </div>
      </div>*/}
    </div>
  );
}
