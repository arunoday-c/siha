import React, { useEffect, useState } from "react";
import "./userPreference.scss";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";
import moment from "moment";
import { newAlgaehApi } from "../../../hooks";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function UserDownloads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadData();
  }, []);
  function loadData() {
    try {
      setLoading(true);
      newAlgaehApi({
        uri: `/getRecordsDownload`,
        module: "reports",
        method: "GET",
      })
        .then((response) => {
          setData(response.data.result);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          throw error;
        });
    } catch (e) {
      AlgaehMessagePop({ type: "error", display: e.response.data.message });
    }
  }
  function downloadReport(params) {
    try {
      setLoading(true);
      algaehApiCall({
        uri: "/downloadReport",
        method: "GET",
        module: "reports",
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
        data: { hims_f_request_download_id: params.hims_f_request_download_id },
        onSuccess: (response) => {
          const url = window.URL.createObjectURL(response.data);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${moment().format("DD-MM-YYYY-HH-mm-ss")}.${"pdf"}`;
          a.click();
          // setData(response.data.result);
          setLoading(false);
        },
        onCatch: (error) => {
          setLoading(false);
          throw error;
        },
      });
    } catch (error) {
      AlgaehMessagePop({ type: "error", display: error.response.data.message });
    }
  }

  return (
    <div className="col-9">
      <Spin spinning={loading} tip="Please wait..">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">User Download Requests</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-12" id="userDownload">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "id",
                      label: <AlgaehLabel label={{ forceLabel: "Download" }} />,
                      displayTemplate: (row) => {
                        if (row.can_download === 1)
                          return (
                            <i
                              className="fas fa-download"
                              onClick={() => {
                                downloadReport(row);
                              }}
                            ></i>

                            // <button
                            //   onClick={() => {
                            //     downloadReport(row);
                            //   }}
                            // >
                            //   Download
                            // </button>
                          );
                        else return <span>Processing</span>;
                      },
                    },
                    {
                      fieldName: "report_title",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Report For" }} />
                      ),
                      others: {
                        // Width: 150,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "number_of_download",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "No. of downloads" }}
                        />
                      ),
                    },
                    {
                      fieldName: "last_downloaded",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Last download On" }}
                        />
                      ),
                    },
                  ]}
                  data={data}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
