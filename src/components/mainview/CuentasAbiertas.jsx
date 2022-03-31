import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../contexts/AppContext";
import { formatoFecha, timeAgo } from "../../helpers";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import es from "javascript-time-ago/locale/es.json";
TimeAgo.addLocale(es);

function CuentasAbiertas() {
  const { cuentas, selectCuenta, idx } = useContext(AppContext);

  const [listaCuentas, setListaCuentas] = useState([]);

  useEffect(() => {
    if (cuentas.length > 0) {
      const ctas = cuentas.filter(
        (cuenta) => cuenta.estado === "abierto" || cuenta.estado === "pendiente"
      );
      setListaCuentas(ctas);
    }
  }, [cuentas]);

  const unselect = () => {
    // setIdx("");
    selectCuenta(null);
  };

  return (
    <div onClick={unselect} className="row px-3 py-1">
      {listaCuentas.map((cuenta) => (
        <CardCuenta
          key={cuenta._id}
          cuenta={cuenta}
          selectCuenta={selectCuenta}
          // setIdx={setIdx}
          idx={idx}
        />
      ))}
    </div>
  );
}

export default CuentasAbiertas;

function CardCuenta({ cuenta, selectCuenta, idx }) {
  // const [timestate, setTimestate] = useState("00:00");
  const [cancelaciones, setCancelaciones] = useState(false);

  const isMounted = useRef(true);
  // useEffect(() => {
  //   setInterval(() => {
  //     if (isMounted.current) {
  //       checkTime();
  //     }
  //   }, 1000);

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  useEffect(() => {
    checkCancelaciones();
  });

  const select = (e, id) => {
    e.stopPropagation();
    selectCuenta(id);
  };

  const checkCancelaciones = () => {
    let cls = false;
    cuenta.items.map((item) => {
      if (item.cancelado) {
        cls = true;
      }
    });
    setCancelaciones(cls);
  };

  // const checkTime = () => {
  //   const diff = timeAgo(new Date(cuenta.createdAt));
  //   setTimestate(diff);
  // };
  return (
    <div className="col-md-3 mb-2 p-1 text-uppercase">
      <div className="card bg-white">
        <div
          className={`card-header p-1 ${
            cuenta.estado == "pendiente" ? "bg-warning text-dark" : ""
          }`}
        >
          <h5 className="card-title text-uppercase d-flex justify-content-between">
            <span>{cuenta.servicio}</span>
            <span className="fw-bold">Orden: {cuenta.orden}</span>
          </h5>
        </div>
        <div
          className={`card-body p-2 ${
            cuenta._id === idx ? "cuenta-selected" : ""
          }`}
        >
          <ul
            onClick={(e) => select(e, cuenta._id)}
            className="list-group text-center fs-5"
            role="button"
          >
            <li className="list-group-item text-nowrap border-0 bg-white text-dark px-0">
              {cuenta.servicio === "domicilio" || cuenta.servicio === "pll" ? (
                <React.Fragment>
                  <span className="fw-bold">
                    <i className="bi bi-person-circle"></i>{" "}
                  </span>
                  {cuenta.torreta}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="fw-bold">mesa: </span>
                  {cuenta.torreta}
                  <span className="fw-bold"> personas: </span>
                  {cuenta.personas}
                </React.Fragment>
              )}
            </li>
            <li className="list-group-item border-0 bg-white text-dark">
              <span className="fw-bold">
                <i className="bi bi-clock"></i>{" "}
              </span>
              {formatoFecha(cuenta.createdAt)[1]}
            </li>
            <li className="list-group-item border-0 bg-white text-dark">
              <span className="fw-bold">
                <i className="bi bi-hourglass-split"></i>{" "}
              </span>
              {/* {timestate} */}
              <ReactTimeAgo date={new Date(cuenta.createdAt)} locale="es-MX" />
            </li>
            <li className="list-group-item border-0 bg-white text-dark">
              <small>
                <span className="fw-bold">oper: </span>
                {cuenta.createdBy}
                <span className="fw-bold"> folio: </span>
                {cuenta.folio}
              </small>
            </li>
          </ul>
        </div>
        <div
          className={`card-footer d-flex justify-content-between align-items-end p-0 px-1 ${
            cancelaciones ? "border-2 border-danger" : ""
          } ${cuenta.estado == "pendiente" ? "bg-warning text-dark" : ""}`}
        >
          {cuenta.impreso && <i className="bi bi-printer h4"></i>}
          <h3 className="text-uppercase">total: ${cuenta.cashInfo.total}</h3>
        </div>
      </div>
    </div>
  );
}
