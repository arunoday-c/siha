import moment from "moment";
import Options from "../../Options.json";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

// import math from "mathjs";
// import Enumerable from "linq";
import AlgaehLoader from "../Wrapper/fullPageLoader";

var intervalId;
const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const CalculateCommission = $this => {
  AlgaehLoader({ show: true });
  $this.props.CalculateCommission({
    uri: "/doctorsCommission/doctorsCommissionCal",
    method: "POST",
    data: $this.state.billscommission,
    redux: {
      type: "CALCULATE_COMMISSION_GET_DATA",
      mappingName: "billscommission"
    },
    afterSuccess: data => {
      $this.setState({ billscommission: data }, () => {
        $this.props.calculateCommission({
          uri: "/doctorsCommission/commissionCalculations",
          method: "POST",
          data: $this.state.billscommission,
          redux: {
            type: "COMMISSION_HEADER_GEN_GET_DATA",
            mappingName: "headercommission"
          },
          afterSuccess: data => {
            $this.setState({ ...data }, () => {
              AlgaehLoader({ show: false });
            });
          }
        });
      });
    }
  });
};

const AdjustAmountCalculate = ($this, e) => {
  $this.setState({ [e.target.name]: e.target.value }, () => {
    $this.props.calculateCommission({
      uri: "/doctorsCommission/commissionCalculations",
      method: "POST",
      data: {
        adjust_amount: $this.state.adjust_amount,
        gross_comission: $this.state.gross_comission
      },
      redux: {
        type: "COMMISSION_HEADER_GEN_GET_DATA",
        mappingName: "headercommission"
      },
      afterSuccess: data => {
        $this.setState({ ...data });
      }
    });
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = ({ value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getCtrlCode = ($this, docNumber) => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    AlgaehLoader({ show: true });
    $this.props.getInitialStock({
      uri: "/pharmacy/getPharmacyInitialStock",
      method: "GET",
      printInput: true,
      data: { document_number: docNumber },
      redux: {
        type: "INITIAL_STOCK_GET_DATA",
        mappingName: "initialstock"
      },
      afterSuccess: data => {
        data.saveEnable = true;

        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        $this.setState(data);
        AlgaehLoader({ show: false });
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const SaveDoctorCommission = $this => {
  algaehApiCall({
    uri: "/pharmacy/addPharmacyInitialStock",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          document_number: response.data.records.document_number,
          saveEnable: true,
          postEnable: false
        });
        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const deleteDoctorCommission = ($this, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    if (pharmacy_stock_detail[x].noorecords === row.noorecords) {
      pharmacy_stock_detail.splice(x, 1);
    }
  }

  $this.setState({
    pharmacy_stock_detail: pharmacy_stock_detail
  });
};

const PostDoctorCommission = $this => {
  $this.state.posted = "Y";
  // algaehApiCall({
  //   uri: "/pharmacy/addPharmacyInitialStock",
  //   data: $this.state,
  //   onSuccess: response => {
  //
  //     if (response.data.success === true) {
  //       $this.setState({
  //         document_number: response.data.records.document_number,
  //         saveEnable: true
  //       });
  //       swal("Saved successfully . .", {
  //         icon: "success",
  //         buttons: false,
  //         timer: 2000
  //       });
  //     }
  //   },
  //   onFailure: error => {
  //     console.log(error);
  //   }
  // });
};

const LoadBills = $this => {
  if ($this.state.doctor_id === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Doctor."
    });
  } else if ($this.state.from_date === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select From date."
    });
  } else if ($this.state.to_date === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select To date."
    });
  } else if ($this.state.select_type === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Select Type."
    });
  } else if (
    $this.state.select_type === "SS" &&
    $this.state.select_service === null
  ) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Service."
    });
  } else {
    AlgaehLoader({ show: true });
    let inpObj = {
      incharge_or_provider: $this.state.doctor_id,
      from_date: moment($this.state.from_date).format(Options.dateFormatYear),
      to_date: moment($this.state.to_date).format(Options.dateFormatYear),
      select_type: $this.state.select_type,
      service_type_id: $this.state.select_service
    };

    $this.props.getDoctorsCommission({
      uri: "/doctorsCommission/getDoctorsCommission",
      method: "GET",
      data: inpObj,
      redux: {
        type: "BILL_DOC_COMMISSION_DATA",
        mappingName: "billscommission"
      },
      afterSuccess: data => {
        // let providers = Enumerable.from(data)
        //   .where(w => w.isdoctor === "Y")
        //   .toArray();
        $this.setState({ billscommission: data }, () => {
          AlgaehLoader({ show: false });
        });
      }
    });
  }
};

const ClearData = $this => {
  $this.setState({
    select_type: "AS",
    doctor_id: null,
    from_date: null,
    to_date: null,
    select_service: null,
    case_type: "OP",
    billscommission: [],
    op_commision: 0,
    op_credit_comission: 0,
    gross_comission: 0,
    comission_payable: 0
  });
};

export {
  changeTexts,
  LoadBills,
  CalculateCommission,
  datehandle,
  dateFormater,
  getCtrlCode,
  SaveDoctorCommission,
  deleteDoctorCommission,
  ClearData,
  PostDoctorCommission,
  AdjustAmountCalculate
};
