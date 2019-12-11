import React, { useState, useEffect } from "react";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import {
  AlgaehConfirm,
  AlgaehMessagePop,
  Input,
  Icon,
  DatePicker
} from "algaeh-react-components";
import ReportLauncher from "../AccountReport";
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import {
  getAccounts,
  isPositive,
  removeAccount,
  getChartData
} from ".././FinanceAccountEvent";
import "react-sortable-tree/style.css";
import "../alice.scss";
import moment from "moment";
import Charts from "../Charts";

export default function Income() {
  const [symbol, setSymbol] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(undefined);
  const [isAccountHead, setIsAccountHead] = useState(false);
  const [financeHeadId, setFinanceHeadId] = useState(undefined);
  const [reportVisible, setReportVisible] = useState(false);
  const [editorRecord, setEditorRecord] = useState({});
  const [period, setPeriod] = useState("4");
  const [accountChart, setAccountChart] = useState([]);
  const [year, setYear] = useState(moment());
  function loadAccount() {
    getAccounts("4", data => {
      if (Array.isArray(data)) {
        if (data.length > 0) {
          const firstData = data[0];
          setFinanceHeadId(firstData.finance_account_head_id);
          setTreeData(firstData.children);
          setIncomeAmount(firstData["subtitle"]);
          setSymbol(firstData["trans_symbol"]);
          loadChartData(firstData.finance_account_head_id);
        } else {
          setTreeData([]);
        }
      } else {
        setTreeData([]);
      }
    });
  }
  function loadChartData(finheadId) {
    getChartData({
      finance_account_head_id:
        finheadId === undefined ? financeHeadId : finheadId,
      period: period,
      year: moment(year).format("YYYY")
    })
      .then(result => {
        setAccountChart(result);
      })
      .catch(error => {
        AlgaehMessagePop({ type: "error", display: error });
      });
  }
  useEffect(loadAccount, []);

  function addNode(rowInfo, options, addedNode) {
    return new Promise((resolve, reject) => {
      try {
        const { treeData } = options;

        let { path } = rowInfo;
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

  function removeNode(rowInfo, options) {
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
  return (
    <div className="container-fluid incomeModuleScreen">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={selectedNode}
        onClose={e => {
          setShowPopup(false);
          if (isAccountHead) {
            loadAccount();
            setIsAccountHead(false);
          } else {
            if (e !== undefined) {
              addNode(selectedNode, { treeData }, e).then(newTree => {
                setIsAccountHead(false);
                setTreeData(newTree.treeData);
              });
            }
          }
        }}
      />
      <ReportLauncher
        title="Ledger Report"
        visible={reportVisible}
        parentId="4"
        selectedNode={selectedNode}
        onCancel={() => {
          setReportVisible(false);
        }}
        onOk={() => {
          setReportVisible(false);
        }}
      />
      <div className="row">
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Income accounts</h3>
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
                <h3 className="caption-subject">Income accounts</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <Charts data={[]} xAxis={""} yAxisBar={""} yAxisLine={""} />
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Income accounts: {incomeAmount} {symbol}
                </h3>
              </div>
              <div className="actions">
                <button
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    setSelectedNode({
                      node: {
                        finance_account_head_id: financeHeadId,
                        parent_acc_id: "4"
                      }
                    });
                    setShowPopup(true);
                    setIsAccountHead(true);
                  }}
                >
                  <i className="fas fa-plus" />
                </button>
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
                  {" "}
                  &gt;{" "}
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
                                          // const editedValue =
                                          //   e.currentTarget.offsetParent
                                          //     .previousElementSibling.value;
                                          setEditorRecord({});
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
