
import moment from 'moment';
import extend from 'extend';

export default{isDateFormat:isDateFormat};

function isDateFormat(options,isSend)
{
    debugger;
    isSend = isSend||false;
    var returnString ="";
    var defOpt= defaultOptions();
    var settings = extend({
        date:null,
        isTime:false,
        usedefaultFarmats:true,
        format:!isSend ? defOpt.clientDateFormat:defOpt.serverDateFromat,
        existFormat:!isSend ? defOpt.serverDateFromat:defOpt.clientDateFormat
    },options);
  if(settings.isTime && settings.usedefaultFarmats){
        settings.format =!isSend ? defOpt.ClientTimeFormat:defOpt.serverTimeFormat;
        settings.existFormat =!isSend ? defOpt.ClientTimeFormat:defOpt.serverTimeFormat;
    }
  if(settings.date !== null && settings.date !== ""){
     var dateasString=  String(settings.date);
     if(dateasString !== "0"){
        returnString = moment(settings.date,settings.existFormat).format(settings.format);
     }
  }

return returnString;

}



function defaultOptions(){
    var output= {
       clientDateFormat:"YYYY-MM-DD",
       ClientTimeFormat:"HH:MM",
       serverDateFromat:"YYYY-MM-DD",
       serverTimeFormat:"HH:MM:SS"
    }
    return output;
}
