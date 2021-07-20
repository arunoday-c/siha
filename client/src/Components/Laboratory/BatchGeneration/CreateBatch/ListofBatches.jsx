import React, { memo } from "react";
import "./CreateBatch.scss";

import DisplayComponent from "./DisplayComponent";

export default memo(function BatchDetails({ batch_list, deleteState }) {
  return (
    <div className="col-12">
      <div className="CreateBatchList">
        <ul>
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
