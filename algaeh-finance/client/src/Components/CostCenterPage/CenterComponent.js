import React, { memo, useState } from "react";
import "./costcenter.scss";
import {
  AlgaehDataGrid,
  AlgaehModal,
  AlgaehButton
} from "algaeh-react-components";
import CostCenterComponent from "../costCenterComponent";

export default memo(function CenterComponent({ data }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  function openEdit(obj) {
    setVisible(true);
    setCurrent(obj);
  }

  function closeEdit() {
    setVisible(false);
    setCurrent(null);
  }

  function EditButton(...args) {
    return (
      <button className="btn btn-primary" onClick={() => openEdit(args[1])}>
        Edit
      </button>
    );
  }

  return (
    <div>
      {visible && current ? (
        <AlgaehModal
          title="Edit Cost Center"
          visible={visible}
          mask={true}
          maskClosable={false}
          onCancel={closeEdit}
          footer={null}
        >
          <CostCenterComponent
            noborder={false}
            orgUrl="/organization/getOrganization"
            propBranchID={current.cost_center_id}
            propCenterID={current.hospital_id}
            render={values => (
              <AlgaehButton type="primary" onClick={() => closeEdit(values)}>
                Change
              </AlgaehButton>
            )}
          />
        </AlgaehModal>
      ) : null}
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Cost Center</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    title: "Action",
                    key: "key",
                    align: "center",
                    displayTemplate: EditButton
                  },
                  {
                    key: "hospital_name",
                    title: "Branch",
                    filtered: true,
                    align: "center"
                  },
                  {
                    key: "cost_center",
                    title: "Cost Center",
                    filtered: true,
                    align: "center"
                  }
                ]}
                loading={false}
                isEditable={false}
                filter={false}
                dataSource={{
                  data
                }}
                rowUnique="cost_center_id"
                xaxis={1500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
