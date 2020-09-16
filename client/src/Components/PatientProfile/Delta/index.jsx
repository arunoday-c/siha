import React from "react";
import { AlgaehModal } from "algaeh-react-components";

export default function Delta({ visible, onCancel }) {
  return (
    <AlgaehModal
      title="Delta"
      visible={visible}
      maskClosable={false}
      width={540}
      closable={true}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      onCancel={onCancel}
      // onOk={handleSubmit(onSubmit)}
      className={` row algaehNewModal UpdateStatementModal`}
    >
      <div className="row">
        <div className="col-12"></div>
      </div>
    </AlgaehModal>
  );
}
