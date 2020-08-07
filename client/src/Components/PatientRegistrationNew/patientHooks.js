import { useContext } from "react";
import { MainContext } from "algaeh-react-components";
export const useLangFieldName = () => {
  const { userLanguage } = useContext(MainContext);
  const fieldNameFn = (name, alt_name) =>
    userLanguage === "en" ? name : alt_name ?? `arabic_${name}`;
  return { fieldNameFn };
};
