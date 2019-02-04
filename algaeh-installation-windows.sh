#!/bin/bash
echo "--------- Algaeh node package Installation starting this will take several minutes please don't cancel / close this command ----------";
echo "---- Deleting package-lock.json ----"; rm -f "package-lock.json";echo "----- installing node modules ----"; npm i 
 echo "------- Creating keys model and adding in to node model---------"
cd ./keys &&  npm link && cd ..
echo "-------Inside Algaeh Utilities ---------"
cd ./AlgaehUtilities && echo " ----- deleting package-lock.json in Algaeh Utilities ---- "; rm -f "package-lock.json"  && echo "---- installing node modules in Algaeh Utilities ----"; 
npm i && echo "---- linking Keys in Algaeh Utilities ----"; npm link algaeh-keys && echo "---- updating utilities in node modules ----";  npm link &&  cd ..
cd ./DocumentManagement &&echo "---- deleting package-lock.json in Document Management ----" ; rm -f "package-lock.json"  &&  echo "---- installing node modules in Document Management ----"; npm i &&
echo "---- linking Keys in Document Management ----"; npm link algaeh-keys && cd ..

cd ./HrManagement && echo " ----- deleting package-lock.json in HR Management ---- "; rm -f "package-lock.json"  && echo "-------installing node modules in HR Management---------"; 
npm i && echo "---- linking Keys and utilities in HR Management ----"; npm link algaeh-keys algaeh-utilities && cd ..

cd ./MRD && echo " ----- deleting package-lock.json in MRD ---- "; rm -f "package-lock.json"  && echo "-------installing node modules in MRD---------"; 
npm i && echo "---- linking Keys and utilities in MRD ----"; npm link algaeh-keys algaeh-utilities && cd ..

echo "------------------------- Installation Completed -------------------------"

