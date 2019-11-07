import React, { useState, useEffect } from "react";
import SortableTree, {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import AddNewAccount from "../AddNewAccount/AddNewAccount";
import "./liablity.scss";
import { getAccounts,removeAccount } from ".././FinanceAccountEvent";
import swal from "sweetalert2";
import {AlgaehConfirm, AlgaehMessagePop} from "algaeh-react-components";

export default function Liablity() {
  const [treeData, setTreeData] = useState([]);
  const [labilityAmount,setLabilityAmount]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState({});
  // const [selectHead, setSelectHead] = useState(false);

  useEffect(() => {

      getAccounts("2", data => {
      if(Array.isArray(data)){
        if(data.length >0){
          setTreeData(data[0]["children"]);
          setLabilityAmount(data[0]["subtitle"]);
        }else{
          setTreeData([]);
        }
      }else{
        setTreeData([]);
      }});

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

  function removeNode(rowInfo, options) {
    return new Promise((resolve, reject) => {
      try {
        const { treeData } = options;
        let { node,  path } = rowInfo;
        const  {head_id,finance_account_child_id}=node;
        removeAccount({ head_id: head_id,child_id:finance_account_child_id})
            .then(()=>{
              const removeNodeData = removeNodeAtPath({
                treeData: treeData,
                path: path,
                getNodeKey: ({  treeIndex }) => treeIndex,
              });
              resolve(removeNodeData);
            }).catch(error=>{
              debugger;
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
          if (e !== undefined) {
            addNode(selectedNode, { treeData }, e).then(newTree => {
              debugger;
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
                    // setSelectHead(true);
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
                        const {node}=rowInfo;
                        return {
                          buttons: [
                            <div className="box">
                              <ul className="NodeActionButton">

                                {node.created_status === "U" ?(<li className="NodeDeleteButton" label="Delete"

                                >
                                  <AlgaehConfirm title="Are you sure want to delete ?"
                                                 placement="topLeft"
                                                 onConfirm={(e)=>{

                                                   removeNode(rowInfo)
                                                       .then(newTree=>{
                                                         setTreeData(newTree);
                                                         AlgaehMessagePop({
                                                           type:"success",
                                                           display:"Account deleted successfully"
                                                         });
                                                       }).catch(error=>{
                                                         debugger;
                                                     AlgaehMessagePop({
                                                       type:"error",
                                                       display: error
                                                     });
                                                   })
                                                 }}
                                                 okButtonProps={{label:"Delete"}}
                                                 disabled={node.children !==undefined && node.children.length > 0?true:false}
                                                 okText="Yes, delete it!"
                                                 cancelText="No"
                                  > Remove </AlgaehConfirm> </li>) : null}
                                {node.leafnode === "N" ? (<li
                                    label="Add"
                                    className="NodeAddButton"
                                    onClick={event => {

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
