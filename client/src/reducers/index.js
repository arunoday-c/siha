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
import { Billreducers } from "./RegistrationPatient/Billreducers";
import { DepartmentsandDoctors } from "./CommonSetup/DepartmentsDoctorsreducers";
import { ServiceTypeDetails } from "./ServiceCategory/ServiceTypesreducers";
import { ServicesDetails } from "./ServiceCategory/Servicesreducers";
import { PatientTypeDetails } from "./CommonSetup/PatientTypereducers";

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
  clndepartments: DepartmentsClinicalNon,
  genbill: Billreducers,
  deptanddoctors: DepartmentsandDoctors,
  servicetype: ServiceTypeDetails,
  services: ServicesDetails,
  patienttype: PatientTypeDetails
});
