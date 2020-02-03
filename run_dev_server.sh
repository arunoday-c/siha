#!/bin/bash

if ! hash tmux 2>/dev/null;
then
  echo "Please install tmux to use this script"
  exit 1;
fi

echo "Starting servers ..."

startServer () {
  echo "change into $1"
  cd $1
  echo "starting server $2"
  tmux new-session -d -s $2 "npm run dev"
  cd ..
  echo "$2 started"
}

# installMysql() {
#   echo "installing"
#   cd $1
#   npm i algaeh-mysql@latest
#   cd ..
#   echo "done"
# }

startServer "./algaeh-core" "core"
startServer "./DocumentManagement" "document_server"
#startServer "./HrManagement" "hr_server"
 startServer "./FrontDesk" "front_desk_server"
startServer "./MasterSettings" "master_settings_server" 
#  startServer "./Inventory" "inventory_server" 
#  startServer "./Pharmacy" "pharmacy_server" 
#  startServer "./Insurance" "insurance_server" 
#  startServer "./Radiology" "radiology_server" 
#  startServer "./Laboratory" "lab_server"
 startServer "./Billing" "billing_server"
 startServer "./MRD" "mrd_server"
#  startServer "./Procurement" "procurement_server"
 #startServer "./AlgaehReporting" "report_server"
#  startServer "./Sockets" "sockets"
startServer "./client" "client"
startServer "./algaeh-finance" "finance" 
#  startServer "./Sales" "sales"

# installMysql "./algaeh-core" "core"
# installMysql "./DocumentManagement" "document_server" 
# installMysql "./HrManagement" "hr_server" 
# installMysql "./FrontDesk" "front_desk_server" 
# installMysql "./MasterSettings" "master_settings_server" 
# installMysql "./Inventory" "inventory_server" 
# installMysql "./Pharmacy" "pharmacy_server" 
# installMysql "./Insurance" "insurance_server" 
# installMysql "./Radiology" "radiology_server" 
# installMysql "./Laboratory" "lab_server" 
# installMysql "./Billing" "billing_server" 
# installMysql "./MRD" "mrd_server" 
# installMysql "./Procurement" "procurement_server"
# installMysql "./AlgaehReporting" "report_server"
# installMysql "./algaeh-finance" "finance"  
# installMysql "./Sales" "sales"  
#add additional servers here if you want

echo "HINT: use the command 'tmux ls' to view the running servers,
\t use 'tmux attach -t server_name' to view logs,
\t use 'tmux kill-server to close all the servers'"
