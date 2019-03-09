import React from "react";
import {
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../../Wrapper/algaehWrapper";

function MonthlyDetail(props) {
  return (
    <AlgaehModalPopUp
      openPopup={props.open}
      events={{
        onClose: props.onClose
      }}
    >
      Popup Bantai
      {/* <AlgaehDataGrid 
   id="monthlyDetailGrid"
columns= {[
]}
dataSource={{
    data: props.data
  }}
  filter={true}
  paging={{ page: 0, rowsPerPage: 20 }}
/> */}
    </AlgaehModalPopUp>
  );
}

export default MonthlyDetail;
