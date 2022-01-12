import { useState } from "react";

import CuentasCerradasModal from "../CuentasCerradasModal";
import CajaModal from "../caja/CajaModal";

function PuntoVentaItem() {
  const [cuentasCerradas, setCuentasCerradas] = useState(false);
  const [caja, setCaja] = useState(false);

  const targetCuentasCerradas = () => {
    setCuentasCerradas(true);
  };

  const targetCajaModal = () => {
    setCaja(true);
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
          <a href="#" className="dropdown-item fs-5 py-2">
            Monitor de Ventas
          </a>
        </li>
      </ul>
      <CuentasCerradasModal
        show={cuentasCerradas}
        onHide={() => setCuentasCerradas(false)}
      />
      <CajaModal show={caja} onHide={() => setCaja(false)} />
    </li>
  );
}

export default PuntoVentaItem;
