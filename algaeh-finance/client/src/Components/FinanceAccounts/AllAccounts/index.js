import React, { useState, useEffect, memo } from "react";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
} from "react-sortable-tree";
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import { AlgaehConfirm, AlgaehMessagePop } from "algaeh-react-components";
import {
  removeAccount,
  isPositive,
  renameAccount,
} from ".././FinanceAccountEvent";
import { newAlgaehApi } from "../../../hooks";
import "../alice.scss";

function AllAccounts({ title, inDrawer }) {
  // const [symbol, setSymbol] = useState("");
  // const [financeHeadId, setFinanceHeadId] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(undefined);
  const [isAccountHead, setIsAccountHead] = useState(false);
  const [editorRecord, setEditorRecord] = useState({});
  const [assetCode, setAssetCode] = useState(null);
  const [isNewAccount, setNewAccount] = useState(false);

  function addNode(rowInfo, options, addedNode) {
    return new Promise((resolve, reject) => {
      try {
        const { treeData } = options;
        // let NEW_NODE = { title: addedNode.account_name };
        let { path } = rowInfo;
        if (path === undefined) {
          path = [0];
        }
        let parentNode = getNodeAtPath({
          treeData: treeData,
          path: path,
          getNodeKey: ({ treeIndex }) => treeIndex,
          ignoreCollapsed: true,
        });
        let getNodeKey = ({ node: object, treeIndex: number }) => {
          return number;
        };
        let parentKey = getNodeKey(parentNode);
        if (parentKey === -1) {
          parentKey = null;
        }

        let newTree = addNodeUnderParent({
          treeData: treeData,
          newNode: addedNode,
          expandParent: true,
          parentKey: parentKey,
          getNodeKey: ({ treeIndex }) => treeIndex,
        });
        resolve(newTree);
      } catch (e) {
        reject(e);
      }
    });
  }

  function editChild(input, stopLoad) {
    renameAccount({ ...input, assetCode })
      .then(() => {
        loadAccount();
        setEditorRecord({});
        stopLoad();
        setShowPopup(false);
        setNewAccount(false);
        AlgaehMessagePop({
          type: "success",
          display: "Renamed successfull",
        });
        setSearchQuery(input.child_name);
      })
      .catch((error) => {
        console.log("error", error);
        stopLoad();
        setShowPopup(false);
        setNewAccount(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }

  function removeNode(rowInfo) {
    return new Promise((resolve, reject) => {
      try {
        let { node, path } = rowInfo;
        const {
          head_id,
          finance_account_child_id,
          leafnode,
          finance_account_head_id,
        } = node;
        removeAccount({
          head_id: leafnode === "N" ? finance_account_head_id : head_id,
          child_id: finance_account_child_id,
          leaf_node: leafnode,
          assetCode,
        })
          .then(() => {
            const removeNodeData = removeNodeAtPath({
              treeData,
              path: path,
              getNodeKey: ({ treeIndex }) => treeIndex,
            });
            resolve(removeNodeData);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  function loadAccount() {
    newAlgaehApi({
      uri: "/finance/getAccountHeads",
      module: "finance",
      data: { getAll: "Y" },
      method: "GET",
    })
      .then((response) => {
        if (response.data.success === true) {
          setTreeData(response.data.result);
        }
      })
      .catch((e) => {
        AlgaehMessagePop({
          type: "error",
          display: e.message,
        });
      });
  }

  function onClose(e) {
    setShowPopup(false);
    setNewAccount(false);
    if (isAccountHead) {
      loadAccount();
      setIsAccountHead(false);
    } else {
      if (e !== undefined) {
        addNode(selectedNode, { treeData }, e).then((newTree) => {
          setTreeData(newTree.treeData);
          setIsAccountHead(false);
        });
      }
    }
  }

  function onEditClose() {
    setShowPopup(false);
    setNewAccount(false);
    setEditorRecord({});
  }

  const searchMethod = ({ node, searchQuery }) => {
    return (
      (searchQuery &&
        node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) ||
      (searchQuery &&
        node.arabic_account_name !== null &&
        node.arabic_account_name
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) > -1)
    );
  };

  const generateNodeProps = (rowInfo) => {
    const { node } = rowInfo;

    return {
      buttons: [
        <div className="box">
          <ul className="NodeActionButton">
            <li
              label="Add"
              className={
                "NodeAddButton " + (node.leafnode === "Y" ? "disabled" : "")
              }
              onClick={() => {
                // console.log(rowInfo, "selected node");
                setSelectedNode(rowInfo);
                setShowPopup(true);
                setNewAccount(true);
              }}
            >
              <i className="fas fa-plus"></i>
            </li>
            <li
              label="edit"
              className={
                "NodeEditButton "
                // +
                // (node.created_status === "S" ? "disabled" : "")
              }
              onClick={() => {
                if (Object.keys(editorRecord).length > 0) {
                  setEditorRecord({});
                } else {
                  setAssetCode(rowInfo.parentNode.root_id);
                  setEditorRecord(rowInfo);
                  setShowPopup(true);
                  setNewAccount(false);
                }
              }}
            >
              {JSON.stringify(editorRecord) === JSON.stringify(rowInfo) ? (
                <i className="fas fa-times" />
              ) : (
                <i className="fas fa-pen" />
              )}
            </li>

            <li
              className={
                "NodeDeleteButton " +
                (node.created_status === "S" ? "disabled" : "")
              }
              label="Delete"
            >
              <AlgaehConfirm
                title="Are you sure want to delete ?"
                placement="topLeft"
                onConfirm={(e) => {
                  removeNode(rowInfo)
                    .then((newTree) => {
                      setTreeData(newTree);
                      AlgaehMessagePop({
                        type: "success",
                        display: "Account deleted successfully",
                      });
                    })
                    .catch((error) => {
                      AlgaehMessagePop({
                        type: "error",
                        display: error,
                      });
                    });
                }}
                okButtonProps={{ label: "Delete" }}
                okText="Yes, delete it!"
                cancelText="No"
              >
                <i className="fas fa-trash"></i>
              </AlgaehConfirm>
            </li>
          </ul>
        </div>,
      ],
      style: {
        height: "50px",
        minWidth: "150px",
      },
      title: (
        <>
          <span>
            {node.full_name}

            {/* {node.leafnode === "Y" ? null : (
              <>/{node.children === undefined ? 0 : node.children.length}</>
            )} */}
          </span>
        </>
      ),
      subtitle: (
        <div style={{ fontSize: "medium", marginTop: "7px" }}>
          <span
            className={
              node.subtitle !== undefined ? isPositive(node.subtitle) : ""
            }
          >
            {node.subtitle === undefined ? "0.00" : node.subtitle}
          </span>
          <small>
            {node.trans_symbol === undefined ? "" : node.trans_symbol}
          </small>
        </div>
      ),
      className:
        node.created_status === "S"
          ? "systemGen"
          : node.leafnode === "Y"
          ? ""
          : "accGroup",
    };
  };

  useEffect(loadAccount, []);

  return (
    <div className="container-fluid">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={editorRecord.node ? editorRecord : selectedNode}
        accountCode={assetCode}
        onClose={editorRecord.node ? onEditClose : onClose}
        accountName={editorRecord.node ? editorRecord.node.title : ""}
        ledgerCode={editorRecord.node ? editorRecord.node.ledger_code : ""}
        propOnOK={editorRecord.node ? editChild : null}
        arabicName={
          editorRecord.node ? editorRecord.node.arabic_account_name : ""
        }
        okText={editorRecord.node ? "Change" : "Add"}
        accountType={
          editorRecord.node
            ? editorRecord.node.leafnode === "Y"
              ? "C"
              : "G"
            : ""
        }
        isNewAccount={isNewAccount}
        openingBal={editorRecord.node ? editorRecord.node.subtitle : ""}
      />
      {/* <ReportLauncher
        title="Ledger Report"
        visible={reportVisible}
        selectedNode={selectedNode}
        parentId="1"
        onCancel={() => {
          setReportVisible(false);
        }}
        onOk={() => {
          setReportVisible(false);
        }}
      /> */}

      <div className="row">
        {/* <AccountChart /> */}
        <div className={"col-12"} style={{ padding: 0 }}>
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">{`${title}`}</h3>
              </div>
              <div className="actions">
                {/* <button className="btn btn-default btn-circle active">
                  <i className="fas fa-print" />
                </button> */}
                {/* <button
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    setSelectedNode({
                      node: {
                        // finance_account_head_id: financeHeadId,
                        parent_acc_id: assetCode
                      }
                    });
                    setShowPopup(true);
                    setIsAccountHead(true);
                  }}
                >
                  <i className="fas fa-plus" />
                </button> */}
              </div>
              <div className="searchCntr">
                <input
                  type="text"
                  placeholder="Search Account Heads"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    const values =
                      searchFocusIndex !== undefined
                        ? (searchFoundCount + searchFocusIndex - 1) %
                          searchFoundCount
                        : searchFoundCount - 1;
                    setSearchFocusIndex(values);
                  }}
                >
                  &lt;
                </button>
                <button
                  onClick={() => {
                    const values =
                      searchFocusIndex !== undefined
                        ? (searchFocusIndex + 1) % searchFoundCount
                        : 0;
                    setSearchFocusIndex(values);
                  }}
                >
                  &gt;
                </button>
                <label>
                  {searchFoundCount > 0 ? searchFocusIndex + 1 : 0} /
                  {searchFoundCount || 0}
                </label>
              </div>
            </div>
            <div className="portlet-body">
              <div className="col">
                <div className="row">
                  <div className="treeNodeWrapper">
                    <SortableTree
                      treeData={treeData}
                      onChange={(treeData) => {
                        setTreeData(treeData);
                      }}
                      isVirtualized={true}
                      canDrag={(rowInfo) => {
                        return rowInfo.node.canDrag === true ? true : false;
                      }}
                      generateNodeProps={generateNodeProps}
                      searchMethod={searchMethod}
                      searchQuery={searchQuery}
                      searchFocusOffset={searchFocusIndex}
                      searchFinishCallback={(matches) => {
                        setSearchFocusIndex(
                          matches.length > 0
                            ? searchFocusIndex % matches.length
                            : 0
                        );
                        setSearchFoundCount(matches.length);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AllAccounts);
