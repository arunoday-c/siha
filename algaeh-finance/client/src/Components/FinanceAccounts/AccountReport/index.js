import React,{memo,useState} from "react";
import {AlgaehModal,AlgaehDateHandler,Spin,Switch} from "algaeh-react-components";
import moment from "moment";
export default  memo( function Modal(props){
   const{selectedNode,title,onCancel,visible,onOk} = props;
   const[checkedType,setCheckType]= useState(false);
   const [dateRange,setDateRange]= useState([]);
   const[loading,setLoading] = useState(false);

   return (<AlgaehModal
       title={title}
       onCancel={(e)=>{
           setLoading(false);
           onCancel(e)}}
       onOk={(e)=>{
           setLoading(true);
           onOk(e);
       }}
       okButtonProps={{
           loading:loading
       }}
       visible={visible}
       maskClosable={false}
       closable={false}
       destroyOnClose={true}
       afterClose={()=>{
           setLoading(false);
       }}
       >
       <Spin tip="Please wait report is preparing.." spinning={loading}>
<AlgaehDateHandler  type="range"
                    div={{
                        className: "col"
                    }}
                    label={{
                        forceLabel:"Select Date Range"
                    }}
                   textBox={{
                       name: "selectRange",
                       value:dateRange
                   }}
                    maxDate={ moment()}
                   events={{
                       onChange: dateSelected => {
                           setDateRange(dateSelected);
                       }
                   }}
/>
<div className="col">
    <Switch checkedChildren="Month wise" unCheckedChildren="Date Wise"
            onChange={check=>{
                setCheckType(check);
            }}  checked={checkedType} />
</div>

       </Spin>
   </AlgaehModal>)
});
