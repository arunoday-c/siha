import React, {useState, useContext, useEffect} from "react";
import SortableTree from "react-sortable-tree";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import {AlgaehMessagePop} from "algaeh-react-components";
// import {TreeContext} from "../Assets/Assets"
export default  function (props){
    const {canDrag,generateNodeProps,accountLevel,treeData,onChange}=props;
    const [filter,setFilter]= useState({
        searchQuery:"",
        searchFocusIndex:0,
        searchFoundCount:undefined
    });
// const {setTreeDataState}=useContext(TreeContext);

    const draggable= typeof canDrag ==="function"?{canDrag:(rowInfo)=>{ return canDrag(rowInfo) }}:{};
// useEffect(()=>{
//     algaehApiCall({
//         uri: "/finance/getAccountHeads",
//         data: { account_level: accountLevel,finance_account_head_id:(accountLevel+1)},
//         method: "GET",
//         module: "finance",
//         onSuccess: response => {
//             if (response.data.success === true) {
//                 const data =response.data.result;
//                 debugger;
//                 if(Array.isArray(data)){
//                     if(data.length >0){
//                         setTreeDataState(data[0].children)
//                     }else{
//                         setTreeDataState([]);
//                     }
//                 }else{
//                     setTreeDataState([]);
//                 }
//             }else{
//                 setTreeDataState([]);
//             }
//         },
//         onFailure: error => {
//             AlgaehMessagePop({
//                 type:"error",
//                 display: error.response.data.message || error.message
//             });
//         }
//     });
//
// },[]);
console.log("treeData",treeData);
    return ( <div>
        {/*For tool bar*/}
        {/*<div>*/}
        {/*    <input type="text" placeholder="Search" value={filter.searchQuery}*/}
        {/*           onChange={(e)=>{*/}
        {/*               const newFilter ={...filter,...{searchQuery:e.target.value}}*/}
        {/*               setFilter(newFilter);*/}
        {/*           }} />*/}
        {/*    <button onClick={()=>{*/}
        {/*        const values=filter.searchFocusIndex !==undefined ?(filter.searchFoundCount + filter.searchFocusIndex - 1) % filter.searchFoundCount:filter.searchFoundCount - 1;*/}
        {/*        filter.setSearchFocusIndex(values )*/}
        {/*    }} >  &lt; </button>*/}
        {/*    <button onClick={()=>{*/}
        {/*        const values=filter.searchFocusIndex !== undefined ?(filter.searchFocusIndex + 1) % filter.searchFoundCount:0;*/}
        {/*        filter.setSearchFocusIndex(values);*/}
        {/*    }}>  &gt; </button>*/}
        {/*    <label>{filter.searchFoundCount >0 ?filter.searchFocusIndex+1:0} / {filter.searchFoundCount || 0} </label>*/}
        {/*</div>*/}
        <SortableTree
        treeData={treeData}
        onChange={(data)=>{
            console.log("data",data);
            onChange(data);
        }}
        isVirtualized={true}
        {...draggable}
        searchMethod={({node, searchQuery})=>{
            return  searchQuery &&
                node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
        }}
        searchQuery={filter.searchQuery}
        searchFocusOffset={filter.searchFocusIndex}
        generateNodeProps={(rowInfo)=>{
            return generateNodeProps(rowInfo);
        }}
        searchFinishCallback={matches=>{
            const newfilter={...filter,...{searchFocusIndex:(matches.length > 0 ? filter.searchFocusIndex % matches.length : 0),
            searchFoundCount:matches.length}};
            setFilter(newfilter);
        }}
    /></div>)

}