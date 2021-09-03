import React from "react";
import SportLightSearch from "./sportLightSearch";
import UserArea from "./userArea";
import Attachments from "./printArea";
export default React.memo(function BreadCrumb(props: any) {
  const {
    title,
    pageNavPath,
    spotlightSearch,
    userArea,
    attachments,
    editData,
    printArea,
  } = props;
  return (
    <div className="fixed-top breadcrumb-fixed">
      <div className="breadCrumb-Data row">
        <div className="col-2 text hdg_bredcrump">
          <h5 className="header">{title}</h5>
          <ul>
            {pageNavPath?.map((row: any, index: number) => {
              return (
                <>
                  <li key={index}>{row.pageName}</li>
                  {pageNavPath.length - 1 === index ? null : (
                    <li>&nbsp;/&nbsp; </li>
                  )}
                </>
              );
            })}
          </ul>
        </div>
        {spotlightSearch ? (
          <SportLightSearch spotlightSearch={spotlightSearch} />
        ) : null}
        <UserArea userArea={userArea} />
        <Attachments
          attachments={attachments}
          editData={editData}
          printArea={printArea}
        />
      </div>
    </div>
  );
});
