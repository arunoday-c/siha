import React, { useState } from "react";

export default function (props) {
  const [organisation, setOrganisation] = useState({});
  const { organization_name } = organisation;
  return (
    <div className="portlet portlet-bordered margin-bottom-15">
      <div className="portlet-title">
        <div className="caption">
          <h3 className="caption-subject">Organisation</h3>
        </div>
        <div className="actions">
          <div className="ui input">
            <input
              type="text"
              name="organization_name"
              defaultValue={organization_name}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}
