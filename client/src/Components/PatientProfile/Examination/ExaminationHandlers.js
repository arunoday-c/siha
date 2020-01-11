import algaehLoader from "../../Wrapper/fullPageLoader";
//import Enumerable from "linq";
const getAllDepartmentBased = options => {
  options.that.props.getAllDepartmentBased({
    uri: "/doctorsWorkBench/getPhysicalExamination/getAllDepartmentBased",
    data: options.inputData,
    method: "GET",
    cancelRequestId: "getAllDepartmentBased",
    redux: {
      type: "ALL_EXAMINATIONS_DEPT_BASED",
      mappingName: "allexaminations"
    },
    afterSuccess: data => {
      if (typeof options.afterSucces === "function") options.afterSucces(data);
    }
  });
};
// const getPhysicalExaminationOnSpecility = options => {
//   return Enumerable.from(options.data)
//     .where(w => w.examination_type === options.examType)
//     .groupBy("$.hims_d_physical_examination_header_id", null, (k, g) => {
//       const source = Enumerable.from(g.getSource())
//         .where(w => w.hims_d_physical_examination_header_id === k)
//         .firstOrDefault();
//       return {
//         header_description: source.description,
//         hims_d_physical_examination_header_id: k
//       };
//     })
//     .toArray();
// };

const getPatientPhysicalExamination = $this => {
  const { current_patient, episode_id } = $this.props.location.state.content;
  $this.props.getPatientPhysicalExamination({
    uri: "/doctorsWorkBench/getPatientPhysicalExamination",
    method: "GET",
    cancelRequestId: "getPatientPhysicalExamination",
    data: {
      patient_id: current_patient, // Window.global["current_patient"],
      episode_id: episode_id //Window.global["episode_id"]
    },
    redux: {
      type: "ALL_PATIENT_EXAMINATIONS",
      mappingName: "all_patient_examinations"
    },
    afterSuccess: data => {
      //$this.setState({ patientPhysicalExamination: data });
      algaehLoader({ show: false });
    }
  });
};

export { getAllDepartmentBased, getPatientPhysicalExamination };
