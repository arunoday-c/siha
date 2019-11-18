import React, {useEffect, useState} from "react";
import {
    AlgaehTreeDropDown,
    AlgaehValidator,
    AlgaehButton,
    AlgaehMessagePop
} from "algaeh-react-components";
import {getHeaders,updateFinanceAccountsMaping,getFinanceAccountsMaping} from "./mapping.eventl";
export default function (props) {

    const [assets,setAssets]= useState([]);
    const [lability,setLability]= useState([]);
    //Its as object to send header and child id.
    const [opControl,setOpControl]=  useState({});
    const [opControlLabel,setOpControlLable]=  useState("");
    //Its as object to send header and child id.
    const [opPatientDeposit,setOpPatientDeposit]=  useState({});
    const [opDepositLabel,setOPDepositLable]=useState("");
    //Its as object to send header and child id.
    const [opReceviable,setOPReceviable] = useState({});
    const [opReceviableLable,setOPReceviableLable]=useState("");
    //Its as object to send header and child id.
    const [opCashInHand,setOPCashInHand]=  useState({});
    const [opCashInHandLabel,setopCashInHandLable]=useState("");

  useEffect(()=>{
      getHeaders({finance_account_head_id:1})
          .then(result=>{
              if(result.length >0){
                  setAssets(result[0].children);
              }else{
                  setAssets([]);
              }
          }).catch(error=>{

          AlgaehMessagePop({type:"error",display:error});
      });
      getHeaders({finance_account_head_id:2})
          .then(result=>{
              if(result.length >0){
                  setLability(result[0].children);
              }else{
                  setLability([]);
              }
          }).catch(error=>{
          AlgaehMessagePop({type:"error",display:error});
      });
      getFinanceAccountsMaping().then(result=>{
          if(Array.isArray(result)){
            const opCon=  result.find(f=>f.account ==="OP_CON");
            if(opCon !==undefined){
                setOpControl(opCon);
                setOpControlLable(opCon.child_name);
            }
              const opDep=  result.find(f=>f.account ==="OP_DEP");
              if(opDep !==undefined){
                  setOpPatientDeposit(opDep);
                  setOPDepositLable(opDep.child_name);
              }

              const opRec=  result.find(f=>f.account ==="OP_REC");
              if(opRec !==undefined){
                  setOPReceviable(opRec);
                  setOPReceviableLable(opRec.child_name);
              }
              const cashInHand=  result.find(f=>f.account ==="CH_IN_HA");
              if(cashInHand !==undefined){
                  setOPCashInHand(cashInHand);
                  setopCashInHandLable(cashInHand.child_name);
              }
          }
      }).catch(error=>{
          AlgaehMessagePop({type:"error",display:error});
      })
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
              <AlgaehValidator
              onSubmit={()=>{
                  updateFinanceAccountsMaping([opControl,opPatientDeposit,opReceviable,opCashInHand])
                      .then(()=>{
                          AlgaehMessagePop({type:"success",display:"Updated successfully"});
                      }).catch(error=>{
                      AlgaehMessagePop({type:"error",display:JSON.stringify(error)});
                  });
              }}
              >
              <div className="row">
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP CONTROL A/C",isImp:true,align:"ltr"}}
                      value={opControlLabel}
                      onChange ={(currentNode, selectedNodes) => {
                          setOpControl({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id,account:"OP_CON"});
                          setOpControlLable(currentNode.label);
                  }}
                 others={ {data:assets,
                     texts:{placeholder:"Please select account",
                         noMatches:"No records found",label:"Visa"},
                     mode:"radioSelect"
                  }}
                  />


                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Deposit",isImp:true,align:"ltr"}}
                      value={opDepositLabel}
                      onChange ={(currentNode, selectedNodes) => {
                          setOpPatientDeposit({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id,account:"OP_DEP"});
                          setOPDepositLable(currentNode.label);
                      }}
                      others={ {data:lability,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
                          mode:"radioSelect",

                      }}
                  />
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Receivable A/C",isImp:true,align:"ltr"}}
                      value={opReceviableLable}
                      onChange ={(currentNode, selectedNodes) => {
                          setOPReceviable({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id,account:"OP_REC"});
                          setOPReceviableLable(currentNode.label);
                      }}
                      others={ {data:assets,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
                          mode:"radioSelect"
                      }}
                  />
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "Cash In Hand A/C",isImp:true,align:"ltr"}}
                      value={opCashInHandLabel}
                      onChange ={(currentNode, selectedNodes) => {
                          setOPCashInHand({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id,account:"CH_IN_HA"});
                          setopCashInHandLable(currentNode.label);
                      }}
                      others={ {data:assets,
                          texts:{placeholder:"Please select account",
                              noMatches:"No records found",label:"Visa"},
                          mode:"radioSelect"
                      }}
                  />
                  <AlgaehButton htmlType="submit" className="btn btn-primary"  > MAP/UPDATE </AlgaehButton>
              </div>
              </AlgaehValidator>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
