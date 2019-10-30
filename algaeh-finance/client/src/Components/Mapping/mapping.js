import React, {useEffect, useState} from "react";
import {
    AlgaehTreeDropDown,
    AlgaehValidator,
    AlgaehButton,
    AlgaehMessagePop
} from "algaeh-react-components";
import {getHeaders,updateFinanceAccountsMaping} from "./mapping.eventl";
export default function (props) {

 const [assets,setAssets]= useState([]);
    const [lability,setLability]= useState([]);
    //Its as object to send header and child id.
    const [opControl,setOpControl]=  useState({});
    const [opControlLabel,setOpControlLable]=  useState(undefined);
    //Its as object to send header and child id.
    const [opPatientDeposit,setOpPatientDeposit]=  useState({});
    const [opDepositLabel,setOPDepositLable]=useState(undefined);
    //Its as object to send header and child id.
    const [opReceviable,setOPReceviable] = useState({});
    const [opReceviableLable,setOPReceviableLable]=useState(undefined);

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
              <AlgaehValidator mode="single"
              onSubmit={()=>{
                  updateFinanceAccountsMaping({opControl,opPatientDeposit,opReceviable})
                      .then(result=>{
                          AlgaehMessagePop({type:"success",title:"Success"});
                      }).catch(error=>{
                      AlgaehMessagePop({type:"error",title:JSON.stringify(error)});
                  });
              }}
              >
              <div className="row">
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP CONTROL A/C",isImp:true}}
                      value={opControlLabel}
                      onChange ={(currentNode, selectedNodes) => {
                          setOpControl({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id});
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
                      label={{ forceLabel: "OP Patient Deposit",isImp:true}}
                      value={opDepositLabel}
                      onChange ={(currentNode, selectedNodes) => {
                          setOpPatientDeposit({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id});
                          setOPDepositLable(currentNode.label);
                      }}
                      others={ {data:lability,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
                          mode:"radioSelect",

                      }}
                  />
                  <AlgaehTreeDropDown
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "OP Patient Receivable A/C",isImp:true}}
                      value={opReceviableLable}
                      onChange ={(currentNode, selectedNodes) => {
                          setOPReceviable({head_id:currentNode.head_id,child_id:currentNode.finance_account_child_id});
                          setOPReceviableLable(currentNode.label);
                      }}
                      others={ {data:assets,
                          texts:{placeholder:"Please select account",noMatches:"No records found"},
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
