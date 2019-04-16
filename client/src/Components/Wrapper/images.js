import noImage from "../../assets/images/no-image.jpg";
import noIdCard from "../../assets/images/ID-card.jpg";
import noInsuranceCard from "../../assets/images/insurance-card.jpg";
import noInsuranceCardFront from "../../assets/images/insurance-card-front.jpg";
import noInsuranceCardBack from "../../assets/images/insurance-card-back.jpg";
import noDiagram from "../../assets/images/no-diagram.jpg";
import addNew from "../../assets/images/add-new-diagram.jpg";
export default function SelectImage(name) {
  const data = {
    "no-image": noImage,
    "ID-card": noIdCard,
    "insurance-card-front": noInsuranceCardFront,
    "insurance-card": noInsuranceCard,
    "insurance-card-back": noInsuranceCardBack,
    noDiagram: noDiagram,
    addNew: addNew
  };
  return data[name];
}
