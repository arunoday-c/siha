import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { MainContext } from "algaeh-react-components";

export function useCurrentPath() {
  const { flattenMenu } = useContext(MainContext);
  const location = useLocation();
  const currentPage = flattenMenu?.filter(
    (item) =>
      item.page_to_redirect?.replace(/\s/g, "") ===
      location.pathname.substring(1)
  );
  return currentPage?.[0];
}
