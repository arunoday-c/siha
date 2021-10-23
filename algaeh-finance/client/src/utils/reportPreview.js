export function previewReport(options, initialResult, cb) {
  const { reportTitle, data } = options;
  const { report } = data;
  const myWindow = window.open(reportTitle, "_blank", "resizable=yes");

  myWindow.document.write(
    `${initialResult} <script>
          let recordsPerPage = document.querySelector("table").querySelector("tbody")?.rows?.length; 
          document.title = "${reportTitle}";
          const totalRecords = parseInt(document.getElementById("total_records").innerText);
          window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
            var db;
          document.querySelector(".print-body").addEventListener("scroll",(e)=>{
           
            const totalBodyHeight = document.querySelector(".print-body").scrollHeight;            //document.body.scrollHeight;
            if((e.target.scrollTop+e.target.offsetHeight) < totalBodyHeight){
              return;
            }
            const rowsExistCount = document.querySelector("table").querySelector("tbody")?.rows?.length;
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
           const checkLoading = document.getElementById("pleaseWait");
           if(checkLoading){
             return;
           }

           const waitElement = document.createElement("div");
           waitElement.setAttribute("id","pleaseWait");
           waitElement.innerText ="Please Wait...";
          document.body.append(waitElement);
           customerObjectStore.onsuccess = function(event){
             if(customerObjectStore.result){
              const token = customerObjectStore.result;
              const resultdata = {
                report:JSON.stringify({
                    displayName:"${report.displayName}",
                    reportName:"${report.reportName}",
                    pageSize:"A4",
                    pageOrentation:"portrait",
                    recordSetup:{
                        limit_from:recordsPerPage,
                        limit_to:rowsExistCount
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
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
              //  document.body.append(doc);
              const rows = doc.querySelector("tbody").rows;
                for(let x=0;x<rows.length;x++){
                   document.querySelector("table").querySelector("tbody").append(rows[x]);
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
