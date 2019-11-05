
import React, { useState, useEffect } from "react";
import "./assets.scss";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import { getAccounts } from ".././FinanceAccountEvent";
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import swal from "sweetalert2";

export default function Assets() {
  const [node_id, settreeIndex] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  const [selectHead, setSelectHead] = useState(false);
const[searchQuery,setSearchQuery] = useState("");
const [searchFocusIndex,setSearchFocusIndex] = useState(0);
const [searchFoundCount,setSearchFoundCount]=useState(undefined);

  useEffect(() => {
    if (treeData.length === 0) {
      getAccounts("1", data => {
        if(Array.isArray(data)){
          if(data.length >0){
            setTreeData(data[0].children);
          }
        }else{
          setTreeData([]);
        }

      });
    }
  }, []);

  function addNode(rowInfo, options, addedNode) {
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
          setShowPopup(false);
          if (e !== undefined) {
            addNode(selectedNode, { treeData }, e).then(newTree => {
              setTreeData(newTree.treeData);
            });
          }
        }}
      />
      <div className="row">
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Asset accounts</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body"></div>
          </div>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Asset accounts</h3>
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
                <h3 className="caption-subject">Asset accounts</h3>
              </div>
              <div className="actions">
                <button className="btn btn-default btn-circle active">
                  <i className="fas fa-print" />
                </button>
                <button className="btn btn-default btn-circle active">
                  <i className="fas fa-search" />
                </button>{" "}
                <button className="btn btn-primary btn-circle active">
                  <i className="fas fa-plus" />
                </button>{" "}
              </div>
              <div>
                <input type="text" placeholder="Search" value={searchQuery}
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
                      searchMethod={({node, searchQuery})=>{
                      return  searchQuery &&
                        node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
                      }}
                      searchQuery={searchQuery}
                      searchFocusOffset={searchFocusIndex}
                      generateNodeProps={rowInfo => {
                       const {node}=rowInfo;
                        return {
                          buttons: [
                            <div className="box">
                              <ul className="NodeActionButton">
                                {rowInfo.node.created_status === "U" ? (<li className="NodeDeleteButton" label="Delete"
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
                                    }}>
                                  Remove</li>) : null}
                              {rowInfo.node.leafnode === "N" ? (<li
                                  label="Add"
                                  className="NodeAddButton"
                                  onClick={event => {
                                    setSelectHead(false);
                                    setShowPopup(true);
                                    setSelectedNode(rowInfo);
                                  }} >
                                  Add</li>) : null}
                              </ul>
                            </div>
                          ],
                          style: {
                            height: "50px"
                          },
                          title:(<><strong>{node.title}</strong> {node.leafnode ==="Y"?null:<small> / {node.children ===undefined ?0: node.children.length}</small>} </>),
                          subtitle:(<div style={{"fontSize": "medium",
                           "marginTop": "7px"}}>{node.subtitle}</div>)
                        };
                      }}
                      searchFinishCallback={matches=>{
                        setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
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
