//created by irfan: to get Doctor Schedule Date Wise
let getDoctorScheduleDateWise = (req, res, next) => {
  let selectWhere = {
    sub_dept_id: "ALL",
    schedule_date: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let selectDoctor = "";
    // let provider_id = "";
    if (req.query.provider_id != "null" && req.query.provider_id != null) {
      selectDoctor = `ASD.provider_id=${req.query.provider_id} and `;
      //provider_id = req.query.provider_id;
    }
    delete req.query.provider_id;

    let where = whereCondition(extend(selectWhere, req.query));

    debugLog("where:", where);
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_schedule_header_id, sub_dept_id,SD.sub_department_name, SH.schedule_status as schedule_status, schedule_description, month, year,\
          from_date,to_date,from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
          to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday,\
           hims_d_appointment_schedule_detail_id, ASD.provider_id,E.full_name as doctor_name,clinic_id,C.description as clinic_name,R.description as  room_name,\
           ASD.schedule_status as todays_schedule_status, slot,schedule_date, modified \
           from hims_d_appointment_schedule_header SH, hims_d_appointment_schedule_detail ASD,hims_d_employee E ,\
           hims_d_appointment_clinic C,hims_d_appointment_room R,hims_d_sub_department SD where \
           SH.record_status='A' and E.record_status='A' and C.record_status='A' and  SD.record_status='A'\
       and ASD.record_status='A' and R.record_status='A' and ASD.provider_id=E.hims_d_employee_id and \
           SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id \
           and ASD.clinic_id=C.hims_d_appointment_clinic_id and C.room_id=R.hims_d_appointment_room_id \
            and sub_dept_id= SD.hims_d_sub_department_id  and " +
          selectDoctor +
          "" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            new Promise((resolve, reject) => {
              try {
                for (let j = 0; j < result.length; j++) {
                  if (result[j]["modified"] == "M") {
                    connection.query(
                      "select hims_d_appointment_schedule_modify_id, appointment_schedule_detail_id, ASM.to_date as schedule_date, ASM.slot, ASM.from_work_hr,\
                  ASM.to_work_hr, ASM.work_break1, ASM.from_break_hr1,ASM.to_break_hr1, ASM.work_break2, ASM.from_break_hr2, ASM.to_break_hr2  \
                  hims_d_appointment_schedule_header_id, sub_dept_id,SD.sub_department_name, SH.schedule_status, schedule_description, month, year,  \
                 monday, tuesday, wednesday, thursday, friday, saturday, sunday, ASD.provider_id,E.full_name as doctor_name,clinic_id,C.description as clinic_name,R.description as  room_name,\
                  ASD.schedule_status as todays_schedule_status, modified\
                 from hims_d_appointment_schedule_header SH,hims_d_appointment_schedule_modify ASM , hims_d_appointment_schedule_detail ASD,hims_d_employee E, hims_d_appointment_clinic C,hims_d_appointment_room R,\
                 hims_d_sub_department SD  where SH.record_status='A' and E.record_status='A' \
                 and ASD.record_status='A' and C.record_status='A' and SD.record_status='A' and R.record_status='A'and ASD.provider_id=E.hims_d_employee_id and  SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id  \
                 and ASM.appointment_schedule_detail_id=ASD.hims_d_appointment_schedule_detail_id and ASM.record_status='A'\
                 and ASD.clinic_id=C.hims_d_appointment_clinic_id and C.room_id=R.hims_d_appointment_room_id and C.sub_department_id=SD.hims_d_sub_department_id and appointment_schedule_detail_id=?",
                      [result[j]["hims_d_appointment_schedule_detail_id"]],
                      (error, modifyResult) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        result[j] = modifyResult[0];
                      }
                    );
                  }
                  if (j == result.length - 1) {
                    resolve({});
                  }
                }
              } catch (e) {
                reject(e);
              }
            }).then(modifyRes => {
              let outputArray = [];
              if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                  connection.query(
                    "select hims_f_patient_appointment_id, patient_id, title_id, patient_code, provider_id, sub_department_id,number_of_slot, appointment_date, appointment_from_time,\
      appointment_to_time, appointment_status_id, patient_name, arabic_name, date_of_birth, age, contact_number, email, send_to_provider,\
      gender, confirmed, confirmed_by,comfirmed_date, cancelled, cancelled_by, cancelled_date, cancel_reason,\
      appointment_remarks, visit_created,is_stand_by  from hims_f_patient_appointment where record_status='A' and   cancelled<>'Y' and sub_department_id=?\
      and appointment_date=? and provider_id=? ",
                    [
                      result[i].sub_dept_id,
                      result[i].schedule_date,
                      result[i].provider_id
                    ],
                    (error, appResult) => {
                      if (error) {
                        releaseDBConnection(db, connection);
                        next(error);
                      }
                      const obj = {
                        ...result[i],
                        ...{ patientList: appResult }
                      };

                      outputArray.push(obj);
                      if (i == result.length - 1) {
                        req.records = outputArray;
                        releaseDBConnection(db, connection);
                        next();
                      }
                    }
                  );
                }
              } else {
                releaseDBConnection(db, connection);
                req.records = result;
                next();
              }
            });
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
