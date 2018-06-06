
export function Validations (state) {
    let isError = false;  

    if (state.state.first_name.length <= 0) {
      isError = true;
      state.setState({
        open: true,
        MandatoryMsg: "Invalid. First Name Cannot be blank."
      });      
      document.querySelector("[name='first_name']").focus();
      return isError;
    }

    if (state.state.middle_name.length <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Middle Name Cannot be blank."
        });
        document.querySelector("[name='middle_name']").focus();
        return isError;
    }

    if (state.state.last_name.length <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Last Name Cannot be blank."
        });
        document.querySelector("[name='last_name']").focus();
        return isError;
    }

    if (state.state.title_id <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Title Cannot be blank."
        });
        return isError;
    }

    // if (state.state.date_of_birth <= 0) {
    //     isError = true;
    //     state.setState({
    //         open: true,
    //         MandatoryMsg: "Invalid. DOB Cannot be blank."
    //     });
    //     return isError;
    // }

    if (state.state.primary_identity_id <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Primary ID Cannot be blank."
        });
        return isError;
    }

    if (state.state.primary_id_no.length <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Primary ID No. Cannot be blank."
        });
        document.querySelector("[name='primary_id_no']").focus();
        return isError;
    }

    if (state.state.nationality_id <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Nationality Cannot be blank."
        });
        return isError;
    }

    if (state.state.country_id <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Country Cannot be blank."
        });
        return isError;
    }

    if (state.state.contact_number <= 0) {
        isError = true;
        state.setState({
            open: true,
            MandatoryMsg: "Invalid. Mobile No. Cannot be blank."
        });
        return isError;
    }    
};