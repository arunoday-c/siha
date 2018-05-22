

import {combineReducers} from "redux";
import {TokenDetails} from "./Login/Loginreducers.js";
import {DepartmentDetails, SubDepartmentDetails} from "./CommonSetup/Department.js";
import {CitiesDetails} from "./Masters/City.js";
import {CountriesDetails} from "./Masters/Country.js";
import {StatesDetails} from "./Masters/State.js";
import {TitlesDetails} from "./Masters/Title.js";
import {IDTypeDetails} from "./CommonSetup/IDTypes.js";
import {NationalityDetails} from "./Masters/Nationality.js"
import {RelegionDetails} from "./Masters/Relegion.js"
import {PatRegistrationDetails} from "./RegistrationPatient/Registrationreducers.js"
import {VisatypeDetails} from "./CommonSetup/Visatype.js";
import {VisittypeDetails} from "./CommonSetup/VisitTypereducers.js";
import {OptionsDetails} from './BusinessSetup/Options.js'

export default combineReducers({
	tokensDtl: TokenDetails,
	departments:DepartmentDetails,
	cities:CitiesDetails,
	countries:CountriesDetails,
	countrystates:StatesDetails,
	titles:TitlesDetails,
	subdepartments:SubDepartmentDetails,
	idtypes : IDTypeDetails,
	nationalities: NationalityDetails,
	relegions: RelegionDetails,
	patients:PatRegistrationDetails,
	visatypes:VisatypeDetails,
	visittypes:VisittypeDetails,
	options : OptionsDetails
});