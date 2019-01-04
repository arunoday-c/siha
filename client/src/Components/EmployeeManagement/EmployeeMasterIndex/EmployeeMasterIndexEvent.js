import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const getEmployeeDetails = $this => {
  algaehApiCall({
    uri: "/employee/get",
    method: "GET",

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          debugger;
          let Employeedetails = Enumerable.from(data)
            .groupBy("$.hims_d_employee_id", null, (k, g) => {
              let firstRecordSet = Enumerable.from(g).firstOrDefault();

              return {
                hims_d_employee_id: firstRecordSet.hims_d_employee_id,
                employee_code: firstRecordSet.employee_code,
                full_name: firstRecordSet.full_name,
                arabic_name: firstRecordSet.arabic_name,
                date_of_birth: firstRecordSet.date_of_birth,
                sex: firstRecordSet.sex,
                primary_contact_no: firstRecordSet.primary_contact_no,
                email: firstRecordSet.email,
                blood_group: firstRecordSet.blood_group,
                nationality: firstRecordSet.nationality,
                religion_id: firstRecordSet.religion_id,

                marital_status: firstRecordSet.marital_status,
                present_address: firstRecordSet.present_address,
                present_address2: firstRecordSet.present_address2,
                present_pincode: firstRecordSet.present_pincode,
                present_state_id: firstRecordSet.present_state_id,
                present_country_id: firstRecordSet.present_country_id,

                permanent_address: firstRecordSet.permanent_address,
                permanent_address2: firstRecordSet.permanent_address2,
                permanent_pincode: firstRecordSet.permanent_pincode,
                permanent_city_id: firstRecordSet.permanent_city_id,
                permanent_state_id: firstRecordSet.permanent_state_id,
                permanent_country_id: firstRecordSet.permanent_country_id,
                isdoctor: firstRecordSet.isdoctor,
                license_number: firstRecordSet.license_number,
                date_of_joining: firstRecordSet.date_of_joining,

                appointment_type: firstRecordSet.appointment_type,
                employee_type: firstRecordSet.employee_type,
                reliving_date: firstRecordSet.reliving_date,
                notice_period: firstRecordSet.notice_period,
                date_of_resignation: firstRecordSet.date_of_resignation,
                company_bank_id: firstRecordSet.company_bank_id,
                employee_bank_name: firstRecordSet.employee_bank_name,
                employee_bank_ifsc_code: firstRecordSet.employee_bank_ifsc_code,
                employee_account_number: firstRecordSet.employee_account_number,
                mode_of_payment: firstRecordSet.mode_of_payment,

                accomodation_provided: firstRecordSet.accomodation_provided,
                hospital_id: firstRecordSet.hospital_id,

                // employee_designation_id: firstRecordSet.employee_designation_id,

                // date_of_leaving: firstRecordSet.date_of_leaving,

                // secondary_contact_no: firstRecordSet.secondary_contact_no,

                // emergancy_contact_person:
                //   firstRecordSet.emergancy_contact_person,

                deptDetails: g.getSource()
              };
            })
            .toArray();
          debugger;
          $this.setState({ Employeedetails: Employeedetails });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });

  // $this.props.getEmployeeDetails({
  //   uri: "/employee/getEmployeeDetails",
  //   method: "GET",
  //   redux: {
  //     type: "DOCTOR_GET_DATA",
  //     mappingName: "employeedetails"
  //   },
  //   afterSuccess: data => {}
  // });
};

const EditEmployeeMaster = ($this, row) => {
  $this.setState({
    isOpen: !$this.state.isOpen,
    employeeDetailsPop: row,
    editEmployee: true
  });
};

export { getEmployeeDetails, EditEmployeeMaster };
