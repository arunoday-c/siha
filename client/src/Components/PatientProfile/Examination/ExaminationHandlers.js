import algaehLoader from "../../Wrapper/fullPageLoader";
import Enumerable from "linq";
const getAllDepartmentBased = ($this, callBack) => {
  $this.props.getAllDepartmentBased({
    uri: "/doctorsWorkBench/getPhysicalExamination/getAllDepartmentBased",
    method: "GET",
    cancelRequestId: "getAllDepartmentBased",
    redux: {
      type: "ALL_EXAMINATIONS_DEPT_BASED",
      mappingName: "allexaminations"
    },
    afterSuccess: data => {
      // const detl = getPhysicalExaminationOnSpecility({
      //   data: data,
      //   examType: $this.state.examType
      // });

      $this.setState({
        depaertmentBasedSpecility: data
      });

      if (typeof callBack === "function") callBack();
    }
  });
};
const getPhysicalExaminationOnSpecility = options => {
  return Enumerable.from(options.data)
    .where(w => w.examination_type === options.examType)
    .groupBy("$.hims_d_physical_examination_header_id", null, (k, g) => {
      const source = Enumerable.from(g.getSource())
        .where(w => w.hims_d_physical_examination_header_id === k)
        .firstOrDefault();
      return {
        header_description: source.description,
        hims_d_physical_examination_header_id: k
      };
    })
    .toArray();

  // let array = Enumerable.from(options.data)
  //   .where(w => w.examination_type === options.examType)
  //   .toArray();
  // return Enumerable.from(array)
  //   .groupBy("$.hims_d_physical_examination_header_id", null, (k, g) => {
  //     const source = Enumerable.from(g.getSource())
  //       .where(w => w.hims_d_physical_examination_header_id === k)
  //       .toArray();
  //     return {
  //       header_description: source.firstOrDefault().description,
  //       hims_d_physical_examination_header_id: k,
  //       details: Enumerable.from(source)
  //         .groupBy(
  //           "$.hims_d_physical_examination_details_id",
  //           null,
  //           (key, group) => {
  //             const subDtl = Enumerable.from(group.getSource())
  //               .where(w => w.hims_d_physical_examination_details_id === key)
  //               .toArray();
  //             return {
  //               hims_d_physical_examination_details_id: key,
  //               dtl_description: subDtl.firstOrDefault().dtl_description,
  //               subDetails: Enumerable.from(subDtl)
  //                 .groupBy(
  //                   "$.hims_d_physical_examination_subdetails_id",
  //                   null,
  //                   (dKey, dGroup) => {
  //                     const subDtl = Enumerable.from(dGroup.getSource())
  //                       .where(
  //                         w =>
  //                           w.hims_d_physical_examination_subdetails_id === dKey
  //                       )
  //                       .toArray();
  //                     return {
  //                       hims_d_physical_examination_subdetails_id: dKey,
  //                       sub_dtl_description: subDtl.firstOrDefault()
  //                         .sub_dtl_description
  //                     };
  //                   }
  //                 )
  //                 .toArray()
  //             };
  //           }
  //         )
  //         .toArray()
  //     };
  //   })
  //   .toArray();
};
// const getPhysicalExaminations = $this => {
//   $this.props.getPhysicalExaminations({
//     uri: "/doctorsWorkBench/getPhysicalExamination/get",
//     method: "GET",
//     data: {
//       hims_d_physical_examination_header_id: null,
//       hims_d_physical_examination_details_id: null
//     },
//     cancelRequestId: "getPhysicalExamination",
//     redux: {
//       type: "ALL_EXAMINATIONS",
//       mappingName: "allexaminations"
//     },
//     afterSuccess: data => {}
//   });
// };

// const getPhysicalExaminationsDetails = ($this, header_id) => {
//   $this.props.getPhysicalExaminationsDetails({
//     uri: "/doctorsWorkBench/getPhysicalExamination/get",
//     method: "GET",
//     cancelRequestId: "getPhysicalExaminationsDetails",
//     data: {
//       hims_d_physical_examination_header_id: header_id,
//       hims_d_physical_examination_details_id: null
//     },
//     redux: {
//       type: "ALL_EXAMINATIONS_DETAILS",
//       mappingName: "allexaminationsdetails"
//     },
//     afterSuccess: data => {}
//   });
// };

// const getPhysicalExaminationsSubDetails = ($this, detail_id) => {
//   $this.props.getPhysicalExaminationsSubDetails({
//     uri: "/doctorsWorkBench/getPhysicalExamination/get",
//     method: "GET",
//     cancelRequestId: "getPhysicalExaminationsSubDetails",
//     data: {
//       hims_d_physical_examination_header_id: null,
//       hims_d_physical_examination_details_id: detail_id
//     },
//     redux: {
//       type: "ALL_EXAMINATIONS_SUBDETAILS",
//       mappingName: "allexaminationsubdetails"
//     },
//     afterSuccess: data => {}
//   });
// };

const getPatientPhysicalExamination = $this => {
  $this.props.getPatientPhysicalExamination({
    uri: "/doctorsWorkBench/getPatientPhysicalExamination",
    method: "GET",
    cancelRequestId: "getPatientPhysicalExamination",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "ALL_PATIENT_EXAMINATIONS",
      mappingName: "all_patient_examinations"
    },
    afterSuccess: data => {
      $this.setState({ patientPhysicalExamination: data });
      algaehLoader({ show: false });
    }
  });
};

export { getAllDepartmentBased, getPatientPhysicalExamination };
