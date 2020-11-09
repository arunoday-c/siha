import React from "react";
import {
  AlgaehModal,
  Spin,
} from "algaeh-react-components";

import "./AllReportsModal.scss";
// import _ from "lodash";
// import AlgaehLoader from "../../Wrapper/fullPageLoader";

export default function AllReports() {


  return (
    <AlgaehModal
      title="All Reports"
      // visible={visible}
      maskClosable={false}
      width={540}
      closable={true}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      // onCancel={onCancel}
      // onOk={handleSubmit(onSubmit)}
      className={`algaehNewModal AllReportsModal`}
    >
      <Spin
        // spinning={
        //   anLoading || vLoading || inLoading || pvLoading || testLoading
        // }
      >
        <div className="row popupInner">
         sdjfhgjasdgfkjhsgf
        </div>
      </Spin>
    </AlgaehModal>
  );
}
