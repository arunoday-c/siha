import React  from "react";
import ReactDOM from "react-dom";
import { Modal } from "semantic-ui-react";
// const modalRoot = document.getElementById("algaeh_model_Popup");
export default function AlgaehModalPopUp(props)  {
  const {openPopup, title, children} = props
  return(
    <Modal open={openPopup} title={title}>{children}</Modal>
  );

}
