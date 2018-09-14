import express from "express";
import middleware from "../middleware";
import initializedDb from "../db";
import config from "../keys/keys";
import account from "../controller/account";
import employee from "../controller/employee";
import department from "../controller/department";
import identity from "../controller/identity";
import visitType from "../controller/visitType";
import patientRegisteration from "../controller/patientRegistration";
import frontDesk from "../controller/frontDesk";
import getMasters from "../controller/masters";
import updateMaster from "../controller/updateMasters";
import languageTranslator from "../controller/languageTranslator";
import visit from "../controller/visit";
import serviceType from "../controller/serviceType";
import billing from "../controller/billing";
import patientType from "../controller/patientType";
import globalSearch from "../controller/globalSearch";
import insurance from "../controller/insurance";
import opBilling from "../controller/opBilling";
import userPreferences from "../controller/userPreferences";
import doctorsWorkBench from "../EHR/controller/doctorsWorkBench";
import hpi from "../EHR/controller/hpi";
import orderAndPreApproval from "../controller/orderAndPreApproval";
import laboratory from "../controller/laboratory";
import labmasters from "../controller/labmasters";
import investigation from "../controller/investigation";
import icdcptcodes from "../controller/icdcptcodes";
import radiology from "../controller/radiology";
import algaehappuser from "../controller/algaehappuser";
import dietmaster from "../controller/dietmaster";
import itemmaster from "../controller/itemmaster";
import genericmaster from "../controller/genericmaster";

let router = express();

//connect to DB
//function(db)
initializedDb(db => {
  //internal middleware
  router.use(middleware({ config, db }));
  //api router v1
  router.use("/apiAuth", account({ config, db }));
  router.use("/employee", employee({ config, db }));
  router.use("/department", department({ config, db }));
  router.use("/identity", identity({ config, db }));
  router.use("/visitType", visitType({ config, db }));
  router.use("/patient", patientRegisteration({ config, db }));
  router.use("/frontDesk", frontDesk({ config, db }));
  router.use("/masters/get", getMasters());
  router.use("/masters/set", updateMaster());
  router.use("/translator", languageTranslator());
  router.use("/visit", visit({ config, db }));
  router.use("/serviceType", serviceType({ config, db }));
  router.use("/billing", billing({ config, db }));
  router.use("/patientType", patientType({ config, db }));
  router.use("/insurance", insurance({ config, db }));
  router.use("/gloabelSearch", globalSearch());
  router.use("/opBilling", opBilling({ config, db }));
  router.use("/userPreferences", userPreferences());
  router.use("/doctorsWorkBench", doctorsWorkBench({ config, db }));
  router.use("/hpi", hpi({ config, db }));
  router.use("/orderAndPreApproval", orderAndPreApproval({ config, db }));
  router.use("/laboratory", laboratory({ config, db }));
  router.use("/labmasters", labmasters({ config, db }));
  router.use("/investigation", investigation({ config, db }));
  router.use("/icdcptcodes", icdcptcodes({ config, db }));
  router.use("/radiology", radiology({ config, db }));
  router.use("/algaehappuser", algaehappuser({ config, db }));
  router.use("/dietmaster", dietmaster({ config, db }));
  router.use("/itemmaster", itemmaster({ config, db }));
  router.use("/genericmaster", genericmaster({ config, db }));
});

export default router;
