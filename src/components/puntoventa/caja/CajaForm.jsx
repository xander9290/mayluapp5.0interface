import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaActual } from "../../../helpers";

const initialCaja = {
  tipo: "",
  concepto: "",
  importe: 0,
  createdBy: "",
};
function CajaForm({ setXcaja }) {
  const { createCaja, session } = useContext(AppContext);
  const [caja, setCaja] = useState(initialCaja);

  const handleCaja = (e) =>
    setCaja({ ...caja, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCaja = {
      ...caja,
      createdBy: session.operador,
      fecha: fechaActual(Date.now()),
    };
    createCaja(newCaja, (res) => {
      setCaja(initialCaja);
      setXcaja(res);
    });
  };

  const cancelar = () => {
    setCaja(initialCaja);
  };

  return (
    <form className="card bg-white" onSubmit={handleSubmit}>
      <div className="card-header p-1">
        <h5 className="card-title">Retiros y Depósitos</h5>
      </div>
      <div className="card-body p-1">
        <div className="mb-2">
          <select
            name="tipo"
            value={caja.tipo}
            onChange={handleCaja}
            className="form-select form-select-lg fw-bold"
            required
          >
            <option value="">Tipo</option>
            <option value="retiro" className="h3">
              Retiro
            </option>
            <option value="deposito" className="h3">
              Depósito
            </option>
          </select>
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="concepto"
            value={caja.concepto}
            onChange={handleCaja}
            placeholder="Concepto"
            required
            autoComplete="off"
            className="form-control form-control-lg"
          />
        </div>
        <div className="mb-2">
          <div className="input-group input-group-lg">
            <span className="input-group-text">$</span>
            <input
              type="number"
              name="importe"
              value={caja.importe}
              onChange={handleCaja}
              placeholder="Concepto"
              required
              className="form-control form-control-lg"
            />
            <span className="input-group-text">.00</span>
          </div>
        </div>
      </div>
      <div className="card-footer p-1">
        <button title="AGREGAR" className="btn btn-primary me-2" type="submit">
          <i className="bi bi-plus-circle me-2"></i>
          Guardar
        </button>
        <button
          onClick={cancelar}
          title="CANCELAR"
          className="btn btn-warning"
          type="reset"
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default CajaForm;
