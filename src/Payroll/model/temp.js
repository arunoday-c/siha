
loadManualTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();
  
    try {
    
  
      let input = req.query;
  
      if (input.hospital_id >0&&input.employee_id>0&&input.from_date!=undefined&&input.to_date!=undefined) {
      
      
  

  
      _mysql
        .executeQuery({
          query: `select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id,TS.biometric_id, TS.attendance_date, \
          in_time, out_date, out_time, year, month, status,\
           posted, hours, minutes, actual_hours, actual_minutes, worked_hours,consider_ot_shrtg,\
           expected_out_date, expected_out_time ,TS.hospital_id,hims_d_employee_id,employee_code,full_name as employee_name,\
           P.project_code,P.project_desc from  hims_f_daily_time_sheet TS \
          inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
          left join hims_f_project_roster PR on TS.employee_id=PR.employee_id and TS.hospital_id=PR.hospital_id  and TS.attendance_date=PR.attendance_date
          left join hims_d_project P on PR.project_id=P.hims_d_project_id
          where  TS.hospital_id=? and  TS.attendance_date between (?) and (?) and TS.employee_id =?; `,
          values: [input.hospital_id,input.from_date,input.to_date,input.employee_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
  
      }else{
  
        req.records = { invalid_input:true,message:"Please send valid input"};
        next();
  
      }
    } catch (e) {
      next(e);
    }
  }