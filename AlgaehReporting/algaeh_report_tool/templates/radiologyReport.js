const executePDF = function executePDFMethod(options) {
    return new Promise(function(resolve, reject) {
        try{
          const data =  options.result;
        
          //{"header":${JSON.stringify(data[1][0])}, "result":${JSON.stringify(result)}}
          resolve({
            // header:data[1][0],
            result:data
          })
        }
        catch(e){
            reject(e);
        }
    });
}
module.exports = { executePDF };