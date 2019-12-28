import React, { useState, useEffect } from "react";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import {
  AlgaehConfirm,
  AlgaehMessagePop,
  Input,
  Icon
  // DatePicker
} from "algaeh-react-components";
import ReportLauncher from "../AccountReport";
// import Charts from "../Charts";
// import moment from "moment";
import {
  getAccounts,
  removeAccount,
  isPositive,
  renameAccount
  // getChartData
} from ".././FinanceAccountEvent";
import "../alice.scss";
export default function Assets() {
  const [symbol, setSymbol] = useState("");
  const [financeHeadId, setFinanceHeadId] = useState(undefined);
  const [assetAmount, setAssetAmount] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(undefined);
  const [isAccountHead, setIsAccountHead] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [editorRecord, setEditorRecord] = useState({});
  // const [period, setPeriod] = useState("4");
  // const [accountChart, setAccountChart] = useState([]);
  // const [year, setYear] = useState(moment());
  const assetCode = "1";
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
          ignoreCollapsed: true
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
          getNodeKey: ({ treeIndex }) => treeIndex
        });
        resolve(newTree);
      } catch (e) {
        reject(e);
      }
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
          finance_account_head_id
        } = node;
        removeAccount({
          head_id: leafnode === "N" ? finance_account_head_id : head_id,
          child_id: finance_account_child_id,
          leaf_node: leafnode
        })
          .then(() => {
            const removeNodeData = removeNodeAtPath({
              treeData,
              path: path,
              getNodeKey: ({ treeIndex }) => treeIndex
            });
            resolve(removeNodeData);
          })
          .catch(error => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
  function loadAccount() {
    getAccounts(assetCode, data => {
      if (Array.isArray(data)) {
        if (data.length > 0) {
          const firstData = data[0];
          setFinanceHeadId(firstData.finance_account_head_id);
          setTreeData(firstData.children);
          setAssetAmount(firstData["subtitle"]);
          setSymbol(firstData["trans_symbol"]);
          // loadChartData(firstData.finance_account_head_id);
        } else {
          setTreeData([]);
        }
      } else {
        setTreeData([]);
      }
    });
  }
  // function loadChartData(finheadId) {
  //   getChartData({
  //     finance_account_head_id:
  //       finheadId === undefined ? financeHeadId : finheadId,
  //     period: period,
  //     year: moment(year).format("YYYY")
  //   })
  //     .then(result => {
  //       setAccountChart(result);
  //     })
  //     .catch(error => {
  //       AlgaehMessagePop({ type: "error", display: error });
  //     });
  // }
  useEffect(loadAccount, []);
  return (
    <div className="container-fluid assetsModuleScreen">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={selectedNode}
        accountCode={assetCode}
        onClose={e => {
          setShowPopup(false);
          if (isAccountHead) {
            loadAccount();
            setIsAccountHead(false);
          } else {
            if (e !== undefined) {
              addNode(selectedNode, { treeData }, e).then(newTree => {
                setTreeData(newTree.treeData);
                setIsAccountHead(false);
              });
            }
          }
        }}
      />
      <ReportLauncher
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
      />

      <div className="row">
        {/* <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Asset accounts</h3>
              </div>
              <div className="actions">
                <select
                  value={period}
                  onChange={e => {
                    setPeriod(e.target.value);
                  }}
                >
                  <option value="1">Jan - Mar</option>
                  <option value="2">Apr - Jun</option>
                  <option value="3">Jul - Sep</option>
                  <option value="4">Oct - Dec</option>
                  <option value="5">By Year</option>
                </select>
                <DatePicker
                  mode="year"
                  size="small"
                  value={year}
                  format="YYYY"
                  onPanelChange={selectedDate => {
                    setYear(selectedDate);
                  }}
                />
              </div>
            </div>
            <div className="portlet-body">
              <Charts
                data={accountChart}
                xAxis={"month_name"}
                yAxisBar={"amount"}
                yAxisLine={"growth_percent"}
              />
            </div>
          </div>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Asset accounts</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <Charts data={[]} xAxis={""} yAxisBar={""} yAxisLine={""} />
            </div>
          </div>
        </div> */}
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Asset Accounts: {assetAmount}
                  {symbol}
                </h3>
              </div>
              <div className="actions">
                <button className="btn btn-default btn-circle active">
                  <i className="fas fa-print" />
                </button>
                <button
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    setSelectedNode({
                      node: {
                        finance_account_head_id: financeHeadId,
                        parent_acc_id: "1"
                      }
                    });
                    setShowPopup(true);
                    setIsAccountHead(true);
                  }}
                >
                  <i className="fas fa-plus" />
                </button>{" "}
              </div>
              <div className="searchCntr">
                <input
                  type="text"
                  placeholder="Search Account Heads"
                  value={searchQuery}
                  onChange={e => {
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
                  {" "}
                  &lt;{" "}
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
                  {searchFoundCount > 0 ? searchFocusIndex + 1 : 0} /{" "}
                  {searchFoundCount || 0}{" "}
                </label>
              </div>
            </div>
            <div className="portlet-body">
              <div className="col">
                <div className="row">
                  <div className="treeNodeWrapper">
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
                        const { node } = rowInfo;
                        return {
                          buttons: [
                            <div className="box">
                              <ul className="NodeActionButton">
                                <li
                                  label="Add"
                                  className={
                                    "NodeAddButton " +
                                    (node.leafnode === "Y" ? "disabled" : "")
                                  }
                                  onClick={() => {
                                    setShowPopup(true);
                                    setSelectedNode(rowInfo);
                                  }}
                                >
                                  <i className="fas fa-plus"></i>
                                </li>
                                <li
                                  label="edit"
                                  className={
                                    "NodeEditButton " +
                                    (node.created_status === "S"
                                      ? "disabled"
                                      : "")
                                  }
                                  onClick={() => {
                                    if (Object.keys(editorRecord).length > 0) {
                                      setEditorRecord({});
                                    } else {
                                      setEditorRecord(rowInfo);
                                    }
                                  }}
                                >
                                  {JSON.stringify(editorRecord) ===
                                  JSON.stringify(rowInfo) ? (
                                    <i className="fas fa-times" />
                                  ) : (
                                    <i className="fas fa-pen" />
                                  )}
                                </li>
                                <li
                                  label="print"
                                  className={"NodePrintButton "}
                                  onClick={() => {
                                    setReportVisible(true);
                                    setSelectedNode(rowInfo);
                                  }}
                                >
                                  <i className="fas fa-print"></i>
                                </li>
                                <li
                                  className={
                                    "NodeDeleteButton " +
                                    (node.created_status === "S"
                                      ? "disabled"
                                      : "")
                                  }
                                  label="Delete"
                                >
                                  <AlgaehConfirm
                                    title="Are you sure want to delete ?"
                                    placement="topLeft"
                                    onConfirm={e => {
                                      removeNode(rowInfo)
                                        .then(newTree => {
                                          setTreeData(newTree);
                                          AlgaehMessagePop({
                                            type: "success",
                                            display:
                                              "Account deleted successfully"
                                          });
                                        })
                                        .catch(error => {
                                          AlgaehMessagePop({
                                            type: "error",
                                            display: error
                                          });
                                        });
                                    }}
                                    okButtonProps={{ label: "Delete" }}
                                    okText="Yes, delete it!"
                                    cancelText="No"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </AlgaehConfirm>{" "}
                                </li>
                              </ul>
                            </div>
                          ],
                          style: {
                            height: "50px",
                            minWidth: "150px"
                          },
                          title: (
                            <>
                              <span>
                                {JSON.stringify(editorRecord) ===
                                JSON.stringify(rowInfo) ? (
                                  <Input
                                    suffix={
                                      <Icon
                                        type="save"
                                        onClick={e => {
                                          const editedValue =
                                            e.currentTarget.offsetParent
                                              .previousElementSibling.value;

                                          const rowNode = rowInfo.node;
                                          let input = {
                                            leaf_node: rowNode.leafnode
                                          };
                                          if (rowNode.leafnode === "Y") {
                                            input["child_name"] = editedValue;
                                            input["finance_account_child_id"] =
                                              rowNode.finance_account_child_id;
                                          } else {
                                            input["account_name"] = editedValue;
                                            input["finance_account_head_id"] =
                                              rowNode.finance_account_head_id;
                                          }
                                          renameAccount(input)
                                            .then(() => {
                                              node["title"] = editedValue;
                                              setEditorRecord({});
                                              AlgaehMessagePop({
                                                type: "success",
                                                display: "Renamed successfull"
                                              });
                                            })
                                            .catch(error => {
                                              console.log("error", error);
                                              AlgaehMessagePop({
                                                type: "error",
                                                display: error
                                              });
                                            });
                                        }}
                                      />
                                    }
                                    defaultValue={node.title}
                                  />
                                ) : (
                                  node.title
                                )}{" "}
                                {node.leafnode === "Y" ? null : (
                                  <>
                                    /
                                    {node.children === undefined
                                      ? 0
                                      : node.children.length}
                                  </>
                                )}
                              </span>
                            </>
                          ),
                          subtitle: (
                            <div
                              style={{ fontSize: "medium", marginTop: "7px" }}
                            >
                              <span
                                className={
                                  node.subtitle !== undefined
                                    ? isPositive(node.subtitle)
                                    : ""
                                }
                              >
                                {node.subtitle === undefined
                                  ? "0.00"
                                  : node.subtitle}
                              </span>{" "}
                              <small>
                                {node.trans_symbol === undefined
                                  ? symbol
                                  : node.trans_symbol}
                              </small>
                            </div>
                          ),
                          className:
                            node.created_status === "S"
                              ? "systemGen"
                              : node.leafnode === "Y"
                              ? ""
                              : "accGroup"
                        };
                      }}
                      searchMethod={({ node, searchQuery }) => {
                        return (
                          searchQuery &&
                          node.title
                            .toLowerCase()
                            .indexOf(searchQuery.toLowerCase()) > -1
                        );
                      }}
                      searchQuery={searchQuery}
                      searchFocusOffset={searchFocusIndex}
                      searchFinishCallback={matches => {
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
