import React, { useState, useEffect } from "react";
import "./encounters.scss";

import {
  // AlgaehDataGrid,
  AlgaehModal,
} from "algaeh-react-components";
import { swalMessage } from "../../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../../hooks";
export function ViewAttachmentsModal({ rowData, visible, onClose }) {
  const [attached_docs, setAttached_docs] = useState([]);
  useEffect(() => {
    if (rowData.attach_type === "LAB") {
      getSavedDocument(rowData);
    } else {
      getDocuments(rowData);
    }
  }, []);
  const downloadDoc = (doc, isPreview) => {
    if (doc.fromPath === true) {
      // this.setState({ pdfLoading: true }, () => {
      newAlgaehApi({
        uri: "/getContractDoc",
        module: "documentManagement",
        method: "GET",
        extraHeaders: {
          Accept: "blon",
        },
        others: {
          responseType: "blob",
        },
        data: {
          contract_no: doc.contract_no,
          filename: doc.filename,
          download: true,
        },
      })
        .then((resp) => {
          const urlBlob = URL.createObjectURL(resp.data);
          if (isPreview) {
            window.open(urlBlob);
          } else {
            const link = document.createElement("a");
            link.download = doc.filename;
            link.href = urlBlob;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          // this.setState({ pdfLoading: false });
        })
        .catch((error) => {
          console.log(error);
          // this.setState({ pdfLoading: false });
        });
      // });
    } else {
      const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
      const link = document.createElement("a");
      if (!isPreview) {
        link.download = doc.filename;
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        fetch(fileUrl)
          .then((res) => res.blob())
          .then((fblob) => {
            const newUrl = URL.createObjectURL(fblob);
            window.open(newUrl);
          });
      }
    }
  };
  const getDocuments = (row) => {
    newAlgaehApi({
      uri: "/getRadiologyDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        hims_f_rad_order_id: row.hims_f_rad_order_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          setAttached_docs(data);
          // this.setState({
          //   attached_docs: data,
          // });
        }
      })
      .catch((e) => {
        // AlgaehLoader({ show: false });
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  };
  const getSavedDocument = (row) => {
    newAlgaehApi({
      uri: "/getContractDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        contract_no: row.lab_id_number,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          setAttached_docs(data);
          //   attached_docs: data,
          // });
        }
      })
      .catch((e) => {
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  };
  return (
    <div>
      <AlgaehModal
        title="View Attachments"
        visible={visible}
        mask={true}
        maskClosable={false}
        onCancel={onClose}
        footer={[
          <div className="col-12">
            <button onClick={onClose} className="btn btn-default btn-sm">
              Cancel
            </button>
          </div>,
        ]}
        className={`algaehNewModal investigationAttachmentModal`}
      >
        <div className="portlet-body">
          <div className="col-12">
            <div className="row">
              <div className="col-3"></div>
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    <ul className="AttachmentList">
                      {attached_docs.length ? (
                        attached_docs.map((doc) => (
                          <li>
                            <b> {doc.filename} </b>
                            <span>
                              <i
                                className="fas fa-download"
                                onClick={() => downloadDoc(doc)}
                              ></i>
                              <i
                                className="fas fa-eye"
                                onClick={() => downloadDoc(doc, true)}
                              ></i>
                            </span>
                          </li>
                        ))
                      ) : (
                        <div className="col-12 noAttachment" key={1}>
                          <p>No Attachments Available</p>
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModal>
    </div>
  );
}
