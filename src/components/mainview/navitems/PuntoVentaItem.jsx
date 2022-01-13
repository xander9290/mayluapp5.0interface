import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

import CuentasCerradasModal from "../../puntoventa/CuentasCerradasModal";
import CajaModal from "../../puntoventa/caja/CajaModal";
import LoginMonitorModal from "../../puntoventa/monitorventa/LoginMonitorModal";
import MonitorVentaModal from "../../puntoventa/monitorventa/MonitorVentaModal";

function PuntoVentaItem() {
  const { session } = useContext(AppContext);
  const [cuentasCerradas, setCuentasCerradas] = useState(false);
  const [caja, setCaja] = useState(false);
  const [loginMonitor, setLoginMonitor] = useState(false);
  const [monitor, setMonitor] = useState(false);

  const targetCuentasCerradas = () => {
    setCuentasCerradas(true);
  };

  const targetCajaModal = () => {
    setCaja(true);
  };

  const targetLoginMonitor = () => {
    if (session.rol !== "master") {
      alert("!acceso denegado!\noperador no autorizado".toUpperCase());
      return;
    }
    setLoginMonitor(true);
  };

  return (
    <li className="nav-item dropdown">
      <a
        href="#"
        className="nav-link dropdown-toggle bg-white fs-5 text-dark"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Punto de Venta
      </a>
      <ul className="dropdown-menu">
        <li>
          <a href="#" className="dropdown-item fs-5 py-2">
            Abrir Cajón
          </a>
        </li>
        <li>
          <a
            onClick={targetCuentasCerradas}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Cuentas Cerradas
          </a>
        </li>
        <li>
          <a
            onClick={targetCajaModal}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Retiros y Depósitos
          </a>
        </li>
        <li>
          <a
            onClick={targetLoginMonitor}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Monitor de Ventas
          </a>
        </li>
      </ul>
      <CuentasCerradasModal
        show={cuentasCerradas}
        onHide={() => setCuentasCerradas(false)}
      />
      <CajaModal show={caja} onHide={() => setCaja(false)} />
      <LoginMonitorModal
        show={loginMonitor}
        onHide={() => setLoginMonitor(false)}
        setMonitor={setMonitor}
      />
      <MonitorVentaModal show={monitor} onHide={() => setMonitor(false)} />
    </li>
  );
}

export default PuntoVentaItem;
