import extend from 'extend';
import moment from 'moment';

export default 
{ 
    
    visitinputParam : function(param,isSend)   {
        param = param||null;
        isSend =isSend||false;

        var output;
        var CurrentDate = new Date();        
        
        output = extend({            
            department_id: 0,
            sub_department_id: 0,
            visit_date: 0,
            visit_type:0,
            
        },param);
        return output;
    }
}