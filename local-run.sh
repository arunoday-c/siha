#!/bin/bash
echo "Starting server from parent"

if ! hash tmux 2>/dev/null;
then exit 1;
fi

startServer () {
  echo "change into $1"
  cd $1
  echo "starting server $2"
  tmux new-session -d -s $2 "npm run dev"
  if [ $1 != "." ]
  then
    cd ..
    echo "$2 started"
  fi
}

startServer "." "internal_server"
startServer "./DocumentManagement" "document_server" 
startServer "./HrManagement" "hr_server" 
startServer "./FrontDesk" "front_desk_server" 
startServer "./MasterSettings" "master_settings_server" 
startServer "./Inventory" "inventory_server" 
startServer "./Pharmacy" "pharmacy_server" 
startServer "./Insurance" "insurance_server" 
startServer "./Radiology" "radiology_server" 
startServer "./Laboratory" "lab_server" 
startServer "./Billing" "billing_server" 
startServer "./MRD" "mrd_server" 
startServer "./Procurement" "procurement_server"
startServer "./AlgaehReporting" "report_server"