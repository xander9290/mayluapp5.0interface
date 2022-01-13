import { useState, useContext, useRef } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { Modal } from "react-bootstrap";

const initialRepartidor = {
  repartidor: "",
  efectivo: "",
  hasRepartidor: false,
};
function AsignarRepModal({ show, onHide, showNotaCliente }) {
  const { cuenta, updateCuenta, operadores, abrirCajon } =
    useContext(AppContext);
  const inputEfectivo = useRef();

  const [repartidor, setRepartidor] = useState(initialRepartidor);
  const [repartidores, setRepartidores] = useState([]);
  const [error, setError] = useState(null);

  const handleRepartidor = (e) => {
    setRepartidor({ ...repartidor, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cuenta.repartidor === "") {
      const cambio = parseInt(repartidor.efectivo) - cuenta.cashInfo.total;
      if (parseInt(repartidor.efectivo) < cuenta.cashInfo.total) {
        setError("monto incorrecto".toUpperCase());
        inputEfectivo.current.focus();
        return;
      }
      const newCuenta = {
        ...cuenta,
        cashInfo: {
          ...cuenta.cashInfo,
          efectivo: parseInt(repartidor.efectivo),
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
    setError(null);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-asignar-rep"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Asignar Repartidor</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <form className="card bg-white" onSubmit={handleSubmit}>
              <div className="card-header p-1 text-end">
                <button type="submit" className="btn btn-warning btn-lg">
                  Imprimir
                </button>
              </div>
              <div className="card-body p-1 text-dark">
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
                      className="form-control form-control-lg fw-bold"
                      value={repartidor.efectivo}
                      onChange={handleRepartidor}
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
                      parseInt(repartidor.efectivo) - cuenta.cashInfo.total;
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
                  style={{ height: "120px", overflowY: "auto" }}
                  className="mb-2"
                >
                  {repartidores.map((rep) => (
                    <button
                      key={rep._id}
                      type="button"
                      onClick={() => selectRepartidor(rep.name)}
                      className="btn btn-info btn-lg text-uppercase me-2 mb-2 text-dark fs-4"
                    >
                      {rep.name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AsignarRepModal;
