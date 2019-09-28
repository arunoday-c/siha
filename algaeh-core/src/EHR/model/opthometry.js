import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
const keyPath = require("algaeh-keys/keys");

let addGlassPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_f_glass_prescription (patient_id,visit_id,provider_id,hospital_id,prescription_date,pgp_power_right_odsph,\
            pgp_power_right_odcyl,pgp_power_right_odaxis,pgp_power_right_odadd,pgp_power_right_ossph,pgp_power_right_oscyl,\
            pgp_power_right_osaxis,pgp_power_right_osadd,pgp_power_left_odsph,pgp_power_left_odcyl,pgp_power_left_odaxis,\
            pgp_power_left_odadd,pgp_power_left_ossph,pgp_power_left_oscyl,pgp_power_left_osaxis,pgp_power_left_osadd,\
            cva_specs,cva_dv_right,cva_dv_left,cva_nv_right,cva_nv_left,auto_ref_right_sch,auto_ref_right_cyl,\
            auto_ref_right_axis,auto_ref_left_sch,auto_ref_left_cyl,auto_ref_left_axis,bcva_dv_right_sch,bcva_dv_right_cyl,\
            bcva_dv_right_axis,bcva_dv_right_vision,bcva_nv_right_sch,bcva_nv_right_cyl,bcva_nv_right_axis,bcva_nv_right_vision,\
            bcva_dv_left_sch,bcva_dv_left_cyl,bcva_dv_left_axis,bcva_dv_left_vision,bcva_nv_left_sch,bcva_nv_left_cyl,bcva_nv_left_axis,\
            bcva_nv_left_vision,k1_right,k2_right,axis_right,k1_left,k2_left,axis_left,bcva_dv_right_prism,bcva_dv_right_bc,bcva_dv_right_dia,\
            bcva_nv_right_prism,bcva_nv_right_bc,bcva_nv_right_dia,bcva_dv_left_prism,bcva_dv_left_bc,bcva_dv_left_dia,bcva_nv_left_prism,\
            bcva_nv_left_bc,bcva_nv_left_dia,pachy_right,pachy_left,w_wcs_right,w_wcs_left,ac_depth_right,ac_depth_left,ipd_right,\
            ipd_left,color_vision_wnl_right,color_vision_wnl_left,confrontation_fields_full_right,confrontation_fields_full_left,\
            pupils_errl_right,pupils_errl_left,cover_test_ortho_right,cover_test_ortho_left,covergence,safe_fesa,\
            multi_coated,varilux,light,aspheric,\
            bifocal,medium,lenticular,single_vision,dark,\
            safety_thickness,anti_reflecting_coating,photosensitive,\
            high_index,colored,anti_scratch,cl_type,remarks)\
                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.patient_id,
          input.visit_id,
          input.provider_id,

          req.userIdentity.hospital_id,
          input.prescription_date,
          input.pgp_power_right_odsph,
          input.pgp_power_right_odcyl,
          input.pgp_power_right_odaxis,
          input.pgp_power_right_odadd,
          input.pgp_power_right_ossph,
          input.pgp_power_right_oscyl,
          input.pgp_power_right_osaxis,
          input.pgp_power_right_osadd,
          input.pgp_power_left_odsph,
          input.pgp_power_left_odcyl,
          input.pgp_power_left_odaxis,
          input.pgp_power_left_odadd,
          input.pgp_power_left_ossph,
          input.pgp_power_left_oscyl,
          input.pgp_power_left_osaxis,
          input.pgp_power_left_osadd,
          input.cva_specs,
          input.cva_dv_right,
          input.cva_dv_left,
          input.cva_nv_right,
          input.cva_nv_left,
          input.auto_ref_right_sch,
          input.auto_ref_right_cyl,
          input.auto_ref_right_axis,
          input.auto_ref_left_sch,
          input.auto_ref_left_cyl,
          input.auto_ref_left_axis,
          input.bcva_dv_right_sch,
          input.bcva_dv_right_cyl,
          input.bcva_dv_right_axis,
          input.bcva_dv_right_vision,
          input.bcva_nv_right_sch,
          input.bcva_nv_right_cyl,
          input.bcva_nv_right_axis,
          input.bcva_nv_right_vision,
          input.bcva_dv_left_sch,
          input.bcva_dv_left_cyl,
          input.bcva_dv_left_axis,
          input.bcva_dv_left_vision,
          input.bcva_nv_left_sch,
          input.bcva_nv_left_cyl,
          input.bcva_nv_left_axis,
          input.bcva_nv_left_vision,
          input.k1_right,
          input.k2_right,
          input.axis_right,
          input.k1_left,
          input.k2_left,
          input.axis_left,
          input.bcva_dv_right_prism,
          input.bcva_dv_right_bc,
          input.bcva_dv_right_dia,
          input.bcva_nv_right_prism,
          input.bcva_nv_right_bc,
          input.bcva_nv_right_dia,
          input.bcva_dv_left_prism,
          input.bcva_dv_left_bc,
          input.bcva_dv_left_dia,
          input.bcva_nv_left_prism,
          input.bcva_nv_left_bc,
          input.bcva_nv_left_dia,
          input.pachy_right,
          input.pachy_left,
          input.w_wcs_right,
          input.w_wcs_left,
          input.ac_depth_right,
          input.ac_depth_left,
          input.ipd_right,
          input.ipd_left,
          input.color_vision_wnl_right,
          input.color_vision_wnl_left,
          input.confrontation_fields_full_right,
          input.confrontation_fields_full_left,
          input.pupils_errl_right,
          input.pupils_errl_left,
          input.cover_test_ortho_right,
          input.cover_test_ortho_left,
          input.covergence,
          input.safe_fesa,
          input.multi_coated,
          input.varilux,
          input.light,
          input.aspheric,
          input.bifocal,
          input.medium,
          input.lenticular,
          input.single_vision,
          input.dark,
          input.safety_thickness,
          input.anti_reflecting_coating,
          input.photosensitive,
          input.high_index,
          input.colored,
          input.anti_scratch,
          input.cl_type,
          input.remarks
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getGlassPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let str_qry = "";

  if (req.query.hims_f_glass_prescription_id > 0) {
    str_qry += ` and hims_f_glass_prescription_id=${
      req.query.hims_f_glass_prescription_id
    }`;
  }

  if (req.query.patient_id > 0) {
    str_qry += ` and patient_id=${req.query.patient_id}`;
  }

  if (req.query.visit_id > 0) {
    str_qry += ` and visit_id=${req.query.visit_id}`;
  }

  try {
    _mysql
      .executeQuery({
        query: `select hims_f_glass_prescription_id,patient_id,visit_id,provider_id,prescription_date,pgp_power_right_odsph,\
            pgp_power_right_odcyl,pgp_power_right_odaxis,pgp_power_right_odadd,pgp_power_right_ossph,pgp_power_right_oscyl,\
            pgp_power_right_osaxis,pgp_power_right_osadd,pgp_power_left_odsph,pgp_power_left_odcyl,pgp_power_left_odaxis,\
            pgp_power_left_odadd,pgp_power_left_ossph,pgp_power_left_oscyl,pgp_power_left_osaxis,pgp_power_left_osadd,\
            cva_specs,cva_dv_right,cva_dv_left,cva_nv_right,cva_nv_left,auto_ref_right_sch,auto_ref_right_cyl,\
            auto_ref_right_axis,auto_ref_left_sch,auto_ref_left_cyl,auto_ref_left_axis,bcva_dv_right_sch,bcva_dv_right_cyl,\
            bcva_dv_right_axis,bcva_dv_right_vision,bcva_nv_right_sch,bcva_nv_right_cyl,bcva_nv_right_axis,bcva_nv_right_vision,\
            bcva_dv_left_sch,bcva_dv_left_cyl,bcva_dv_left_axis,bcva_dv_left_vision,bcva_nv_left_sch,bcva_nv_left_cyl,bcva_nv_left_axis,\
            bcva_nv_left_vision,k1_right,k2_right,axis_right,k1_left,k2_left,axis_left,bcva_dv_right_prism,bcva_dv_right_bc,bcva_dv_right_dia,\
            bcva_nv_right_prism,bcva_nv_right_bc,bcva_nv_right_dia,bcva_dv_left_prism,bcva_dv_left_bc,bcva_dv_left_dia,bcva_nv_left_prism,\
            bcva_nv_left_bc,bcva_nv_left_dia,pachy_right,pachy_left,w_wcs_right,w_wcs_left,ac_depth_right,ac_depth_left,ipd_right,\
            ipd_left,color_vision_wnl_right,color_vision_wnl_left,confrontation_fields_full_right,confrontation_fields_full_left,\
            pupils_errl_right,pupils_errl_left,cover_test_ortho_right,cover_test_ortho_left,covergence,safe_fesa,\
            multi_coated,varilux,light,aspheric,\
            bifocal,medium,lenticular,single_vision,dark,\
            safety_thickness,anti_reflecting_coating,photosensitive,\
            high_index,colored,anti_scratch,cl_type,remarks from hims_f_glass_prescription where hospital_id=? ${str_qry} `,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let updateGlassPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    if (input.hims_f_glass_prescription_id > 0) {
      _mysql
        .executeQuery({
          query:
            "update hims_f_glass_prescription set pgp_power_right_odsph=?,pgp_power_right_odcyl=?,\
          pgp_power_right_odaxis=?,pgp_power_right_odadd=?,pgp_power_right_ossph=?,\
          pgp_power_right_oscyl=?,pgp_power_right_osaxis=?,\
          pgp_power_right_osadd=?,pgp_power_left_odsph=?,pgp_power_left_odcyl=?,pgp_power_left_odaxis=?,\
          pgp_power_left_odadd=?,pgp_power_left_ossph=?,pgp_power_left_oscyl=?,pgp_power_left_osaxis=?,\
          pgp_power_left_osadd=?,cva_specs=?,cva_dv_right=?,cva_dv_left=?,cva_nv_right=?,cva_nv_left=?,\
          auto_ref_right_sch=?,auto_ref_right_cyl=?,auto_ref_right_axis=?,auto_ref_left_sch=?,\
          auto_ref_left_cyl=?,auto_ref_left_axis=?,bcva_dv_right_sch=?,bcva_dv_right_cyl=?,bcva_dv_right_axis=?,\
          bcva_dv_right_vision=?,bcva_nv_right_sch=?,bcva_nv_right_cyl=?,bcva_nv_right_axis=?,\
          bcva_nv_right_vision=?,bcva_dv_left_sch=?,bcva_dv_left_cyl=?,bcva_dv_left_axis=?,\
          bcva_dv_left_vision=?,bcva_nv_left_sch=?,bcva_nv_left_cyl=?,bcva_nv_left_axis=?,bcva_nv_left_vision=?,\
          k1_right=?,k2_right=?,axis_right=?,k1_left=?,k2_left=?,axis_left=?,bcva_dv_right_prism=?,\
          bcva_dv_right_bc=?,bcva_dv_right_dia=?,bcva_nv_right_prism=?,bcva_nv_right_bc=?,\
          bcva_nv_right_dia=?,bcva_dv_left_prism=?,bcva_dv_left_bc=?,bcva_dv_left_dia=?,\
          bcva_nv_left_prism=?,bcva_nv_left_bc=?,bcva_nv_left_dia=?,pachy_right=?,pachy_left=?,\
          w_wcs_right=?,w_wcs_left=?,ac_depth_right=?,ac_depth_left=?,ipd_right=?,ipd_left=?,\
          color_vision_wnl_right=?,color_vision_wnl_left=?,confrontation_fields_full_right=?,\
          confrontation_fields_full_left=?,pupils_errl_right=?,pupils_errl_left=?,cover_test_ortho_right=?,\
          cover_test_ortho_left=?,covergence=?,safe_fesa=?,`multi_coated`=?,`varilux`=?,`light`=?,`aspheric`=?,\
          `bifocal`=?, `medium`=?, `lenticular`=?, `single_vision`=?, `dark`=?,\
          `safety_thickness`=?, `anti_reflecting_coating`=?, `photosensitive`=?,\
          `high_index`=?, `colored`=?, `anti_scratch`=?,cl_type=?,remarks=? where hims_f_glass_prescription_id=? ",
          values: [
            input.pgp_power_right_odsph,
            input.pgp_power_right_odcyl,
            input.pgp_power_right_odaxis,
            input.pgp_power_right_odadd,
            input.pgp_power_right_ossph,
            input.pgp_power_right_oscyl,
            input.pgp_power_right_osaxis,
            input.pgp_power_right_osadd,
            input.pgp_power_left_odsph,
            input.pgp_power_left_odcyl,
            input.pgp_power_left_odaxis,
            input.pgp_power_left_odadd,
            input.pgp_power_left_ossph,
            input.pgp_power_left_oscyl,
            input.pgp_power_left_osaxis,
            input.pgp_power_left_osadd,
            input.cva_specs,
            input.cva_dv_right,
            input.cva_dv_left,
            input.cva_nv_right,
            input.cva_nv_left,
            input.auto_ref_right_sch,
            input.auto_ref_right_cyl,
            input.auto_ref_right_axis,
            input.auto_ref_left_sch,
            input.auto_ref_left_cyl,
            input.auto_ref_left_axis,
            input.bcva_dv_right_sch,
            input.bcva_dv_right_cyl,
            input.bcva_dv_right_axis,
            input.bcva_dv_right_vision,
            input.bcva_nv_right_sch,
            input.bcva_nv_right_cyl,
            input.bcva_nv_right_axis,
            input.bcva_nv_right_vision,
            input.bcva_dv_left_sch,
            input.bcva_dv_left_cyl,
            input.bcva_dv_left_axis,
            input.bcva_dv_left_vision,
            input.bcva_nv_left_sch,
            input.bcva_nv_left_cyl,
            input.bcva_nv_left_axis,
            input.bcva_nv_left_vision,
            input.k1_right,
            input.k2_right,
            input.axis_right,
            input.k1_left,
            input.k2_left,
            input.axis_left,
            input.bcva_dv_right_prism,
            input.bcva_dv_right_bc,
            input.bcva_dv_right_dia,
            input.bcva_nv_right_prism,
            input.bcva_nv_right_bc,
            input.bcva_nv_right_dia,
            input.bcva_dv_left_prism,
            input.bcva_dv_left_bc,
            input.bcva_dv_left_dia,
            input.bcva_nv_left_prism,
            input.bcva_nv_left_bc,
            input.bcva_nv_left_dia,
            input.pachy_right,
            input.pachy_left,
            input.w_wcs_right,
            input.w_wcs_left,
            input.ac_depth_right,
            input.ac_depth_left,
            input.ipd_right,
            input.ipd_left,
            input.color_vision_wnl_right,
            input.color_vision_wnl_left,
            input.confrontation_fields_full_right,
            input.confrontation_fields_full_left,
            input.pupils_errl_right,
            input.pupils_errl_left,
            input.cover_test_ortho_right,
            input.cover_test_ortho_left,
            input.covergence,
            input.safe_fesa,
            input.multi_coated,
            input.varilux,
            input.light,
            input.aspheric,
            input.bifocal,
            input.medium,
            input.lenticular,
            input.single_vision,
            input.dark,
            input.safety_thickness,
            input.anti_reflecting_coating,
            input.photosensitive,
            input.high_index,
            input.colored,
            input.anti_scratch,
            input.cl_type,
            input.remarks,
            input.hims_f_glass_prescription_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please send valid glass_prescription id"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};

let deleteGlassPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    if (input.hims_f_glass_prescription_id > 0) {
      _mysql
        .executeQuery({
          query:
            "delete from hims_f_glass_prescription where hims_f_glass_prescription_id=?",
          values: [input.hims_f_glass_prescription_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please send valid glass_prescription id"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};

export default {
  addGlassPrescription,
  getGlassPrescription,
  updateGlassPrescription,
  deleteGlassPrescription
};
