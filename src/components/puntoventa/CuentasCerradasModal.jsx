import { useState, useContext, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import { fechaActual, formatoFecha } from "../../helpers";
import routes from "../routes";
import { Modal } from "react-bootstrap";
import ComandaModal from "../mainview/controls/modalstickets/ComandaModal";
import NotaCliente from "../mainview/controls/modalstickets/NotaCliente";

const initialFecha = {
  fecha1: fechaActual(Date.now()),
  fecha2: fechaActual(Date.now()),
};
const url = "http://localhost:3100/cuentas";
function CuentasCerradasModal({ show, onHide }) {
  const { updateCuenta, initialCuenta, cargarCuentas } = useContext(AppContext);

  const [fecha, setFecha] = useState(initialFecha);
  const [listaCuentas, setListaCuentas] = useState([]);
  const [cuenta, setCuenta] = useState(initialCuenta);
  const [comanda, setComanda] = useState(false);
  const [notaCliente, setNotaCliente] = useState(false);

  const handleFecha = (e) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };

  const handleSubmitFecha = (e) => {
    e.preventDefault();
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };

  const getCuentasCerradas = (ctas) => {
    const getCuentas = ctas.filter(
      (cuenta) => cuenta.estado === "cerrado" || cuenta.estado === "cancelado"
    );
    setListaCuentas([...getCuentas]);
  };

  const fetchCuentas = async (gte, lte) => {
    const data = await routes.get(url + "/porfechas/" + gte + "/" + lte);
    if (data.cuentas.length > 0) {
      getCuentasCerradas(data.cuentas);
    } else {
      alert("no se encontraron datos".toUpperCase());
      setListaCuentas([]);
      setCuenta(initialCuenta);
    }
  };

  const selectCuenta = (id) => {
    const findCuenta = listaCuentas.find((cuenta) => cuenta._id === id);
    if (findCuenta) {
      setCuenta(findCuenta);
    } else {
      setCuenta(initialCuenta);
    }
  };

  const reabrir = () => {
    if (!cuenta._id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    if (!window.confirm("confirmar acción".toUpperCase())) return;
    const newCta = {
      ...cuenta,
      estado: "abierto",
      repartidor: "",
      impreso: false,
      time: "",
    };
    updateCuenta(cuenta._id, newCta, async (res) => {
      if (res) {
        await cargarCuentas();
        // commit("Ha reabierto la orden " + cuenta.orden, operadorSession);
        onHide();
      }
    });
  };

  const targetComandaModal = () => {
    if (!cuenta._id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    if (cuenta.cashInfo.total === 0) {
      alert("orden sin productos".toUpperCase());
      return;
    }
    setComanda(true);
  };

  const targetNotaCliente = () => {
    if (!cuenta._id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    setNotaCliente(true);
  };

  const handleShow = () => {
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };
  const handleExited = () => {
    setFecha(initialFecha);
    setCuenta(initialCuenta);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="cuentas-cerradas-modal"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>
              Cuentas Cerradas{" "}
              <span className="badge bg-primary">{listaCuentas.length}</span>
            </h3>
            <form onSubmit={handleSubmitFecha} className="d-flex">
              <input
                type="date"
                name="fecha1"
                value={fecha.fecha1}
                max={fechaActual(Date.now())}
                onChange={handleFecha}
                className="form-control form-control-lg"
                required
              />
              <input
                type="date"
                name="fecha2"
                value={fecha.fecha2}
                max={fechaActual(Date.now())}
                onChange={handleFecha}
                className="form-control form-control-lg"
                required
              />
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-search"></i>
              </button>
            </form>
            <div className="btn-group dropdown ms-2">
              <button
                type="button"
                className="btn btn-warning dropdown-toggle text-uppercase btn-lg text-dark"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                opciones
              </button>
              <ul className="dropdown-menu text-uppercase">
                <li>
                  <a
                    onClick={reabrir}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    reabrir
                  </a>
                </li>
                <li>
                  <a
                    onClick={targetComandaModal}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    <i className="bi bi-printer h4 me-2"></i>negocio
                  </a>
                </li>
                <li>
                  <a
                    onClick={targetNotaCliente}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    <i className="bi bi-printer h4 me-2"></i>cliente
                  </a>
                </li>
              </ul>
            </div>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            {/* cuentas list */}
            <div className="card bg-white">
              <div
                style={{ height: "572px", overflowY: "scroll" }}
                className="card-body p-1"
              >
                <div className="list-group">
                  {listaCuentas.map(
                    (cuenta) =>
                      cuenta._id && (
                        <button
                          key={cuenta._id}
                          onClick={() => selectCuenta(cuenta._id)}
                          type="button"
                          className={`list-group-item list-group-item-action d-flex justify-content-between text-uppercase mb-1 px-1 py-3`}
                        >
                          <span>or: {cuenta.orden}</span>
                          <span
                            className={`${
                              cuenta.estado === "cancelado"
                                ? "px-2 bg-danger"
                                : ""
                            }`}
                          >
                            {cuenta.servicio}
                            {cuenta.estado === "cancelado" ? "(X)" : ""}
                          </span>
                          <span>{formatoFecha(cuenta.createdAt)[0]}</span>
                          <span>f: {cuenta.folio}</span>
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 p-1">
            <div className="card bg-white">
              <div className="card-header p-1 d-flex justify-content-between">
                <ul className="list-group list-group-horizontal text-uppercase">
                  <li className="list-group-item">
                    <span className="fw-bolder">torreta: </span>
                    {cuenta.torreta}
                  </li>
                  {/* <li className="list-group-item">
                    <span className="fw-bolder">folio: </span>
                    {cuenta.folio}
                  </li> */}
                  <li className="list-group-item px-1">
                    <span className="fw-bolder">apertura: </span>
                    {formatoFecha(cuenta.createdAt)[1]}
                  </li>
                  <li className="list-group-item px-1">
                    <span className="fw-bolder">cierre: </span>
                    {formatoFecha(cuenta.closedAt)[1]}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bolder">operador: </span>
                    {cuenta.createdBy}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bolder">Rep: </span>
                    {cuenta.repartidor && cuenta.repartidor}
                  </li>
                </ul>
              </div>
              <div
                style={{ height: "450px", overflowY: "scroll" }}
                className="card-body p-0"
              >
                <table className="table table-bordered border-dark">
                  <thead>
                    <tr className="text-uppercase text-center bg-secondary text-white">
                      <th scope="col">cant</th>
                      <th scope="col">descripción</th>
                      <th scope="col">importe</th>
                      <th scope="col">precio</th>
                      <th scope="col">dscto</th>
                      <th scope="col">operador</th>
                      <th scope="col">captura</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark">
                    {cuenta._id &&
                      cuenta.items.map((item, i) => (
                        <tr
                          style={{ cursor: "default" }}
                          key={i}
                          className={`fw-bold text-uppercase`}
                        >
                          <td className="text-center fs-5">{item.cant}</td>
                          <td>
                            <p className="p-0 m-0 text-nowrap fs-5">
                              {item.name} {item.cancelado ? "(X)" : ""}
                            </p>
                            {item.modificadores.map((mod, i) => (
                              <small key={i}>
                                <p className="p-0 m-0 text-nowrap">
                                  {">>"} {mod.name}{" "}
                                  {mod.price > 0 ? "$" + mod.price : ""}
                                </p>
                              </small>
                            ))}
                          </td>
                          <td
                            className={`text-end fs-5 ${
                              item.dscto > 0 ? "bg-warning" : ""
                            }`}
                          >
                            ${item.importe}
                          </td>
                          <td
                            className={`text-end fs-5 ${
                              item.dscto > 0 ? "bg-warning" : ""
                            }`}
                          >
                            ${item.price}
                          </td>
                          <td
                            className={`text-end fs-5 ${
                              item.dscto > 0 ? "bg-warning" : ""
                            }`}
                          >
                            -${item.dscto}
                          </td>
                          <td className="text-end fs-5">{item.createdBy}</td>
                          <td className="text-end fs-5">
                            {formatoFecha(item.createdAt)[1]}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer p-1">
                <div
                  className="alert alert-warning p-2 text-dark mb-1"
                  role="alert"
                >
                  <p className="p-0 m-0 fs-6">{cuenta.obs}</p>
                </div>
                <div className="d-flex justify-content-end">
                  <ul className="list-group list-group-horizontal text-uppercase">
                    <li className="list-group-item fs-5">
                      importe: ${cuenta.cashInfo.importe}
                    </li>
                    <li className="list-group-item fs-5">
                      dscto: -%{cuenta.cashInfo.dscto}
                    </li>
                    <li className="list-group-item fs-5">
                      efectivo: ${cuenta.cashInfo.efectivo}
                    </li>
                    <li className="list-group-item fs-5">
                      cambio: ${cuenta.cashInfo.cambio}
                    </li>
                    <li className="list-group-item fs-5">
                      total: ${cuenta.cashInfo.total}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComandaModal
        show={comanda}
        onHide={() => setComanda(false)}
        cuenta={cuenta}
      />
      <NotaCliente
        show={notaCliente}
        onHide={() => setNotaCliente(false)}
        cuenta={cuenta}
      />
    </Modal>
  );
}

export default CuentasCerradasModal;
