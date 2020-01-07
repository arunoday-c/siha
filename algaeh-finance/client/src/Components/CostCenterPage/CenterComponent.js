import React, { memo } from "react";
import "./costcenter.scss";
import { AlgaehDataGrid } from "algaeh-react-components";

export default memo(function CenterComponent({ data }) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Cost Center</h3>
              </div>{" "}
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "cost_center_id",
                    title: "Center ID",
                    sortable: true,
                    filtered: false
                  },
                  {
                    key: "hospital_name",
                    title: "Branch",
                    filtered: true,
                    align: "left",
                    editorTemplate: (text, records) => {
                      return (
                        <input
                          type="text"
                          value={text}
                          onChange={e => {
                            console.log("text", text);
                            console.log("records", records);
                            records["title"] = "Hello";
                          }}
                        />
                      );
                    }
                  },
                  {
                    key: "cost_center",
                    title: "Cost Center",
                    filtered: true,
                    align: "left",
                    editorTemplate: (text, records) => {
                      return (
                        <input
                          type="number"
                          value={text}
                          onChange={e => {
                            console.log("text", text);
                            console.log("records", records);
                            records["title"] = "Hello";
                          }}
                        />
                      );
                    }
                  }
                ]}
                loading={false}
                isEditable={false}
                filter={false}
                dataSource={{
                  data
                }}
                rowUnique="id"
                xaxis={1500}
                showCheckBox={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
