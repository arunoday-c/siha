import Enumerable from "linq";

const getEmployeeDetails = $this => {
  $this.props.getEmployeeDetails({
    uri: "/employee/getEmployeeDetails",
    method: "GET",
    redux: {
      type: "DOCTOR_GET_DATA",
      mappingName: "employeedetails"
    },
    afterSuccess: data => {
      let Employeedetails = Enumerable.from(data)
        .groupBy("$.hims_d_employee_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            hims_d_employee_id: firstRecordSet.hims_d_employee_id,
            title_id: firstRecordSet.title_id,
            employee_code: firstRecordSet.employee_code,
            full_name: firstRecordSet.full_name,
            arabic_name: firstRecordSet.arabic_name,
            employee_designation_id: firstRecordSet.employee_designation_id,
            license_number: firstRecordSet.license_number,

            sex: firstRecordSet.sex,
            date_of_birth: firstRecordSet.date_of_birth,
            date_of_joining: firstRecordSet.date_of_joining,

            date_of_leaving: firstRecordSet.date_of_leaving,
            address: firstRecordSet.address,
            address2: firstRecordSet.address2,
            pincode: firstRecordSet.pincode,
            city_id: firstRecordSet.city_id,
            state_id: firstRecordSet.state_id,
            country_id: firstRecordSet.country_id,
            primary_contact_no: firstRecordSet.primary_contact_no,
            secondary_contact_no: firstRecordSet.secondary_contact_no,
            email: firstRecordSet.email,
            emergancy_contact_person: firstRecordSet.emergancy_contact_person,
            blood_group: firstRecordSet.blood_group,
            isdoctor: firstRecordSet.isdoctor,

            deptDetails: g.getSource()
          };
        })
        .toArray();

      $this.setState({ Employeedetails: Employeedetails });
    }
  });
};

const EditEmployeeMaster = ($this, row) => {
  $this.setState({
    isOpen: !$this.state.isOpen,
    employeeDetailsPop: row
  });
};

export { getEmployeeDetails, EditEmployeeMaster };
