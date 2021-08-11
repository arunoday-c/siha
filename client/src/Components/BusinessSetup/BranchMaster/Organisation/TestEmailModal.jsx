import React, { useState } from "react";
import {
  AlgaehModal,
  Spin,
  AlgaehButton,
  AlgaehFormGroup,
  AlgaehLabel,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
import { swalMessage } from "../../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../../hooks";
export default function TestEmailModal({ visible, setVisible }) {
  const {
    control,
    errors,
    // register,
    // reset,
    handleSubmit,
    // // setValue,
    // getValues,
    // watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [body_mail, setBody_mail] = useState("");
  const sendTestMail = (data) => {
    debugger;
    // return new Promise((resolve, reject) => {
    setLoading(true);
    // try {
    newAlgaehApi({
      uri: "/branchMaster/sendTestMail",
      module: "masterSettings",
      method: "GET",
      data: {
        ...data,
      },
    })
      .then((response) => {
        debugger;
        swalMessage({
          title: "Successfully Sent",
          type: "success",
        });
        setVisible();

        setBody_mail("");
        setLoading(false);
      })
      .catch((error) => {
        debugger;
        swalMessage({
          title: error.message,
          type: "error",
        });
        setVisible();
        setBody_mail("");
        setLoading(false);
      });

    // } catch (e) {
    //   reject(e);
    // }
    // })
  };
  const onSubmit = (e) => {
    debugger;
    console.error(errors);

    sendTestMail({
      ...e,
      body_mail: body_mail,
    });
  };
  return (
    <div>
      <AlgaehModal
        title={`Send Test Mail`}
        visible={visible}
        destroyOnClose={true}
        footer={null}
        // okText="Confirm"
        // onOk={() => {
        // footer={[
        //   <AlgaehButton
        //     loading={loading}
        //     className="btn btn-primary"
        //     onClick={() => {
        //       labDashBoardWithAttachment({
        //         ...reportParams,
        //         to_mail_id: getValues().to_mail_id,
        //         body_mail: body_mail,
        //       })
        //         .then(() => {
        //           setVisible(false);
        //           swal({
        //             title: "Successfully Sent",
        //             type: "success",
        //           });
        //           setBody_mail("");
        //           setLoading(false);
        //         })
        //         .catch((error) => {
        //           swal({
        //             title: error.message,
        //             type: "error",
        //           });
        //           setVisible(false);
        //           setBody_mail("");
        //           setLoading(false);
        //         });
        //     }}
        //   >
        //     <AlgaehLabel
        //       label={{
        //         forceLabel: "Send",
        //         returnText: true,
        //       }}
        //     />
        //   </AlgaehButton>,

        //   ,
        // ]}
        onCancel={() => {
          // finance_voucher_header_id = "";
          // rejectText = "";
          setVisible();
        }}
        className={`row algaehNewModal dashboardEmailSend`}
      >
        <Spin spinning={loading}>
          <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}>
            <Controller
              name="to_mail_id"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  error={errors}
                  label={{
                    forceLabel: "To Email Address",
                    isImp: true,
                  }}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "to_mail_id",
                  }}
                />
              )}
            />

            <div className="col-12">
              <AlgaehLabel
                label={{
                  forceLabel: "Message",
                }}
              />

              <textarea
                value={body_mail}
                name="body_mail"
                onChange={(e) => {
                  setBody_mail(e.target.value);
                }}
              />
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button className="btn btn-primary btn-sm" type="submit">
                      Send
                    </button>
                    <AlgaehButton
                      className="btn btn-default"
                      onClick={() => {
                        setVisible();
                      }}
                    >
                      Cancel
                    </AlgaehButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Spin>
      </AlgaehModal>
    </div>
  );
}
