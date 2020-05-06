 import React, { Component, useEffect, useState } from "react";
// import "./OrgChart.scss";
import { EmployeeView, DepartmentView } from "../index";
// import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
// import { AlgaehTabs } from "algaeh-react-components";

import { newAlgaehApi } from "../../../hooks";
import {
  Upload,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehButton,
} from "algaeh-react-components";

import OrganizationChart from "../ChartContainer";

const DragDropChart = () => {
const[allBranches,setAllBranches]= useState([]);
const[reqDepts,setReqDepts] = useState([]);

 useEffect( function getBranchMaster() {
  newAlgaehApi({
      uri: "/branchMaster/getDepartmentsChart",
      method: "GET",
      module: "masterSettings"
  })
      .then(response => {
        if (response.data.success=== true) {
         
            setAllBranches(response.data.records) 
            
          }
        }) 
        .catch (response => {
          AlgaehMessagePop({
            title: response.data.records.message,
            type: "warning"
        })
         
        })
        .catch (error => {
          AlgaehMessagePop({
            title: error.message,
            type: "error"
        })
         
        })
      
      
    },[])
  
  
  

 useEffect(function getDeptForBranch(id) {
    
    newAlgaehApi({
      uri: "/branchMaster/getBranchWiseDepartments",
      method: "GET",
      module: "masterSettings",
      data: {
        hospital_id: 1
        
      }})
      .then(res => {
        if (res.data.success === true) {
          
            setReqDepts(res.data.records) 
          }
        else {
          AlgaehMessagePop({
            title: res.data.records.message,
            type: "warning"
          });
        }
        })
      
        .catch((error) => {
          AlgaehMessagePop({
            display: error,
            type: "error",
          });
    });
  },[]);
 
  
  const ds = { allBranches}
    // id: "n1",
    // name: "Lao Lao",
    // title: "general manager",
    // children: [
    //   { id: "n2", name: "Bo Miao", title: "department manager" },
    //   {
    //     id: "n3",
    //     name: "Su Miao",
    //     title: "department manager",
    //     children: [
    //       { id: "n4", name: "Tie Hua", title: "senior engineer" },
    //       {
    //         id: "n5",
    //         name: "Hei Hei",
    //         title: "senior engineer",
    //         children: [
    //           { id: "n6", name: "Dan Dan", title: "engineer" },
    //           { id: "n7", name: "Xiang Xiang", title: "engineer" }
    //         ]
    //       },
    //       { id: "n8", name: "Pang Pang", title: "senior engineer" }
    //     ]
    //   },
    //   { id: "n9", name: "Hong Miao", title: "department manager" },
    //   {
    //     id: "n10",
    //     name: "Chun Miao",
    //     title: "department manager",
    //     children: [{ id: "n11", name: "Yue Yue", title: "senior engineer" }]
    //   }
    // ]
   
  

  return <OrganizationChart datasource={ds} draggable={true} />;
};

export default DragDropChart;
