import React, {useEffect, useState} from "react";
import {
    AlgaehTreeDropDown,
    AlgaehValidator,
    AlgaehButton
} from "algaeh-react-components";
import TreeNodes from "./template";
export default function (props) {
 const [opControl,setOpControl]=  useState(undefined);
    const [opPatientDeposit,setOpPatientDeposit]=  useState(undefined)
  useEffect(()=>{

  },[]);
  return (
    <div className="FinanceMappingScreen">
      <div className="row margin-top-15 margin-bottom-15">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">OP Billing</h3>
              </div>
            </div>
            <div className="portlet-body">
              <AlgaehValidator mode="single" >
              <div className="row">
                <AlgaehTreeDropDown
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "OP Control A/c",isImp:true}}
                    treeDefaultExpandAll={true}
                    value={opControl}
                >
                 <TreeNodes data={[]} />
                  {/*<TreeNode value="parent 1" title="parent 1" key="0-1">*/}
                  {/*  <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">*/}
                  {/*    <TreeNode value="leaf1" title="my leaf" key="random" />*/}
                  {/*    <TreeNode value="leaf2" title="your leaf" key="random1" />*/}
                  {/*  </TreeNode>*/}
                  {/*  <TreeNode*/}
                  {/*    value="parent 1-1"*/}
                  {/*    title="parent 1-1"*/}
                  {/*    key="random2"*/}
                  {/*  >*/}
                  {/*    <TreeNode*/}
                  {/*      value="sss"*/}
                  {/*      title={<b style={{ color: "#08c" }}>sss</b>}*/}
                  {/*      key="random3"*/}
                  {/*    />*/}
                  {/*  </TreeNode>*/}
                  {/*</TreeNode>*/}
                </AlgaehTreeDropDown>
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Deposit",isImp:true}}
                      treeDefaultExpandAll={true}
                      value={opPatientDeposit}
                  >
                      <TreeNodes data={[]} />
                  </AlgaehTreeDropDown>
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Receivable A/C",isImp:true}}
                      treeDefaultExpandAll={true}
                      value={opPatientDeposit}
                  >
                      <TreeNodes data={[]} />
                  </AlgaehTreeDropDown>
                  <AlgaehButton htmlType="submit" className="btn btn-primary"> MAP/UPDATE </AlgaehButton>
              </div>
              </AlgaehValidator>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
