import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

import ComedorForm from "./serviciosform/ComedorForm";
import ParallevarForm from "./serviciosform/ParallevarForm";
import DomicilioForm from "./serviciosform/DomicilioForm";

function AbrirBtn({ setCapturaForm }) {
  const { setCuenta, initialCuenta } = useContext(AppContext);

  const [comedorForm, setComedorForm] = useState(false);
  const [parallevarForm, setParallevarForm] = useState(false);
  const [domicilioForm, setDomicilioForm] = useState(false);

  const targetComedorForm = () => {
    setCuenta(initialCuenta);
    setComedorForm(true);
  };

  const targetPllForm = () => {
    setCuenta(initialCuenta);
    setParallevarForm(true);
  };

  const targetDomicilioForm = () => {
    setCuenta(initialCuenta);
    setDomicilioForm(true);
  };

  return (
    <div className="btn-group dropstart">
      <button
        type="button"
        className="btn btn-warning dropdown-toggle text-uppercase btn-lg fw-bold text-dark py-3 fs-4"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        abrir
      </button>
      <ul className="dropdown-menu text-uppercase">
        <li>
          <a
            onClick={targetComedorForm}
            className="dropdown-item fs-3 py-3"
            href="#"
          >
            comedor
          </a>
        </li>
        <li>
          <a
            onClick={targetPllForm}
            className="dropdown-item fs-3 py-3"
            href="#"
          >
            para llevar
          </a>
        </li>
        <li>
          <a
            onClick={targetDomicilioForm}
            className="dropdown-item fs-3 py-3"
            href="#"
          >
            domicilio
          </a>
        </li>
      </ul>
      <ComedorForm
        show={comedorForm}
        onHide={() => setComedorForm(false)}
        setCapturaForm={setCapturaForm}
      />
      <ParallevarForm
        show={parallevarForm}
        onHide={() => setParallevarForm(false)}
        setCapturaForm={setCapturaForm}
      />
      <DomicilioForm
        show={domicilioForm}
        onHide={() => setDomicilioForm(false)}
        setCapturaForm={setCapturaForm}
      />
    </div>
  );
}

export default AbrirBtn;
