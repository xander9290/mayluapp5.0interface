import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../contexts/AppContext";

import Nav from "./Nav";
import CuentasContainer from "./CuentasContainer";
import LoginForm from "../admin/operadores/LoginForm";

function MainView() {
  const { session, exitProcess } = useContext(AppContext);
  const [loginForm, setLoginForm] = useState(true);

  useEffect(() => {
    if (!session.login) setLoginForm(true);
  }, [session]);

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("beforeunload", function (e) {
        e.preventDefault();
        e.returnValue = "";
      });
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);
  return (
    <React.Fragment>
      <Nav />
      <CuentasContainer />
      <LoginForm show={loginForm} onHide={() => setLoginForm(false)} />
    </React.Fragment>
  );
}

export default MainView;
