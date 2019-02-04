#!/bin/bash
echo "--------- Algaeh node package Installation starting this will take several minutes please don't cancel / close this command ----------";
echo "---- Deleting package-lock.json ----"; del /f package-lock.json;echo "----- installing node models ----"; npm i 
 echo "------- Creating keys model and adding in to node model---------"
cd ./keys && sudo npm link && cd ..
echo "-------Inside Algaeh Utilities ---------"
cd ./AlgaehUtilities && echo " ----- deleting package-lock.json in Algaeh Utilities ---- "; del /f package-lock.json  && echo "---- installing node modules in Algaeh Utilities ----"; 
npm i && echo "---- linking Keys in Algaeh Utilities ----"; npm link algaeh-keys && echo "---- updating utilities in node modules ----"; sudo npm link &&  cd ..
cd ./DocumentManagement &&echo "---- deleting package-lock.json in Document Management ----" ; del /f package-lock.json  &&  echo "---- installing node models in Document Management ----"; npm i &&
echo "---- linking Keys in Document Management ----"; npm link algaeh-keys && cd ..
cd ./HrManagement && echo " ----- deleting package-lock.json in HR Management ---- "; del /f package-lock.json  && echo "-------installing node models in HR Management---------"; 
npm i && echo "---- linking Keys and utilities in HR Management ----"; npm link algaeh-keys algaeh-utilities && cd ..
echo "------------------------- Installation Completed -------------------------"

