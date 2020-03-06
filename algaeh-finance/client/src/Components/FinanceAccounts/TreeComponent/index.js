import React, { useState, useEffect, memo } from "react";
import "../alice.scss";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
  toggleExpandedForAll
} from "react-sortable-tree";
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import {
  AlgaehConfirm,
  AlgaehMessagePop,
  Input,
  Icon,
  DatePicker,
  AlgaehTable
} from "algaeh-react-components";
import ReportLauncher from "../AccountReport";
import Charts from "../Charts";
import moment from "moment";
import {
  getAccounts,
  removeAccount,
  isPositive,
  renameAccount,
  getChartData,
  getGridChildNodes
} from ".././FinanceAccountEvent";

import "../alice.scss";
function TreeComponent({ assetCode, title, inDrawer }) {
  const [symbol, setSymbol] = useState("");
  const [financeHeadId, setFinanceHeadId] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(undefined);
  const [isAccountHead, setIsAccountHead] = useState(false);
  const [isNewAccount, setNewAccount] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [editorRecord, setEditorRecord] = useState({});
  const [period, setPeriod] = useState("4");
  const [accountChart, setAccountChart] = useState([]);
  const [year, setYear] = useState(moment());
  const [expandAll, setExpandAll] = useState(false);
  const [layout, setLayout] = useState("tree");
  const [gridData, setGridData] = useState([]);
  const [loadingGridData, setLoadingGridData] = useState(false);

  useEffect(loadAccount, [assetCode]);

  const isExpOrInc = assetCode === 4 || assetCode === 5;
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

  function editChild(input, stopLoad) {
    renameAccount(input)
      .then(() => {
        loadAccount();
        setEditorRecord({});
        stopLoad();
        setShowPopup(false);
        setNewAccount(false);
        AlgaehMessagePop({
          type: "success",
          display: "Renamed successfull"
        });
        setSearchQuery(input.child_name);
      })
      .catch(error => {
        console.log("error", error);
        stopLoad();
        setShowPopup(false);
        setNewAccount(false);
        AlgaehMessagePop({
          type: "error",
          display: error
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
          setAmount(firstData["subtitle"]);
          setSymbol(firstData["trans_symbol"]);
          setExpandAll(false);
          setLayout("tree");
          setGridData(() => {
            return [...[]];
          });
          if (isExpOrInc) {
            loadChartData(firstData.finance_account_head_id);
          }
        } else {
          setTreeData([]);
          setLayout("tree");
          setExpandAll(false);
          setGridData(() => {
            return [...[]];
          });
        }
      } else {
        setTreeData([]);
        setLayout("tree");
        setExpandAll(false);
        setGridData(() => {
          return [...[]];
        });
      }
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
        addNode(selectedNode, { treeData }, e).then(newTree => {
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

  const generateNodeProps = rowInfo => {
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
                setShowPopup(true);
                setNewAccount(true);
                setSelectedNode(rowInfo);
              }}
            >
              <i className="fas fa-plus"></i>
            </li>
            <li
              label="edit"
              className={
                "NodeEditButton " + (node.leafnode === "N" ? "disabled" : "")
              }
              onClick={() => {
                if (Object.keys(editorRecord).length > 0) {
                  setEditorRecord({});
                } else {
                  setEditorRecord(rowInfo);
                  if (node.leafnode === "Y") {
                    setShowPopup(true);
                    setNewAccount(false);
                  }
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
                (node.created_status === "S" ? "disabled" : "")
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
                        display: "Account deleted successfully"
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
              </AlgaehConfirm>
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
            {/* {isExpOrInc || node.leafnode !== "Y" ? (
              JSON.stringify(editorRecord) === JSON.stringify(rowInfo) ? (
                <Input
                  suffix={
                    <Icon
                      type="save"
                      onClick={e => {
                        const editedValue =
                          e.currentTarget.offsetParent.previousElementSibling
                            .value;

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
                              display: "Renamed successfully"
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
                  defaultValue={
                    node.title +
                    "/" +
                    node.arabic_child_name +
                    " (" +
                    node.ledger_code +
                    ")"
                  }
                />
              ) : (
                node.title + "/" + node.arabic_child_name
              )
            ) : (
              node.title +
              "/" +
              node.arabic_child_name +
              " (" +
              node.ledger_code +
              ")"
            )} */}
            {`${node.title} / ${node.arabic_account_name} (${node.ledger_code})`}
            {node.leafnode === "Y" ? null : (
              <>/{node.children === undefined ? 0 : node.children.length}</>
            )}
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
            {node.trans_symbol === undefined ? symbol : node.trans_symbol}
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
  };

  function loadChartData(finheadId) {
    if (isExpOrInc) {
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
  }

  function AccountChart() {
    if (isExpOrInc && !inDrawer) {
      return (
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">{`${title}`}</h3>
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
                  <h3 className="caption-subject">{`${title}`}</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <Charts data={[]} xAxis={""} yAxisBar={""} yAxisLine={""} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function expandAllNodes() {
    setTreeData(dtl => {
      return toggleExpandedForAll({
        treeData: dtl,
        expanded: !expandAll
      });
    });
    setExpandAll(expan => {
      return !expan;
    });
  }
  function layoutFlip() {
    setLoadingGridData(true);
    if (gridData.length === 0) {
      getGridChildNodes({ root_id: assetCode })
        .then(result => {
          setLoadingGridData(false);
          setGridData(() => {
            return [...result.ledgers];
          });
          setLayout(result => {
            return result === "tree" ? "grid" : "tree";
          });
        })
        .catch(error => {
          setLoadingGridData(false);
          setGridData([]);
          AlgaehMessagePop({ type: "error", display: error });
          setLayout(result => {
            return result === "tree" ? "grid" : "tree";
          });
        });
    } else {
      setLoadingGridData(false);
      setLayout(result => {
        return result === "tree" ? "grid" : "tree";
      });
    }
  }

  return (
    <div className="container-fluid assetsModuleScreen">
      {showPopup ? (
        <AddNewAccount
          showPopup={showPopup}
          selectedNode={editorRecord.node ? editorRecord : selectedNode}
          accountCode={assetCode}
          onClose={editorRecord.node ? onEditClose : onClose}
          accountName={editorRecord.node ? editorRecord.node.title : ""}
          ledgerCode={editorRecord.node ? editorRecord.node.ledger_code : ""}
          arabicName={
            editorRecord.node ? editorRecord.node.arabic_account_name : ""
          }
          propOnOK={editorRecord.node ? editChild : null}
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
      ) : null}
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
        {/* <AccountChart /> */}
        {/* <div className={isExpOrInc && !inDrawer ? "col-8" : "col-12"}> */}
        <div className={"col-12"}>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  {`${title} : ${amount}`}
                  {symbol}
                </h3>
              </div>
              <div className="actions">
                <button
                  className="btn btn-default btn-circle active"
                  onClick={layoutFlip}
                  title="Flip"
                >
                  {layout === "tree" ? (
                    <i className="fas fa-th"></i>
                  ) : (
                    <i className="fas fa-stream"></i>
                  )}
                </button>
                <button
                  className="btn btn-default btn-circle active"
                  onClick={expandAllNodes}
                  title="Expand/Collapsed"
                >
                  <i className="fas fa-arrows-alt"></i>
                </button>
                <button className="btn btn-default btn-circle active">
                  <i className="fas fa-print" />
                </button>
                <button
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    setSelectedNode({
                      node: {
                        finance_account_head_id: financeHeadId,
                        parent_acc_id: assetCode
                      }
                    });
                    setShowPopup(true);
                    setIsAccountHead(true);
                    setNewAccount(true);
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
                  {layout === "tree" ? (
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
                        generateNodeProps={generateNodeProps}
                        searchMethod={searchMethod}
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
                  ) : (
                    <div className="row">
                      {loadingGridData === true ? (
                        <p>Please wait loading</p>
                      ) : (
                        <div className="col-12">
                          {" "}
                          <AlgaehTable
                            className="accountTable"
                            columns={[
                              {
                                fieldName: "ledger_code",
                                lable: "Ledger Code"
                              },
                              { fieldName: "child_name", lable: "Ledger Name" },
                              {
                                fieldName: "arabic_child_name",
                                lable: "Ledger Arabic"
                              },
                              {
                                fieldName: "closing_balance",
                                lable: "Closing Balance"
                              }
                            ]}
                            data={gridData}
                            // hasFooter={true}
                            // isFiltable={true}
                            // aggregate={field => {
                            //   return total[field];
                            // }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TreeComponent);
