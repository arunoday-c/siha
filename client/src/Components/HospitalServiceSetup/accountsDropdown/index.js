import React,{memo,useState,useEffect} from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import {
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import {getHeaders} from "../accountsDropdown/events";
import "react-dropdown-tree-select/dist/styles.css";
import "./treeDropdownAlgaeh.scss";
function AccountsDropDown(props){
    const {value, others,onChange,labelText,accountHeadeId} = props;
    const [textAreaVisable, setTextAreaVisable] = useState("1");
    const [data,setData] = useState([]);
    const { texts } = others;
    const placeHolder =
        texts !== undefined
            ? {
                placeholder:
                    texts.placeholder !== undefined
                        ? texts.placeholder
                        : "Please select"
            }
            : {};
    useEffect(()=>{
        getHeaders({finance_account_head_id:accountHeadeId})
            .then(result=>{
                if(result.length >0){
                    setData(result[0].children);
                }else{
                    setData([]);
                }
            }).catch(error=>{
console.error(error);

        });
    },[]);
    return (<div className="col-6 form-group" >
        <AlgaehLabel
            label={{ forceLabel: labelText  }}
        />
        <div className="treeInputCntr">
            <input
                type="text"
                className="viewText"
                value={value}
                readOnly={true}
                style={{ zIndex: textAreaVisable }}
                onClick={e => {
                    setTextAreaVisable("0");
                    e.target.nextSibling.querySelector("a").click();
                }}
                {...placeHolder}
            />
            <DropdownTreeSelect
                onFocus={() => {
                    setTextAreaVisable("0");
                }}
                onBlur={() => {
                    setTextAreaVisable("1");
                }}
                onChange={(currentNode, selectedNodes) => {
                    setTextAreaVisable("1");
                    if (typeof onChange === "function") {
                        onChange(currentNode, selectedNodes);
                    }
                }}
                {...{others,data:data, mode: "radioSelect"}}
            />
        </div>
    </div>)
}
export default  memo(AccountsDropDown);