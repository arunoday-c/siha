import React, {useEffect, useState} from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import {
    AlgaehTreeDropDown,
    AlgaehValidator,
    AlgaehButton,TreeNodes
} from "algaeh-react-components";
import {getHeaders} from "./mapping.eventl";
// import 'react-dropdown-tree-select/dist/styles.css';
export default function (props) {

 const [assets,setAssets]= useState([]);
    const [lability,setLability]= useState([]);
    const [opControl,setOpControl]=  useState(undefined);
    const [opPatientDeposit,setOpPatientDeposit]=  useState(undefined);
  useEffect(()=>{
      getHeaders({finance_account_head_id:1})
          .then(result=>{
              if(result.length >0){
                  setAssets(result[0].children);
              }else{
                  setAssets([]);
              }
          }).catch(error=>{
            console.error(error);
      });
      getHeaders({finance_account_head_id:2})
          .then(result=>{
              if(result.length >0){
                  setLability(result[0].children);
              }else{
                  setLability([]);
              }
          }).catch(error=>{
          console.error(error);
      });
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
                      label={{ forceLabel: "OP CONTROL A/C",isImp:true}}
                 others={ {data:assets,
                     texts:{placeholder:"Please select account",
                         noMatches:"No records found",label:"Visa"},
                     mode:"radioSelect",
                  onChange :(currentNode, selectedNodes) => {
                      console.log('onChange::', currentNode, selectedNodes)
                  }}}
                  />


                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Deposit",isImp:true}}
                      value={opPatientDeposit}
                      others={ {data:lability,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
                          mode:"radioSelect",
                          onChange :(currentNode, selectedNodes) => {
                              console.log('onChange::', currentNode, selectedNodes)
                          }}}
                  />
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Receivable A/C",isImp:true}}
                      others={ {data:assets,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
                          mode:"radioSelect",
                          onChange :(currentNode, selectedNodes) => {
                              console.log('onChange::', currentNode, selectedNodes)
                          }}}
                  />
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
