import React from "react";
import Routes from "./Routes";

type Props = {
  path: string
};

function Index(props: Props) {
  return <Routes path={props.path} />;
}

window.FinanceComponent = Index;
