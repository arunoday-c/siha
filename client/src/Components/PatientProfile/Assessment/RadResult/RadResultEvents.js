const getRadResult = $this => {
  let inputobj = {
    patient_id: Window.global["current_patient"],
    visit_id: Window.global["visit_id"]
  };

  $this.props.getRadResult({
    uri: "/radiology/getRadOrderedServices",
    module: "radiology",
    method: "GET",
    data: inputobj,
    redux: {
      type: "RAD_RESULT_GET_DATA",
      mappingName: "radresult"
    }
  });
};
export { getRadResult };
