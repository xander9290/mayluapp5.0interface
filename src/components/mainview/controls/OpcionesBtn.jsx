import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import ComedorForm from "./serviciosform/ComedorForm";
import ParallevarForm from "./serviciosform/ParallevarForm";
import DomicilioForm from "./serviciosform/DomicilioForm";
import InfoDomModal from "./InfoDomModal";

import { procesarItems } from "../../../helpers";

function OpcionesBtn({ targetAsignarRep }) {
  const { cuenta, clientes, updateCuenta } = useContext(AppContext);

  const [comedorForm, setComedorForm] = useState(false);
  const [pllForm, setPllForm] = useState(false);
  const [domicilioForm, setDomicilioForm] = useState(false);
  const [infodom, setInfodom] = useState(false);

  const targetServicioForm = () => {
    if (!cuenta._id) {
      alert("selecciona o abre una orden para continuar".toUpperCase());
      return;
    }
    if (cuenta.servicio === "comedor") setComedorForm(true);
    if (cuenta.servicio === "pll") setPllForm(true);
    if (cuenta.servicio === "domicilio") setDomicilioForm(true);
  };

  const targetInfoDom = () => {
    if (!cuenta._id) {
      alert("selecciona o abre una orden para continuar".toUpperCase());
      return;
    }
    setInfodom(true);
  };

  const setObservaciones = () => {
    const obs = window.prompt("Hacer una observacion: ");
    if (!obs) return;
    const newCta = {
      ...cuenta,
      obs: cuenta.obs + " " + obs + ".",
    };
    updateCuenta(cuenta._id, newCta, (res) => {
      console.log(res);
    });
  };

  return (
    <div className="btn-group dropstart">
      <button
        disabled={cuenta._id ? false : true}
        type="button"
        className="btn btn-warning dropdown-toggle text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        opciones
      </button>
      <ul className="dropdown-menu text-uppercase">
        <li>
          <a
            onClick={targetInfoDom}
            className="dropdown-item fs-4 py-3"
            href="#"
          >
            ver domicilio
          </a>
        </li>
        <li>
          <a
            onClick={targetServicioForm}
            className="dropdown-item fs-4 py-3"
            href="#"
          >
            cambiar cliente
          </a>
        </li>
        <li>
          <a
            onClick={targetServicioForm}
            className="dropdown-item fs-4 py-3"
            href="#"
          >
            editar torreta
          </a>
        </li>
        <li>
          <a
            onClick={targetAsignarRep}
            className="dropdown-item fs-4 py-3"
            href="#"
          >
            cambiar repartidor
          </a>
        </li>
        <li>
          <a
            onClick={setObservaciones}
            className="dropdown-item fs-4 py-3"
            href="#"
          >
            observaciones
          </a>
        </li>
      </ul>
      <ComedorForm show={comedorForm} onHide={() => setComedorForm(false)} />
      <ParallevarForm show={pllForm} onHide={() => setPllForm(false)} />
      <DomicilioForm
        show={domicilioForm}
        onHide={() => setDomicilioForm(false)}
      />
      <InfoDomModal
        show={infodom}
        onHide={() => setInfodom(false)}
        cuenta={cuenta}
        clientes={clientes}
      />
    </div>
  );
}

export default OpcionesBtn;
