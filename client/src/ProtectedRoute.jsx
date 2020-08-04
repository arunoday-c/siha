import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { MainContext } from "algaeh-react-components";

export const ProtectedRoute = ({ render, path, exact, key, strict }) => {
  const { is_authenticated } = useContext(MainContext);
  // const routeComponent = (props) =>
  //   is_authenticated ? (
  //     Render ? (
  //       Render(props)
  //     ) : Component ? (
  //       <Component {...props} />
  //     ) : null
  //   ) : (
  //     <Redirect
  //       to={{ pathname: "/confirm-auth", state: { from: props.location } }}
  //     />
  //   );
  // return <Route path={path} exact={exact} {...rest} render={routeComponent} />;

  if (is_authenticated) {
    return (
      <Route
        key={key}
        path={path}
        exact={exact}
        strict={true}
        render={render}
      />
    );
  } else {
    return (
      <Route
        path={path}
        exact={exact}
        render={(props) => (
          <Redirect
            to={{ pathname: "/confirm-auth", state: { from: props.location } }}
          />
        )}
      />
    );
  }
};
