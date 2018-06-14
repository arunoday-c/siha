import { combineReducers } from "redux";
import { TokenDetails } from "./Login/Loginreducers";
import {
  DepartmentDetails,
  SubDepartmentDetails,
  DepartmentsClinicalNon
} from "./CommonSetup/Department";
import { CitiesDetails } from "./Masters/City";
import { CountriesDetails } from "./Masters/Country";
import { StatesDetails } from "./Masters/State";
import { TitlesDetails } from "./Masters/Title";
import { IDTypeDetails } from "./CommonSetup/IDTypes";
import { NationalityDetails } from "./Masters/Nationality";
import { RelegionDetails } from "./Masters/Relegion";
import { PatRegistrationDetails } from "./RegistrationPatient/Registrationreducers";
import { VisatypeDetails } from "./CommonSetup/Visatype";
import { VisittypeDetails } from "./CommonSetup/VisitTypereducers";
import { OptionsDetails } from "./BusinessSetup/Options";
import { ProviderDetails } from "./ServiceCategory/Providerreducers";
import { PatVisitDetails } from "./RegistrationPatient/Visitreducers";

export default combineReducers({
  tokensDtl: TokenDetails,
  departments: DepartmentDetails,
  cities: CitiesDetails,
  countries: CountriesDetails,
  countrystates: StatesDetails,
  titles: TitlesDetails,
  subdepartments: SubDepartmentDetails,
  idtypes: IDTypeDetails,
  nationalities: NationalityDetails,
  relegions: RelegionDetails,
  patients: PatRegistrationDetails,
  visatypes: VisatypeDetails,
  visittypes: VisittypeDetails,
  options: OptionsDetails,
  providers: ProviderDetails,
  visits: PatVisitDetails,
  clndepartments: DepartmentsClinicalNon
});
