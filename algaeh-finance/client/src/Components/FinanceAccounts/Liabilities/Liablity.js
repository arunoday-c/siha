import React, { useState, useEffect } from "react";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import "../Assets/assets.scss";
import {getAccounts, isPositive, removeAccount} from ".././FinanceAccountEvent";

import {AlgaehConfirm, AlgaehMessagePop} from "algaeh-react-components";

export default function Liablity() {
  const [symbol, setSymbol] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [labilityAmount,setLabilityAmount]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const[searchQuery,setSearchQuery] = useState("");
  const [searchFocusIndex,setSearchFocusIndex] = useState(0);
  const [searchFoundCount,setSearchFoundCount]=useState(undefined);
  const [isAccountHead,setIsAccountHead]= useState(false);
  const [financeHeadId,setFinanceHeadId] = useState(undefined);
  function loadAccount(){
    getAccounts("2", data => {
      if(Array.isArray(data)){
        if(data.length >0){
          setFinanceHeadId(data[0].finance_account_head_id);
          setTreeData(data[0]["children"]);
          setLabilityAmount(data[0]["subtitle"]);
          setSymbol(data[0]["trans_symbol"]);
        }else{
          setTreeData([]);
        }
      }else{
        setTreeData([]);
      }});
  }

  useEffect(() => {
    loadAccount();
  }, []);

  function addNode(rowInfo, options, addedNode) {
    return new Promise((resolve, reject) => {
      try {
        const { treeData } = options;
        let {  path } = rowInfo;
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
        let { node,  path } = rowInfo;
        const  {head_id,finance_account_child_id,leafnode,finance_account_head_id}=node;
        removeAccount({ head_id: leafnode ==="N"?finance_account_head_id: head_id,child_id:finance_account_child_id,leaf_node:leafnode})
            .then(()=>{
              const removeNodeData = removeNodeAtPath({
                treeData: treeData,
                path: path,
                getNodeKey: ({  treeIndex }) => treeIndex,
              });
              resolve(removeNodeData);
            }).catch(error=>{

          reject(error);
        });

      } catch (e) {
        reject(e);
      }
    });
  }
  return (
    <div className="container-fluid liablityModuleScreen">
      <AddNewAccount
        showPopup={showPopup}
        selectedNode={selectedNode}
        onClose={e => {
          setShowPopup(false);
          if(isAccountHead){
            loadAccount();
            setIsAccountHead(false);
          }else{
            if (e !== undefined) {
              addNode(selectedNode, { treeData }, e).then(newTree => {
                setTreeData(newTree.treeData);
                setIsAccountHead(false);
              });
            }
          }

        }}
      />

      <div className="row">
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Liability accounts</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body"></div>
          </div>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Liability accounts</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body"></div>
          </div>
        </div>
        <div className="col-8">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Liability accounts <small>{labilityAmount}</small> </h3>
              </div>
              <div className="actions">
                <button
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    setSelectedNode({node:{finance_account_head_id:financeHeadId}});
                    setShowPopup(true);
                    setIsAccountHead(true);
                  }}
                >
                  <i className="fas fa-plus" />
                </button>
              </div>
              <div className="searchCntr">
                <input type="text" placeholder="Search Account Heads" value={searchQuery}
                       onChange={(e)=>{
                         setSearchQuery(e.target.value);
                       }} />
                <button onClick={()=>{
                  const values=searchFocusIndex !==undefined ?(searchFoundCount + searchFocusIndex - 1) % searchFoundCount:searchFoundCount - 1;
                  setSearchFocusIndex(values )
                }} >  &lt; </button>
                <button onClick={()=>{
                  const values=searchFocusIndex !== undefined ?(searchFocusIndex + 1) % searchFoundCount:0;
                  setSearchFocusIndex(values);
                }}>  &gt; </button>
                <label>{searchFoundCount >0 ?searchFocusIndex+1:0} / {searchFoundCount || 0} </label>
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
                                    className={"NodeAddButton "+(node.leafnode==="Y"?"disabled":"")}
                                    onClick={event => {
                                      setShowPopup(true);
                                      setSelectedNode(rowInfo);
                                    }}
                                >
                                  Add
                                </li>
                                <li
                                    className={"NodeDeleteButton "+(node.created_status ==="S"?"disabled":"")}
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
                                      // disabled={node.children !==undefined && node.children.length > 0?true:false}
                                      okText="Yes, delete it!"
                                      cancelText="No"
                                  >
                                    {" "}
                                    Remove{" "}
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
                                {node.title} {" "}
                                {node.leafnode === "Y" ? null : (
                                    <>/
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
                              <span className={node.subtitle !==undefined? isPositive(node.subtitle):""}>
                                {node.subtitle === undefined ?"0.00": node.subtitle}
                              </span>{" "}
                                <small>{node.trans_symbol === undefined?symbol:node.trans_symbol}</small>
                              </div>
                          )
                        };
                      }}
                      searchMethod={({node, searchQuery})=>{
                        return  searchQuery &&
                            node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
                      }}
                      searchQuery={searchQuery}
                      searchFocusOffset={searchFocusIndex}
                      searchFinishCallback={matches=>{
                        setSearchFocusIndex (matches.length > 0 ? searchFocusIndex % matches.length : 0);
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
