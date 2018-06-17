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
let router = express();

//connect to DB
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
});

export default router;
