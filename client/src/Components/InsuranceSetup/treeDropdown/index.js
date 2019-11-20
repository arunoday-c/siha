import React,{memo,useState} from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import {
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import "react-dropdown-tree-select/dist/styles.css";
import "../../HospitalServiceSetup/accountsDropdown/treeDropdownAlgaeh.scss";
function AccountDropDown(props){
    const [textAreaVisable, setTextAreaVisable] = useState("1");
    const {value,others,onChange} = props;
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
    return(<div className="treeInputCntr">
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
            {...{others, mode: "radioSelect"}}
        />
    </div>)
}