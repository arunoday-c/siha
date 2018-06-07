import extend from "extend";
import moment from "moment";
import PatRegIOputs from "../utils/GlobalFunctions.js";

export default {
  inputParam: function(param) {
    // if(param!=null){
    //     if(param.registration_date !== 0)
    //     {
    //         param.registration_date= PatRegIOputs.isDateFormat({date:param.registration_date});
    //     }
    //     if(param.date_of_birth !== 0)
    //     {
    //         param.date_of_birth = PatRegIOputs.isDateFormat({date:param.date_of_birth})
    //     }
    // }

<<<<<<< HEAD
    var output;
    var CurrentDate = new Date();
    output = extend(
      {
        patient_code: "",
        registration_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
        title_id: null,
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        religion_id: 1,
        date_of_birth: null,
        hijiri_date: null,
        age: 0,
        marital_status: "",
        address1: "",
        address2: "",
        contact_number: 0,
        secondary_contact_number: 0,
        email: "",
        emergency_contact_name: "",
        emergency_contact_number: 0,
        relationship_with_patient: "",
        visa_type_id: 1,
        nationality_id: 0,
        postal_code: "",
        country_id: 0,
        state_id: 0,
        city_id: 0,
        primary_identity_id: 0,
        primary_id_no: "",
        secondary_identity_id: 0,
        secondary_id_no: "",
        photo_file: "",
        primary_id_file: "",
        secondary_id_file: "",
        created_by: 1,
        updated_by: 1,
        visit_type: 1,
        visit_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
        department_id: null,
        sub_department_id: null,
        doctor_id: null,
        maternity_patient: "N",
        is_mlc: "N",
        mlc_accident_reg_no: "",
        mlc_police_station: "",
        mlc_wound_certified_date: "",
        visit_code: ""
      },
      param
    );

    return output;
  }
};
=======
        // if(param!=null){
        //     if(param.registration_date !== 0)
        //     {
        //         param.registration_date= PatRegIOputs.isDateFormat({date:param.registration_date});
        //     }  
        //     if(param.date_of_birth !== 0)
        //     {
        //         param.date_of_birth = PatRegIOputs.isDateFormat({date:param.date_of_birth})    
        //     }          
        // }
        
        var output;
        var CurrentDate = new Date();
        output = extend({
            
            patient_code:"",
            registration_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
            title_id: null,
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            religion_id: 1,
            date_of_birth: null,
            hijiri_date:null,
            age: 0,
            marital_status: "",
            address1: "",
            address2: "",
            contact_number: 0,
            secondary_contact_number: 0,
            email: "",
            emergency_contact_name: "",
            emergency_contact_number: 0,
            relationship_with_patient: "",
            visa_type_id: 1,
            nationality_id: null,
            postal_code: "",
            country_id: null,
            state_id:null,
            city_id:1,
            primary_identity_id: null,
            primary_id_no: "",
            secondary_identity_id: null,
            secondary_id_no: "",
            photo_file: "",
            primary_id_file: "",
            secondary_id_file: "",
            created_by: 1,            
            updated_by: 1,
            visit_type:1,
            visit_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
            department_id: null,
            sub_department_id: 1,
            doctor_id: null,
            maternity_patient: "N",
            is_mlc: "N",
            mlc_accident_reg_no: "",
            mlc_police_station: "",
            mlc_wound_certified_date: "",
            visit_code:""
        },param);
        // debugger;
        return output;
    }
}
>>>>>>> 22608cf54eb9c1ce4f6d9afc729515de1860e20a
