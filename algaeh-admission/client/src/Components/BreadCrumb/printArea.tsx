import React from "react";
export default React.memo(function PrintArea(props: any) {
  const { attachments, editData, printArea } = props;
  return (
    <div className="col print-area">
      <div>
        <ul>
          <Attachments attachments={attachments} />
          <EditData editData={editData} />
          <Print printArea={printArea} />
        </ul>
      </div>
    </div>
  );
});

function Attachments(props: any) {
  const { attachments } = props;
  if (!attachments) {
    return null;
  }
  return (
    <li onClick={() => attachments?.onClick()}>
      <i className="fas fa-paperclip bredcrumpIconBig" />
    </li>
  );
}
function EditData(props: any) {
  const { editData } = props;
  if (!editData) {
    return null;
  }
  return (
    <li onClick={() => editData?.onClick()}>
      <i className="fas fa-paperclip bredcrumpIconBig" />
    </li>
  );
}

function Print(props: any) {
  const { printArea } = props;
  if (!printArea) {
    return null;
  }
  return (
    <li className="printMenuDisplay">
      <i className="fas fa-print bredcrumpIconBig" />
      {printArea?.menuItems ? (
        <div className="dropdown-menu animated fadeIn faster">
          {printArea.menuItems.map((menu: any, index: number) => {
            return (
              <a className="dropdown-item" key={index} {...menu.events}>
                <span>{menu.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </li>
  );
}
