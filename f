[33mcommit a8fc203a96d822660eae11b9f36d58f62eb94234[m[33m ([m[1;36mHEAD -> [m[1;32mdevelopment[m[33m, [m[1;31morigin/development[m[33m)[m
Author: Syed Noor <syednoor.algaeh@gmail.com>
Date:   Mon Sep 30 12:38:45 2019 +0530

    development cleanup

[1mdiff --git a/2 b/2[m
[1mdeleted file mode 100644[m
[1mindex cf9ac75a8..000000000[m
[1m--- a/2[m
[1m+++ /dev/null[m
[36m@@ -1,80 +0,0 @@[m
[31m-[33mcommit dabd639c5efdc483356e5a67ef32cd7000fb2030[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m)[m[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Tue Jun 26 13:53:53 2018 +0530[m
[31m-[m
[31m-     API for  adding bill details[m
[31m-[m
[31m-[33mcommit 35197eba6377fafc3b826b3074d5a8b9900d908c[m[m
[31m-Author: Syed Noor <syednoor@Syeds-MacBook-Air.local>[m
[31m-Date:   Tue Jun 26 10:50:06 2018 +0530[m
[31m-[m
[31m-    grid first column width reduced[m
[31m-[m
[31m-[33mcommit eae0e7d2bb2911a4c1287b7e1d5ba3f18cdf6237[m[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Mon Jun 25 14:58:57 2018 +0530[m
[31m-[m
[31m-    API to get all the doctors department wise and vice versa[m
[31m-[m
[31m-[33mcommit 8b85270ada5b025e90d9916cc985d4ea3a312b49[m[m
[31m-Author: Syed Noor <syednoor@Syeds-MacBook-Air.local>[m
[31m-Date:   Mon Jun 25 14:26:52 2018 +0530[m
[31m-[m
[31m-    Detaprtment and doctors[m
[31m-[m
[31m-[33mcommit 0c8d849ce96b31c25f31b2f3ae1c8276b79ef904[m[m
[31m-Merge: 5e998f9 dcf43fd[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Mon Jun 25 13:12:10 2018 +0530[m
[31m-[m
[31m-    Merge branch 'master' of https://bitbucket.org/algaeh/hims-app-merged[m
[31m-[m
[31m-[33mcommit 5e998f92b147db07553348f40f12163f8f66e348[m[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Mon Jun 25 13:10:42 2018 +0530[m
[31m-[m
[31m-    subdepartment api (need to b fixd)[m
[31m-[m
[31m-[33mcommit dcf43fd0cba6d584b2606b2124b3340a3f965007[m[m
[31m-Author: Syed Noor - Office <syednoor.algaeh@gmail.com>[m
[31m-Date:   Sat Jun 23 19:43:07 2018 +0530[m
[31m-[m
[31m-    Front Desk billing and recipt design and functionality done[m
[31m-[m
[31m-[33mcommit 4a9a6757a2c0d8e83c7da9e8ae3f5e9627503dc4[m[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Sat Jun 23 15:58:12 2018 +0530[m
[31m-[m
[31m-    assigned values to zero in billing API[m
[31m-[m
[31m-[33mcommit ee15e3aac449eb8f5547210d753ff3caa6c16e27[m[m
[31m-Merge: 19fe542 7a0b13a[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Sat Jun 23 11:46:08 2018 +0530[m
[31m-[m
[31m-    Merge branch 'master' of https://bitbucket.org/algaeh/hims-app-merged[m
[31m-[m
[31m-[33mcommit 19fe5427d1f39fc380c5dffbe7863eb27b5063e1[m[m
[31m-Author: unknown <irfan.algaeh@gmail.com>[m
[31m-Date:   Sat Jun 23 11:42:12 2018 +0530[m
[31m-[m
[31m-    added function for getting bill headder and details calculations[m
[31m-[m
[31m-[33mcommit 7a0b13a623398bf19f3ac4c98d07d8d07279553c[m[m
[31m-Author: Syed Noor <syednoor@Syeds-MacBook-Air.local>[m
[31m-Date:   Sat Jun 23 00:22:27 2018 +0530[m
[31m-[m
[31m-    Grid column setting[m
[31m-[m
[31m-[33mcommit 955c70f8f57552f2362e65e5b30c8b28700c8fab[m[m
[31m-Merge: 63cf32b 06f7d8e[m
[31m-Author: Syed Noor - Office <syednoor.algaeh@gmail.com>[m
[31m-Date:   Thu Jun 21 10:08:14 2018 +0530[m
[31m-[m
[31m-    Merged Files[m
[31m-[m
[31m-[33mcommit 63cf32b97208146ea7371c28264ab5f0e23e902d[m[m
[31m-Author: Syed Noor - Office <syednoor.algaeh@gmail.com>[m
[31m-Date:   Thu Jun 21 10:04:04 2018 +0530[m
[31m-[m
[31m-    Billing Arabic Language Changes and few functionalities done[m
[1mdiff --git a/General/package.json b/General/package.json[m
[1mdeleted file mode 100644[m
[1mindex ff4842777..000000000[m
[1m--- a/General/package.json[m
[1m+++ /dev/null[m
[36m@@ -1,39 +0,0 @@[m
[31m-{[m
[31m-  "name": "general",[m
[31m-  "version": "1.0.0",[m
[31m-  "description": "Algaeh General Module",[m
[31m-  "main": "dist",[m
[31m-  "scripts": {[m
[31m-    "general_server": "cross-env PORT=3002 NODE_ENV=development nodemon -w src --exec \"babel-node src/general_server.js \"",[m
[31m-    "build": "babel src -s -D -d dist ",[m
[31m-    "dev": "npm run general_server",[m
[31m-    "api": "npm run general_server",[m
[31m-    "lint": "eslint src && eslint test",[m
[31m-    "test": "echo \"Error: no test specified\" && exit 1",[m
[31m-    "start": "cross-env PORT=3002 NODE_ENV=production pm2 start  -i 1 general_server.js"[m
[31m-  },[m
[31m-  "dependencies": {[m
[31m-    "algaeh-mysql": "^1.1.13",[m
[31m-    "body-parser": "^1.18.2",[m
[31m-    "compression": "^1.7.3",[m
[31m-    "concurrently": "^3.5.1",[m
[31m-    "cors": "^2.8.4",[m
[31m-    "cross-env": "^5.1.4",[m
[31m-    "cryptr": "^4.0.0",[m
[31m-    "express": "^4.16.3",[m
[31m-    "winston": "^2.4.2",[m
[31m-    "winston-daily-rotate-file": "^3.1.4"[m
[31m-  },[m
[31m-  "devDependencies": {[m
[31m-    "babel-cli": "^6.26.0",[m
[31m-    "babel-core": "^6.26.0",[m
[31m-    "babel-eslint": "^8.2.3",[m
[31m-    "babel-preset-env": "^1.7.0",[m
[31m-    "babel-preset-stage-0": "^6.24.1",[m
[31m-    "eslint": "^4.19.1",[m
[31m-    "nodemon": "^1.17.3"[m
[31m-  },[m
[31m-  "keywords": [],[m
[31m-  "author": "Algaeh Technologies Pvt. Ltd.",[m
[31m-  "license": "ISC"[m
[31m-}[m
[1mdiff --git a/General/src/controllers/test.js b/General/src/controllers/test.js[m
[1mdeleted file mode 100644[m
[1mindex 088c51340..000000000[m
[1m--- a/General/src/controllers/test.js[m
[1m+++ /dev/null[m
[36m@@ -1,24 +0,0 @@[m
[31m-import { Router } from "express";[m
[31m-import utlities from "algaeh-utilities";[m
[31m-import { addItemMaster } from "../models/test";[m
[31m-[m
[31m-export default ({ config, db }) => {[m
[31m-  let api = Router();[m
[31m-[m
[31m-  // created by irfan :to get Patient Mrd List[m
[31m-  api.post([m
[31m-    "/addItemMaster",[m
[31m-    addItemMaster,[m
[31m-    (req, res, next) => {[m
[31m-      let result = req.records;[m
[31m-      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({[m
[31m-        success: true,[m
[31m-        records: result[m
[31m-      });[m
[31m-      next();[m
[31m-    },[m
[31m-    releaseConnection[m
[31m-  );[m
[31m-[m
[31m-  return api;[m
[31m-};[m
[1mdiff --git a/General/src/general_server.js b/General/src/general_server.js[m
[1mdeleted file mode 100644[m
[1mindex 470b2161c..000000000[m
[1m--- a/General/src/general_server.js[m
[1m+++ /dev/null[m
[36m@@ -1,126 +0,0 @@[m
[31m-import http from "http";[m
[31m-import cors from "cors";[m
[31m-import bodyParser from "body-parser";[m
[31m-import express from "express";[m
[31m-import keys from "algaeh-keys";[m
[31m-import utliites from "algaeh-utilities";[m
[31m-import routes from "./routes";[m
[31m-import compression from "compression";[m
[31m-const app = express();[m
[31m-app.server = http.createServer(app);[m
[31m-app.use(cors());[m
[31m-const _port = process.env.PORT;[m
[31m-app.use([m
[31m-  bodyParser.json({[m
[31m-    limit: keys.bodyLimit[m
[31m-  })[m
[31m-);[m
[31m-app.use(compression());[m
[31m-app.use((req, res, next) => {[m
[31m-  const reqH = req.headers;[m
[31m-  const _token = reqH["x-api-key"];[m
[31m-[m
[31m-  utliites[m
[31m-    .AlgaehUtilities()[m
[31m-    .logger()[m
[31m-    .log("Xapi", _token, "debug");[m
[31m-  const _verify = utliites.AlgaehUtilities().tokenVerify(_token);[m
[31m-  if (_verify) {[m
[31m-    let header = reqH["x-app-user-identity"];[m
[31m-    if (header != null && header != "" && header != "null") {[m
[31m-      header = utliites.AlgaehUtilities().decryption(header);[m
[31m-      req.userIdentity = header;[m
[31m-      let reqUser = utliites.AlgaehUtilities().getTokenData(_token).id;[m
[31m-      utliites[m
[31m-        .AlgaehUtilities()[m
[31m-        .logger("res-tracking")[m