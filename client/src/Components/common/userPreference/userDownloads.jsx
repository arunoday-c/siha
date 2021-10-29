import React, { useEffect, useState } from "react";
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
    <Spin spinning={loading} tip="Please wait..">
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">User Download Requests</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "id",
                      label: <AlgaehLabel label={{ forceLabel: "" }} />,
                      displayTemplate: (row) => {
                        if (row.can_download === 1)
                          return (
                            <button
                              onClick={() => {
                                downloadReport(row);
                              }}
                            >
                              Download
                            </button>
                          );
                        else return <span>Processing</span>;
                      },
                    },
                    {
                      fieldName: "report_title",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Report For" }} />
                      ),
                    },
                    {
                      fieldName: "number_of_download",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Number of downloads" }}
                        />
                      ),
                    },
                    {
                      fieldName: "last_downloaded",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Last download on" }}
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
      </div>
    </Spin>
  );
}
