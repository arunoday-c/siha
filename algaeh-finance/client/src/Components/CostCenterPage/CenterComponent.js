import React, { memo, useState } from "react";
import "./costcenter.scss";
import {
  AlgaehDataGrid,
  AlgaehModal,
  AlgaehButton,
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
    return <i className="fas fa-pen" onClick={() => openEdit(args[1])}></i>;
  }

  return (
    <>
      {visible && current ? (
        <AlgaehModal
          title="Edit Cost Center"
          visible={visible}
          mask={true}
          maskClosable={false}
          onCancel={closeEdit}
          footer={null}
          className="costCenterModal"
        >
          <div className="row">
            {" "}
            <CostCenterComponent
              noborder={false}
              orgUrl="/organization/getOrganization"
              propBranchID={current.cost_center_id}
              propCenterID={current.hospital_id}
              render={(values) => (
                <div className="col-12 modalCustomFooter">
                  <AlgaehButton
                    type="default"
                    onClick={() => closeEdit(values)}
                  >
                    Cancel
                  </AlgaehButton>{" "}
                  <AlgaehButton
                    type="primary"
                    onClick={() => closeEdit(values)}
                  >
                    Update
                  </AlgaehButton>{" "}
                </div>
              )}
            />
          </div>
        </AlgaehModal>
      ) : null}
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
              className="costCenterMasterGrid"
              columns={[
                {
                  label: "Action",
                  fieldName: "key",
                  align: "center",
                  displayTemplate: EditButton,
                },
                {
                  fieldName: "hospital_name",
                  label: "Branch",
                  filtered: true,
                  align: "center",
                },
                {
                  fieldName: "cost_center",
                  label: "Cost Center",
                  filtered: true,
                  align: "center",
                },
              ]}
              loading={false}
              isEditable={false}
              filter={false}
              data={data}
              rowUnique="cost_center_id"
              xaxis={1500}
            />
          </div>
        </div>
      </div>
    </>
  );
});
