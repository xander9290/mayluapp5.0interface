import { useState, useContext, useRef } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { MyModal } from "../../../wrappers";

const initialRepartidor = {
  repartidor: "",
  hasRepartidor: false,
};
const initialEfectivo = {
  efectivo: 0,
};
function AsignarRepModal({ show, onHide, showNotaCliente, closeDetalle }) {
  const { cuenta, updateCuenta, operadores, abrirCajon } =
    useContext(AppContext);
  const inputEfectivo = useRef();

  const [repartidor, setRepartidor] = useState(initialRepartidor);
  const [efectivo, setEfectivo] = useState(initialEfectivo);
  const [repartidores, setRepartidores] = useState([]);
  const [error, setError] = useState(null);

  const handleRepartidor = (e) => {
    setRepartidor({ ...repartidor, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleEfectivo = (e) => {
    let value = e.target.value;
    if (isNaN(value) || value === "") value = 0;
    setEfectivo({ ...efectivo, [e.target.name]: parseInt(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cuenta.repartidor === "") {
      const cambio = parseInt(efectivo.efectivo) - cuenta.cashInfo.total;
      if (parseInt(efectivo.efectivo) < cuenta.cashInfo.total) {
        setError("monto incorrecto".toUpperCase());
        inputEfectivo.current.focus();
        return;
      }
      const newCuenta = {
        ...cuenta,
        cashInfo: {
          ...cuenta.cashInfo,
          efectivo: parseInt(efectivo.efectivo),
          cambio,
        },
        repartidor: repartidor.repartidor,
        estado: "pendiente",
      };
      updateCuenta(cuenta._id, newCuenta, async (res) => {
        if (res) {
          if (cambio > 0) await abrirCajon();
          onHide();
          showNotaCliente();
        }
      });
    } else {
      const newCuenta = {
        ...cuenta,
        repartidor: repartidor.repartidor,
      };
      updateCuenta(cuenta._id, newCuenta, (res) => {
        if (res) {
          onHide();
          showNotaCliente();
        }
      });
    }
  };

  const filtrarRepartidores = () => {
    const findRepartidres = operadores.filter(
      (operador) => operador.rol === "repartidor"
    );
    if (findRepartidres.length > 0) setRepartidores([...findRepartidres]);
  };

  const selectRepartidor = (name) => {
    setRepartidor({ ...repartidor, repartidor: name });
  };

  const ifHasRepartidor = () => {
    if (cuenta.repartidor !== "") {
      setRepartidor({
        repartidor: cuenta.repartidor,
        efectivo: cuenta.cashInfo.efectivo,
        hasRepartidor: true,
      });
    }
  };

  const handleShow = () => {
    if (cuenta.servicio !== "domicilio") onHide();
    ifHasRepartidor();
    inputEfectivo.current.focus();
    filtrarRepartidores();
  };
  const handleExited = () => {
    setRepartidor(initialRepartidor);
    setEfectivo(initialEfectivo);
    setError(null);
  };
  return (
    <MyModal
      show={show}
      onHide={onHide}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-asignar-rep"
      title="Asignar Repartidor"
    >
      <div className="row">
        <div className="col-md-12 p-1">
          <form className="card" onSubmit={handleSubmit}>
            <div className="card-header p-1 text-end">
              <button type="submit" className="btn btn-warning btn-lg">
                Imprimir
              </button>
            </div>
            <div className="card-body p-1">
              <div className="mb-3">
                <label className="form-label h3">
                  Total A Pagar: ${cuenta.cashInfo.total}
                </label>
              </div>
              <div className="d-flex align-items-end">
                <label className="form-label h3">Efectivo: </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="text"
                    name="efectivo"
                    ref={inputEfectivo}
                    className="form-control form-control-lg fw-bolder fs-3 text-end"
                    value={efectivo.efectivo}
                    onChange={handleEfectivo}
                    required
                    autoComplete="off"
                    readOnly={repartidor.hasRepartidor}
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="mb-3 text-end">
                <div className="form-text text-danger fs-6 fw-bold me-4">
                  {error}
                </div>
              </div>
              <div className="mb-2 h2 text-uppercase">
                cambio: $
                {(() => {
                  const cambio =
                    parseInt(efectivo.efectivo) - cuenta.cashInfo.total;
                  return cambio < 0 || isNaN(cambio) ? "0" : cambio;
                })()}
              </div>
              <div className="mb-1">
                <select
                  className="form-select form-select-lg fs-5 text-uppercase"
                  value={repartidor.repartidor}
                  onChange={handleRepartidor}
                  required
                  name="repartidor"
                >
                  <option value="">Repartidor</option>
                  {repartidores.map((rep) => (
                    <option
                      className="fw-bold fs-4"
                      key={rep._id}
                      value={rep.name}
                    >
                      {rep.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-footer p-1">
              <div
                style={{ height: "100px", overflowY: "auto" }}
                className="mb-2"
              >
                {repartidores.map((rep) => (
                  <button
                    key={rep._id}
                    type="button"
                    onClick={() => selectRepartidor(rep.name)}
                    className="btn btn-warning btn-lg text-uppercase me-2 mb-2 fs-4 border border-white"
                  >
                    {rep.name}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </MyModal>
  );
}

export default AsignarRepModal;
