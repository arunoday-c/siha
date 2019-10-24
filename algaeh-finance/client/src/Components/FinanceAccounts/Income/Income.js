import React, { useState, useEffect } from "react";
import "./income.scss";

import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import { getAccounts } from ".././FinanceAccountEvent";
import swal from "sweetalert2";

export default function Income() {
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [selectHead, setSelectHead] = useState(false);

  useEffect(() => {
    if (treeData.length === 0) {
      getAccounts(("4"), data => {
        setTreeData(data);
      });
    }
  }, [treeData]);

  function addNode(rowInfo, options, addedNode) {
    return new Promise((resolve, reject) => {
      try {
        debugger
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
    <div className="container-fluid incomeModuleScreen">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={selectedNode}
        onClose={e => {
          setShowPopup(false);
          if (e !== undefined) {
            addNode(selectedNode, { treeData }, e).then(newTree => {
              debugger
              setTreeData(newTree.treeData);
            });
          }
        }}
      />
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Income accounts</h3>
          </div>
          <div className="actions">
            <button
              className="btn btn-primary btn-circle active"
              onClick={() => {
                setSelectHead(true);
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
                    return rowInfo.node.canDrag === true ? true : false;
                  }}
                  generateNodeProps={rowInfo => {
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
                                setSelectHead(false);
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
      {/* <div className="card">
        <h5 className="card-header">New Income Account</h5>
        <div className="card-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Income Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Income Name",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "IBAN",
                isImp: false
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
                isImp: false
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
                isImp: false
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
        <div class="card-footer text-muted ">
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
      </div> */}
    </div>
  );
}
