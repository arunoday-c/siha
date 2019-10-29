import React,{memo} from "react";
import {TreeNode} from "algaeh-react-components";
export default memo(function(props){
    const {data} = props;
    return(<>{data.map((item)=>(<TreeNode> NO DATA </TreeNode>))}</>)
});