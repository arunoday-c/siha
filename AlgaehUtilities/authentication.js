const utliites = require("./utilities");
const {userSecurity}=require("./checksecurity");
module.exports ={authentication:(req,res,next)=>{
    const reqH = req.headers;
    const _token = reqH["x-api-key"];
    const _utilis= new  utliites();
   const verify=  _utilis.tokenVerify(_token);

   if(verify){
       req.userIdentity = verify;
      const {username} = verify;

       userSecurity(reqH["x-client-ip"],username.toLowerCase())
           .then(()=>{
               res.setHeader("connection","keep-alive");
               next();
           }).catch(error=>{
           res.status(423).json({
               success: false,
               message: error,
               username: error === "false" ? undefined : username
           }).end();
           return;
       });
       _utilis.logger("res-tracking").log("",{
           dateTime: new Date().toLocaleString(),
           requestIdentity: {
               requestClient: reqH["x-client-ip"],
               reqUserIdentity: verify
           },
           requestUrl: req.originalUrl,
           requestHeader: {
               host: reqH.host,
               "user-agent": reqH["user-agent"],
               "cache-control": reqH["cache-control"],
               origin: reqH.origin
           },
           requestMethod: req.method
       },"info");
   }else{
       res.status(_utilis.httpStatus().unAuthorized).json({
           success: false,
           message: "unauthorized access"
       }).end();
   }
}};