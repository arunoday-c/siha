import React, { memo } from "react";
import DisplayComponent from "./DisplayComponent";

export default memo(function BatchDetails({ batch_list, deleteState }) {
  return (
    <div className="row">
      <div className="col-12">
        <ul className="reqTransList">
          {batch_list.map((item) => {
            return (
              <DisplayComponent
                key={item.id_number}
                item={item}
                deleteState={deleteState}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
});
