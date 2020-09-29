import React, { useContext } from "react";
import { AlgaehModal, Button, MainContext } from "algaeh-react-components";

export function PromoAddModal({ visible, onClose }) {
  const { userLanguage } = useContext(MainContext);

  return (
    <AlgaehModal
      title={"Add"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <Button className="btn btn-default" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={720}
      // footer={null}
      className={`${userLanguage}_comp row algaehNewModal`}
      // class={this.state.lang_sets}
    >
      <div className="popupInner"></div>
    </AlgaehModal>
  );
}
