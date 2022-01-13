import { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, timeAgo } from "../../../helpers";
import { Modal } from "react-bootstrap";

const initialEfectivo = {
  efectivo: 0,
};

const initialTarjeta = {
  tarjeta: 0,
  porcentaje: 0,
  comision: 0,
  total: 0,
};

const initialMedios = {
  medioTotal: 0,
  medioName: "",
};

function PagarModal({ show, onHide, showNotaCliente }) {
  const { cuenta, updateCuenta, reiniciarCuenta, otrosMedios, abrirCajon } =
    useContext(AppContext);

  const inputEfectivo = useRef();
  const inputTarjeta = useRef();

  const [efectivo, setEfectivo] = useState(initialEfectivo);
  const [tarjeta, setTarjeta] = useState(initialTarjeta);
  const [medios, setMedios] = useState(initialMedios);
  const [cambio, setCambio] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [imprimir, setImprimir] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let saldo =
      parseInt(efectivo.efectivo) -
      cuenta.cashInfo.total +
      parseInt(tarjeta.tarjeta) +
      parseInt(medios.medioTotal);
    let salida = saldo >= 0 ? 0 : saldo;
    setSaldo(salida);
  });

  useEffect(() => {
    let cambio =
      parseInt(efectivo.efectivo) -
      cuenta.cashInfo.total +
      parseInt(tarjeta.tarjeta) +
      parseInt(medios.medioTotal);
    let salida = cambio < 0 || isNaN(cambio) ? 0 : cambio;
    setCambio(salida);
  });

  const handleEfectivo = (e) => {
    if (isNaN(e.target.value)) return;
    setEfectivo({ ...efectivo, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleTarjeta = (e) => {
    if (isNaN(e.target.value)) return;
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleMedios = (e) => {
    setMedios({ ...medios, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleImprimir = () => {
    setImprimir(!imprimir);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saldo < 0) {
      setError("montos incorrectos");
      return;
    }
    if (tarjeta.tarjeta > cuenta.cashInfo.total) {
      setError("el monto de la tarjeta no debe superar al total de la cuenta");
      inputTarjeta.current.focus();
      return;
    }
    if (medios.medioTotal > 0) {
      if (medios.medioName === "") {
        setError("No se ha especificado el medio");
        return;
      }
    }
    const newCuenta = {
      ...cuenta,
      estado: "cerrado",
      cashInfo: {
        ...cuenta.cashInfo,
        cambio,
        efectivo: parseInt(efectivo.efectivo),
        tarjeta: parseInt(tarjeta.tarjeta),
      },
      cardInfo: {
        porcentaje: parseInt(tarjeta.porcentaje),
        importe: parseInt(tarjeta.comision),
        total: parseInt(tarjeta.total),
      },
      otroMedio: {
        medio: medios.medioName,
        total: parseInt(medios.medioTotal),
      },
      closedAt: fechaISO(),
      time: timeAgo(new Date(cuenta.createdAt)),
    };
    if (cuenta.servicio === "domicilio") {
      updateCuenta(cuenta._id, newCuenta, async (res) => {
        if (res) {
          await abrirCajon();
          onHide();
          reiniciarCuenta();
        }
      });
    } else {
      updateCuenta(cuenta._id, newCuenta, async (res) => {
        if (res) {
          await abrirCajon();
          if (imprimir) showNotaCliente();
          onHide();
          reiniciarCuenta();
        }
      });
    }
  };

  const calcularComision = () => {
    setError(null);
    let porcentaje = prompt(
      "Establece el porcentaje de la comisión %".toUpperCase()
    );
    if (!porcentaje) return;
    if (parseInt(porcentaje) === 0) {
      setTarjeta(initialTarjeta);
      return;
    }
    porcentaje = parseInt(porcentaje);

    const comision = Math.round((Math.abs(saldo) * porcentaje) / 100);
    setTarjeta({
      ...tarjeta,
      porcentaje,
      comision,
      total: comision + Math.abs(saldo),
    });
    inputTarjeta.current.focus();
  };
  const handleShow = () => {
    inputEfectivo.current.focus();
  };
  const handleExited = () => {
    setEfectivo(initialEfectivo);
    setTarjeta(initialTarjeta);
    setMedios(initialMedios);
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
      dialogClassName="modal-pagar-cuenta"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h4>Total a pagar: ${cuenta.cashInfo.total}</h4>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <form onSubmit={handleSubmit} className="card">
              <div className="card-header p-1 d-flex justify-content-between align-items-end">
                <h3 className="card-title">Saldo: ${saldo}</h3>
                <h3 className="card-title">Cambio: ${cambio}</h3>
              </div>
              <div
                style={{ height: "196px" }}
                className="card-body p-1 d-flex flex-column align-items-center"
              >
                <nav>
                  <div className="nav nav-tabs" role="tablist">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#efectivo"
                      type="button"
                      role="tab"
                      aria-controls="efectivo"
                      aria-selected="true"
                    >
                      Efectivo
                    </button>
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#tarjeta"
                      type="button"
                      role="tab"
                      aria-controls="tarjeta"
                      aria-selected="false"
                    >
                      Tarjeta
                    </button>
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#otros"
                      type="button"
                      role="tab"
                      aria-controls="otros"
                      aria-selected="false"
                    >
                      Otros Medios
                    </button>
                  </div>
                </nav>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="efectivo"
                    role="tabpanel"
                    aria-labelledby="efectivo"
                  >
                    <div className="mb-2 text-center pt-3">
                      <label className="form-label h3">Efectivo: </label>
                      <div
                        style={{ width: "200px" }}
                        className="input-group input-group-lg"
                      >
                        <span className="input-group-text">$</span>
                        <input
                          type="text"
                          name="efectivo"
                          ref={inputEfectivo}
                          className="form-control form-control-lg fw-bold"
                          value={efectivo.efectivo}
                          onChange={handleEfectivo}
                          required
                          autoComplete="off"
                        />
                        <span className="input-group-text">.00</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="tarjeta"
                    role="tabpanel"
                    aria-labelledby="tarjeta"
                  >
                    <div className="mb-2 d-flex flex-column align-items-center">
                      <label className="form-label h3 text-center">
                        Tarjeta:{" "}
                      </label>
                      <div
                        style={{ width: "200px" }}
                        className="input-group input-group-lg"
                      >
                        <span className="input-group-text">$</span>
                        <input
                          type="text"
                          name="tarjeta"
                          ref={inputTarjeta}
                          className="form-control form-control-lg fw-bold"
                          value={tarjeta.tarjeta}
                          onChange={handleTarjeta}
                          required
                          autoComplete="off"
                        />
                        <span className="input-group-text">.00</span>
                      </div>
                      <div className="d-flex">
                        <label className="form-label h4 me-4">
                          Comision: ${tarjeta.comision}
                        </label>
                        <label className="form-label h4 ms-4">
                          Importe: ${tarjeta.total}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="otros"
                    role="tabpanel"
                    aria-labelledby="otros"
                  >
                    <div className="mb-2 pt-3">
                      <select
                        name="medioName"
                        className="form-select form-select-lg text-uppercase"
                        value={medios.medioName}
                        onChange={handleMedios}
                      >
                        <option value="">Otros Medios</option>
                        {otrosMedios.map((medio) => (
                          <option key={medio._id} value={medio.name}>
                            {medio.name}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{ width: "200px" }}
                        className="input-group input-group-lg"
                      >
                        <span className="input-group-text">$</span>
                        <input
                          type="text"
                          name="medioTotal"
                          onChange={handleMedios}
                          className="form-control form-control-lg"
                          value={medios.medioTotal}
                          autoComplete="off"
                        />
                        <span className="input-group-text">.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-1">
                  <div className="form-text fs-5 fw-bold text-uppercase text-center text-danger">
                    {error}
                  </div>
                </div>
              </div>
              <div className="card-footer p-1 d-flex justify-content-between align-items-end">
                <button
                  onClick={calcularComision}
                  type="button"
                  className="btn btn-warning btn-lg"
                >
                  %
                </button>
                <div className="form-check">
                  <label className="form-check-label fs-5 me-3">
                    <input
                      type="checkbox"
                      name="recibo"
                      checked={imprimir}
                      onChange={handleImprimir}
                      className="form-check-input"
                    />
                    Imprimir recibo
                  </label>
                </div>
                <button type="submit" className="btn btn-warning btn-lg">
                  Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PagarModal;
