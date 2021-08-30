import React from "react";
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
      title={"Portal Services For Patient List"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[<button onClick={onClose}>Close</button>]}
      width={720}
      // footer={null}

      // class={this.state.lang_sets}
    >
      {/* <Spin spinning={}> */}
      <div className="col popupInner">
        <div className="row">
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Service List </h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div id="">
                      <AlgaehDataGrid
                        className=""
                        columns={[
                          {
                            fieldName: "package_detail_service_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Name" }}
                              />
                            ),
                          },
                          // {
                          //   fieldName: "full_name",
                          //   label: (
                          //     <AlgaehLabel
                          //       label={{ forceLabel: "Patient Name" }}
                          //     />
                          //   ),
                          // },
                        ]}
                        data={serviceData || []}
                        pagination={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
      {/* </Spin> */}
    </AlgaehModal>
  );
}

export default PortalServiceDetailModal;
