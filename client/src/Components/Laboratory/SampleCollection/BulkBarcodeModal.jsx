import React, { useState } from "react";
import "./SampleCollection.scss";
import {
  AlgaehModal,
  Spin,
  AlgaehDateHandler,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { useQuery } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";
import { algaehApiCall } from "../../../utils/algaehApiCall";
const getSubCompany = async () => {
  const { data } = await newAlgaehApi({
    uri: "/insurance/getSubInsurance",
    module: "insurance",
    method: "GET",
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
};

function BulkBarcodeModal({ onCancel, visible, title }) {
  const { control, errors, getValues, handleSubmit } = useForm({
    defaultValues: {
      from_date: new Date(),
      //   doctor_viewed: "A",
    },
  });
  const [loading, setLoading] = useState(false);
  const [lab_order_ids, setLab_order_ids] = useState([]);
  const [enablePrintButton, setEnablePrintButton] = useState(true);
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  function onCancelClick() {
    setLoading(false);
    onCancel();
  }
  const checkLabOrderExists = (hims_d_insurance_sub_id) => {
    newAlgaehApi({
      uri: "/laboratory/checkLabOrderExistsCompany",
      module: "laboratory",
      method: "GET",
      data: {
        hims_d_insurance_sub_id: hims_d_insurance_sub_id,
        from_date: getValues().from_date,
      },
    })
      .then((response) => {
        if (response.data.success) {
          if (response.data.records.length > 0) {
            let lab_ids = response.data.records.map(
              (item) => item.hims_f_lab_order_id
            );
            setLab_order_ids(lab_ids);
            setEnablePrintButton(false);
          } else {
            setEnablePrintButton(true);
          }
        }
      })
      .catch((error) => {
        throw error;
      });
  };
  function onPdfGeneration(data) {
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);

    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          others: {
            width: "50mm",
            height: "20mm",
            showHeaderFooter: false,
          },
          reportName: "specimenBulkBarcodeByCompany",
          reportParams: [
            {
              name: "hims_f_lab_order_id",
              value: lab_order_ids,
            },
          ],
          outputFileType: "PDF",
        },
      },

      onSuccess: (res) => {
        setLoading(false);
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },
    });
  }
  const { data: sub_companies } = useQuery(["sub-companies"], getSubCompany, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,

    onSuccess: (data) => {},
  });
  return (
    <AlgaehModal
      className="algaehLedgerReportStyle"
      title={title}
      visible={visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      afterClose={() => {
        setLoading(false);
      }}
      footer={
        <div>
          <span
            disabled={enablePrintButton}
            className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only"
            onClick={handleSubmit(onPdfGeneration)}
          >
            <i className="fas fa-file-pdf"></i>
          </span>

          <span
            className="ant-btn ant-btn-dangerous ant-btn-circle ant-btn-icon-only"
            onClick={onCancelClick}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>
      }
    >
      <Spin tip={plaseWait} spinning={loading}>
        <div className="row">
          <Controller
            control={control}
            name="from_date"
            rules={{ required: "Please Select DOB" }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{
                  className: "col-4 form-group mandatory",
                  //   tabIndex: "4",
                }}
                error={errors}
                label={{
                  fieldName: "from_date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date",
                  value,
                }}
                // others={{ disabled }}
                // maxDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="hims_d_insurance_sub_id"
            rules={{ required: "Required" }}
            render={({ value, onChange, onBlur }) => (
              <AlgaehAutoComplete
                div={{
                  className: "col-8 form-group mandatory",
                }}
                error={errors}
                label={{
                  forceLabel: "Select Company",
                  isImp: true,
                }}
                selector={{
                  value,
                  onChange: (_, selected) => {
                    setLab_order_ids([]);
                    onChange(selected);
                    checkLabOrderExists(selected);
                    setEnablePrintButton(true);
                  },
                  onClear: () => {
                    onChange("");
                  },
                  name: "hims_d_insurance_sub_id",
                  dataSource: {
                    textField: "insurance_sub_name",
                    valueField: "hims_d_insurance_sub_id",
                    data: sub_companies,
                  },
                }}
              />
            )}
          />
        </div>
      </Spin>
    </AlgaehModal>
  );
}

export default BulkBarcodeModal;
