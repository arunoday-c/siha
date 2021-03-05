import React from "react";
import "./PatientAdmission.scss";
import BreadCrumb from "../BreadCrumb/BreadCrumb.js";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  // MainContext,
} from "algaeh-react-components";
export default function PatientAdmission(props: any) {
  return (
    <div className="PatientAdmissionScreen">
      <BreadCrumb
        title={
          <AlgaehLabel
            label={{ forceLabel: "Patient Admission", align: "ltr" }}
          />
        }
        // breadStyle={this.props.breadStyle}
        soptlightSearch={{
          label: <AlgaehLabel label={{ forceLabel: "Admission Number" }} />,
          value: "",
          selectValue: "pos_number",
          events: {
            // onChange: getCtrlCode.bind(this, this),
          },
          jsonFile: {
            fileName: "spotlightSearch",
            fieldName: "pointofsaleEntry.POSEntry",
          },
          searchName: "POSEntry",
        }}
        userArea={
          <div className="row">
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Admission Date",
                }}
              />
              <h6>02-03-2025</h6>
            </div>
          </div>
        }
        printArea={{
          menuitems: [
            {
              label: "Print Report",
              events: {
                // onClick: () => {
                //   generateSalesInvoice(this.state);
                // },
              },
            },
          ],
        }}
        // selectedLang={this.state.selectedLang}
      />

      <div
        className="row inner-top-search"
        style={{ marginTop: 77, paddingBottom: 10 }}
      >
        {/* Patient code */}

        <div
          className="col-2 globalSearchCntr"
          style={{
            cursor: "pointer",
            // pointerEvents:
            //   this.state.Billexists === true
            //     ? "none"
            //     : this.state.patient_code
            //     ? "none"
            //     : "",
          }}
        >
          <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
          <h6>
            {/* onClick={PatientSearch.bind(this, this, context)} */}
            {/* {this.state.patient_code ? (
                      this.state.patient_code
                    ) : ( */}
            <AlgaehLabel label={{ fieldName: "patient_code" }} />
            {/* )} */}
            <i className="fas fa-search fa-lg"></i>
          </h6>
        </div>

        <div className="col-10">
          <div className="row">
            <AlgaehAutoComplete
              div={{ className: "col-2 mandatory" }}
              label={{
                fieldName: "select_visit",
                isImp: true,
              }}
              selector={{
                name: "",
                className: "select-fld",
                autoComplete: "off",
                value: "",
                dataSource: {
                  textField: "visit_code",
                  valueField: "",
                  data: [],
                },
                // others: { disabled: this.state.Billexists },
                // onChange: selectVisit.bind(this, this, context),
              }}
            />
            <div className="col-3">
              <AlgaehLabel
                label={{
                  fieldName: "full_name",
                }}
              />
              <h6>Mathew Varghees</h6>
            </div>

            <div className="col-2">
              <AlgaehLabel
                label={{
                  fieldName: "patient_type",
                }}
              />
              <h6>Insurance</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
