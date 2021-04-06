import { swalMessage } from "../../../utils/algaehApiCall";

export function Validations(state) {
  let isError = false;
  if (Window.global["EHR-STD"] === "DoctorsWorkbench") {
    return isError;
  }
  if (
    state.state.chief_complaint === null ||
    state.state.chief_complaint.length < 4
  ) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Please enter chief complaint.",
    });

    return isError;
  }
  // else if (
  //   state.state.significant_signs === undefined ||
  //   state.state.significant_signs === null ||
  //   state.state.significant_signs.length < 4
  // ) {
  //   isError = true;

  //   swalMessage({
  //     type: "warning",
  //     title: "Please enter significant signs.",
  //   });

  //   return isError;
  // }
}
