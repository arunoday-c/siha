const style = `<style type="text/css">
.print-body{
     height:95vh;overflow:auto;
     box-shadow:0 4px 5px #ccc;
}
.tableFixHead          { overflow: auto; height: 100px;}
.tableFixHead thead th { position: sticky; top: 0; z-index: 1; background:#eee;}
.tableFixHead tfoot td { background:#eee;}
#pleaseWait{
    position: sticky; bottom: 20px; z-index: 1 ; width: 100%; 
    padding: 4px 0;
    text-align: center;
    font-weight: bold;
}
#pagination{
    position: sticky; bottom:0; z-index: 1;
  display: inline-block;
  margin:0  auto;
  width: 100%;
  text-align: center;
  vertical-align:middle;
  align-items: center;
  display: none;
}
#pagination a,#pagination input {
  color: black;
  display: inline-block;
  padding: 8px 16px;
  text-decoration: none;
  border: 1px solid #ddd;
}
#pagination input {
    width: 50px;
    height: 30px;
    padding-left: 4px;
    padding-right:4px;
    text-align: center;
    font-size: 11px;
}

#pagination a.active {
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
}

#pagination a:hover:not(.active) {background-color: #ddd;}

#pagination a:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

#pagination a:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
 
}


#total_records{
    display: none;
}
#rows_per_page{
    display: none;
}


</style>`;
export function previewReport(options, initialResult, cb) {
  const { reportTitle, data } = options;
  const { report } = data;
  const myWindow = window.open(reportTitle, "_blank", "resizable=yes");
  myWindow.document.write(
    `${style}${initialResult} <script>
          let recordsPerPage = parseInt(document.getElementById("rows_per_page").innerText); 
          document.title = "${reportTitle}";
          const totalRecords = parseInt(document.getElementById("total_records").innerText);
          window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
            var db;
          document.querySelector(".print-body").addEventListener("scroll",(e)=>{
           
            const checkLoading = document.getElementById("pleaseWait");
            if(checkLoading){
              return;
            }
            const totalBodyHeight = document.querySelector(".print-body").scrollHeight;            //document.body.scrollHeight;
            if((e.target.scrollTop+e.target.offsetHeight) < totalBodyHeight){
              return;
            }
            const rowsExistCount = document.querySelector("tbody").querySelectorAll("tr:not(.no_count)").length;
            if(rowsExistCount >= totalRecords){
              return;
            }
           
            
          var request = window.indexedDB.open("localforage");
          request.onerror = function(event) {
            console.log("Why didn't you allow my web app to use IndexedDB?!");
          };
          request.onsuccess = function(event) {
            db = event.target.result;
            var customerObjectStore = db.transaction("keyvaluepairs").objectStore("keyvaluepairs").get("token");
            customerObjectStore.onerror = function(event) {
              console.error("Unable to retrieve daa from database!");
           };
          

           const waitElement = document.createElement("div");
           waitElement.setAttribute("id","pleaseWait");
           waitElement.innerText ="Please Wait your report is loading...";
          document.body.append(waitElement);
           customerObjectStore.onsuccess = function(event){
             if(customerObjectStore.result){
              const token = customerObjectStore.result;
             let others=undefined;
             const rptArray=[${report.lastRecord}];
             console.log("rptArray=====>",rptArray);
            
              if(rptArray.length>0){
                others={};
                  for(let c=0;c<rptArray.length;c++){
                    
                  const counter =  document.querySelector("tbody").querySelectorAll("tr:not(.no_count)").length;
                  others[String(rptArray[c])]=document.querySelector("tbody").querySelectorAll("tr:not(.no_count)")[counter-1].cells[rptArray[c]].innerText;
                  }
              }
              const resultdata = {
                report:JSON.stringify({
                    displayName:"${report.displayName}",
                    reportName:"${report.reportName}",
                    pageSize:"A4",
                    pageOrentation:"portrait",
                    recordSetup:{
                        limit_from:document.querySelector("tbody").querySelectorAll("tr:not(.no_count)").length,//rowsExistCount,
                        limit_to:recordsPerPage,
                        others
                    },
                    reportParams:${JSON.stringify(report.reportParams)}
                })
              };
              function serialize(obj, prefix) {
                var str = [],
                  p;
                for (p in obj) {
                  if(obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                      v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                      serialize(v, k) :
                      encodeURIComponent(k) + "=" + encodeURIComponent(v));
                  }
                }
                return str.join("&");
              }
               const qry = serialize(resultdata);
               let url ="";
               if(window.location.port===""){
                 url = window.location.protocol+"//"+window.location.hostname+"/reports";
               }else{
                url = window.location.protocol+"//"+window.location.hostname+":3018";
               }
               fetch(url+'/api/v1/getRawReport?'+qry,{
                method: 'GET',
                headers:{
                 "x-api-key":token,
                 "x-client-ip":${window.localStorage.getItem("identity")}
                },
               
               }).then((response)=>{
                return response.text();
               }).then((html)=>{
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
              
              const tableBody = doc.querySelector("table").cloneNode(true).querySelector("tbody").querySelectorAll("tr");
              
             for(let tb=0;tb<tableBody.length;tb++){
                document.getElementById("main_table").querySelector("tbody").append(tableBody[tb].cloneNode(true));
             }
             
               })
               .catch(error=>{
                 console.error("Error ====>",error);
               }).finally(()=>{
               document.body.removeChild(document.getElementById("pleaseWait"));
               });
             }else{
               console.error("Some error occurred");
             }
           }
          };
          });
          </script>`
  );
  cb();
}
