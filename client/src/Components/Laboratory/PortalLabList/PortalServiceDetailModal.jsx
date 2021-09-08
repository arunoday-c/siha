import React from "react";
import "./PortalLabList.scss";
import { useQuery } from "react-query";
import {
  AlgaehModal,
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehLabel,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
function PortalServiceDetailModal({ visible, onClose, rowData }) {
  const { data: serviceData } = useQuery(
    ["service-Grid-data"],
    getServiceDataPortal,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getServiceDataPortal(key) {
    const { data } = await newAlgaehApi({
      uri: "/laboratory/getServiceDataPortal",
      module: "laboratory",
      method: "GET",
      data: { portal_package_id: rowData.portal_package_id },
    }).catch((error) => {
      throw error;
    });
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      return data.records;
    }
  }
  return (
    <AlgaehModal
      title={"Requested Services"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <button onClick={onClose} className="btn btn-default">
          Close
        </button>,
      ]}
      // width={720}
      className={`algaehNewModal portalLabDetailModal`}
    >
      <div className="col popupInner">
        <div className="row">
          <div className="col-12">
            <div id="portalLabDetailGrid">
              <AlgaehDataGrid
                className=""
                columns={[
                  {
                    fieldName: "package_detail_service_name",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Service Name" }} />
                    ),
                    others: {
                      // Width: 120,
                      style: { textAlign: "left" },
                    },
                  },
                ]}
                data={serviceData || []}
                // pagination={false}
                pagination={false}
                // editable
                // actionsStyle={{width:100}}
                pageOptions={{ rows: 40, page: 1 }}
                // isFilterable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}

export default PortalServiceDetailModal;
