#!/bin/bash

if ! hash tmux 2>/dev/null;
then
  echo "Please install tmux to use this script"
  exit 1;
fi

echo "Starting servers ..."


# installMysql() {
#   echo "installing"
#   cd $1
#   npm i algaeh-mysql@latest
#   cd ..
#   echo "done"
# }

installMysql() {
  echo "installing"
  cd $1
  npm i
  cd ..
  echo "done"
}

# installMysql() {
#   echo "installing"
#   cp --parents -v $1/build/app.js ./build
#   echo "done"
# }


installMysql "./algaeh-core" "core"
installMysql "./DocumentManagement" "document_server" 
installMysql "./HrManagement" "hr_server" 
installMysql "./FrontDesk" "front_desk_server" 
installMysql "./ClinicalDesk" "clinical" 
installMysql "./MasterSettings" "master_settings_server" 
installMysql "./Inventory" "inventory_server" 
installMysql "./Pharmacy" "pharmacy_server" 
installMysql "./Insurance" "insurance_server" 
installMysql "./Radiology" "radiology_server" 
installMysql "./Laboratory" "lab_server" 
installMysql "./Billing" "billing_server" 
installMysql "./MRD" "mrd_server" 
installMysql "./Procurement" "procurement_server"
installMysql "./AlgaehReporting" "report_server"
installMysql "./algaeh-finance" "finance"  
installMysql "./Sales" "sales"  
#add additional servers here if you want

echo "HINT: use the command 'tmux ls' to view the running servers,
\t use 'tmux attach -t server_name' to view logs,
\t use 'tmux kill-server to close all the servers'"
