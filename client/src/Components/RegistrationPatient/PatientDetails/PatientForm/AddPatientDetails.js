import moment from 'moment';

export function AddPatientHandlers(state){
    return{
 
        texthandle: (e)=>  {
            debugger;
            state.setState({
                [e.target.name]: e.target.value
            });            
        },
        genderhandle: (selectval)=>{
            debugger;
            state.setState({
                gender: selectval
            });
        },

        titlehandle: (selectval) =>{
            debugger;
            state.setState({
                title_id: selectval
            },()=>{
                let setGender
                if(state.state.title_id == 1)
                {
                    setGender="Male"
                }
                else if(state.state.title_id == 2)
                {
                    setGender="Female"
                }	
                
                state.setState({
                    gender: setGender
                })    
            });
        },

        martialhandle: (selectval) => {
            state.setState({
                marital_status: selectval
            });
        },

        visatyphandle: (selectval) => {
            state.setState({
                visa_type_id: selectval
            });
        },

        nationalityhandle: (selectval) => {
            state.setState({
                nationality_id: selectval
            });
        },

        primaryidhandle: (selectval) => {
            state.setState({
                primary_identity_id: selectval
            });
        },

        secondryidhandle: (selectval) => {
            state.setState({
                secondary_identity_id: selectval
            });
        },

        relegionshandle: (selectval) => {
            state.setState({
                religion_id: selectval
            });
        },

        countrieshandle: (selectval )=> {
            state.setState({
                country_id: selectval
            });
        },

        statehandle: (selectval) => {
            state.setState({
                state_id: selectval
            });
        },

        cityhandle: (selectval) => {
            state.setState({
                city_id: selectval
            });
        },

        DateOfBirthValidation: (SelectedDate) => {
            debugger;
            let isError = false;
            var today = moment(new Date()).format("YYYY-MM-DD");
            var DateOfBirth = moment(SelectedDate).format("YYYY-MM-DD"); //new Date(e.target.value),

            if (DateOfBirth > today) {
                isError = true;
                state.setState({
                    DOBErrorMsg:"DOB Cannot be greater than current date.",
                    DOBError:isError
                });
            }
            else{
                state.setState({				
                    DOBError:isError				  
                });
            }            	
            return isError;
        },
        
        CalculateAge: (e) => {                        
            const err = state.DateOfBirthValidation(e.target.value);
            console.log(err);
            if (!err) {
                if (e.target.value.length > "0") {
                    state.setState(
                    {
                        date_of_birth: e.target.value
                    },
                    () => {
                    
                    var one_day = 1000 * 60 * 60 * 24;
                    var today = new Date();                    
                    var other_date = new Date(state.state.date_of_birth);

                    var Birth_date = new Date(
                        other_date.getFullYear(),
                        other_date.getMonth(),
                        other_date.getDate()
                    );                    
                    if (Birth_date > today) return;

                    var Years = today.getFullYear() - other_date.getFullYear();
                    var Months = today.getMonth() - other_date.getMonth();
                    var Days = today.getDate() - other_date.getDate();

                    if (Days < 0) state.state.AGEMM = Months - 1;

                    if (Months < 0) {
                        Years = Years - 1;
                        Months = Months + 12;
                    }

                    state.setState({
                        age: Years,
                        AGEMM: Months,
                        AGEDD: Days
                    });                    	  
                    }
                );
                }
            }
        },

        //Calculates Date of birth with given Age in Years, Months & Days
        //Starts here
        //Calculates Date of birth with given Age in Years, Months & Days
        //Starts here
        CalculateDateofBirth: (e)  => {
            var today = new Date(),
            date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();

            const Current_array = date.split("-");

            var DateOfBrth = new Date(
            Current_array[0] - state.state.age,
            Current_array[1] - state.state.AGEMM,
            Current_array[2] - state.state.AGEDD
            );
            // var date = new Date(DateOfBrth).toDateString("yyyy-MM-dd");

            if (DateOfBrth.getMonth() < "10" && DateOfBrth.getDate() < "10") {
            var date =
                DateOfBrth.getFullYear() +
                "-0" +
                DateOfBrth.getMonth() +
                "-0" +
                DateOfBrth.getDate();
            } else if (DateOfBrth.getMonth() < "10") {
            var date =
                DateOfBrth.getFullYear() +
                "-0" +
                DateOfBrth.getMonth() +
                "-" +
                DateOfBrth.getDate();
            } else if (DateOfBrth.getDate() < "10") {
            var date =
                DateOfBrth.getFullYear() +
                "-" +
                DateOfBrth.getMonth() +
                "-0" +
                DateOfBrth.getDate();
            } else {
            var date =
                DateOfBrth.getFullYear() +
                "-" +
                DateOfBrth.getMonth() +
                "-" +
                DateOfBrth.getDate();
            }

            console.log("Date Of Birth-", date);

            state.setState({
                date_of_birth: date
            });
        },

        SetAge: (e) => {
            console.log("Length-", e.target.value.length);
            if (e.target.value.length > "0") {
                state.setState({
                    [e.target.name]: e.target.value
            },() => {                
                    state.CalculateDateofBirth();
            });
            }
        },

        onDrop: (file, fileType) => {
            state.imageDataToFile(file, fileType);
        },
        
        imageDataToFile: (file, fileType) => {
            state.state.file[file] = fileType[0].preview;
            state.setState({
                file: state.state.file
            })
        }
    }
}



