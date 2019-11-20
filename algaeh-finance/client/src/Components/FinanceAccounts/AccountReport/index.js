import React,{memo} from "react";
import {AlgaehModal,AlgaehDateHandler} from "algaeh-react-components"
export default  memo( function Modal(props){
   const{branches,title,onCancel,visible} = props;
   return (<AlgaehModal
       title={title}
       onCancel={onCancel}
       visible={visible}
       >
       <div>
<AlgaehDateHandler div={{className:"col-lg-3"}}  type="range"
                   textBox={{
                       name: "selectRange",
                       value: new Date()
                   }}
                   events={{
                       onChange: e => {
                           console.log("Text", e);
                       }
                   }}
/>
       </div>
   </AlgaehModal>)
});
