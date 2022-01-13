import { useState, useEffect, useContext } from "react";
import { myClock } from "../../helpers";
import { AppContext } from "../contexts/AppContext";

function Clock() {
  const { session, setSession } = useContext(AppContext);
  const [clock, setClock] = useState("00:00 -.-.");

  useEffect(() => {
    setInterval(() => {
      const [string] = myClock();
      setClock(string);
    }, 1000);
  }, []);

  const logOut = async () => {
    if (!window.confirm("confirmar acción".toUpperCase())) return;
    setSession({ login: false, operador: null, rol: null });
  };

  return (
    <ul className="list-group list-group-horizontal">
      <li className="list-group-item text-uppercase">{session.operador}</li>
      <li className="list-group-item">
        <h5 className="p-0 m-0">{clock}</h5>
      </li>
      <li
        onClick={logOut}
        className="list-group-item text-danger text-uppercase"
        role="button"
      >
        <small>Salir</small>
      </li>
    </ul>
  );
}

export default Clock;
