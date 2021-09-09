import React from "react";
import { AlgaehModal } from "algaeh-react-components";
import BedManagement from "../BedManagement/index";
interface Props {
  visible: boolean;
  onClose: any;
}

function BedSelectionModal(props: Props) {
  const { visible, onClose } = props;

  return (
    <AlgaehModal
      title="Select Bed"
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <button onClick={onClose} className="btn btn-default">
          Close
        </button>,
      ]}
      className={`row algaehNewModal SelectBedModal`}
    >
      {visible ? <BedManagement /> : null}
    </AlgaehModal>
  );
}

export default BedSelectionModal;
