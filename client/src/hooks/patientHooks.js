import { useContext } from "react";
import { MainContext } from "algaeh-react-components";
export const useLangFieldName = () => {
  const { userLanguage } = useContext(MainContext);
  const fieldNameFn = (name, alt_name) =>
    userLanguage === "en" ? name : alt_name ?? `arabic_${name}`;
  return { fieldNameFn };
};

export const useCurrency = () => {
  const { userToken } = useContext(MainContext);
  const { currency_symbol, decimal_places } = userToken;

  function amountWithCur(amount) {
    amount = parseFloat(amount) || 0;
    return `${currency_symbol} ${amount?.toFixed(decimal_places) ?? 0}`;
  }
  return { amountWithCur };
};
