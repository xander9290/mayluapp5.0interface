import React, { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Modal } from "react-bootstrap";
import { formatoFecha, fechaISO, procesarItems } from "../../../helpers";

function DetalleCuenta({
  show,
  onHide,
  capturaForm,
  showComandaModal,
  pagar,
  showDividirModal,
  reabrir,
}) {
  const { updateCuenta, cuenta, reiniciarCuenta, compuestos } =
    useContext(AppContext);

  const [itemsIdx, setItemsIdx] = useState(null);

  const selectItem = (idx) => {
    setItemsIdx(idx);
  };

  const procesarCompuestos = (pdcto, cant) => {
    const updatedCompuestos = pdcto.compuestos.map((currentCompuesto) => {
      compuestos.map((compuesto) => {
        if (currentCompuesto._id === compuesto._id) {
          currentCompuesto.medida = compuesto.medida * cant;
          currentCompuesto.price = compuesto.price * cant;
        }
        return compuesto;
      });
      return currentCompuesto;
    });

    return updatedCompuestos;
  };

  const cancelarItem = (idx) => {
    if (!window.confirm("Confrimar Acción")) return;
    const list = cuenta.items;
    const cant = list[idx].cant;
    if (cant > 1) {
      const _cant = window.prompt(
        "CANTIDAD A CANCELAR DE " + cant + " " + list[idx].name.toUpperCase(),
        cant
      );
      if (!_cant) return;
      if (_cant === "0") return;
      const nvaCant = list[idx].cant - parseInt(_cant);
      list[idx].cant = nvaCant;
      const price = list[idx].price;
      const nvoImporte = price * nvaCant;
      list[idx].importe = nvoImporte;
      let motivo = prompt("motivo de la cancelación".toUpperCase());
      if (!motivo) motivo = "sin especificar";
      if (cant !== parseInt(_cant)) {
        const productoCancelado = {
          ...list[idx],
          importe: list[idx].price * parseInt(_cant),
          motivo,
          cancelado: true,
          cant: parseInt(_cant),
          orden: cuenta.orden,
          hora: fechaISO(),
        };
        list.push(productoCancelado);
      }
      list[idx].motivo = motivo;
      list[idx].hora = fechaISO();
      list[idx].compuestos = procesarCompuestos(list[idx], nvaCant);
      if (nvaCant === 0) {
        list[idx].cancelado = true;
        list[idx].cant = parseInt(cant);
        list[idx].motivo = motivo;
        list[idx].hora = fechaISO();
        list[idx].orden = cuenta.orden;
      }
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        cashInfo: {
          ...cuenta.cashInfo,
          importe,
          total: totalConDscto,
        },
        // obs: `Cancelado ${_cant} ${list[idx].name}(#${
        //   idx + 1
        // }), motivo: ${motivo}.\n${cuenta.obs}`,
      };
      updateCuenta(cuenta._id, newCta, (res) => {
        console.log(res);
      });
    } else {
      let motivo = prompt("motivo de la cancelación".toUpperCase());
      if (motivo === null) motivo = "sin especificar";
      list[idx].motivo = motivo;
      list[idx].cancelado = true;
      list[idx].orden = cuenta.orden;
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        cashInfo: {
          ...cuenta.cashInfo,
          importe,
          total: totalConDscto,
        },
        // obs: `Cancelado ${cant} ${list[idx].name}(#${
        //   idx + 1
        // }), motivo: ${motivo}.\n${cuenta.obs}`,
      };
      updateCuenta(cuenta._id, newCta, (res) => {
        if (res) console.log("ok");
      });
    }
  };

  const descontarProducto = (idx) => {
    const list = cuenta.items;
    if (list[idx].dscto > 0) {
      alert(
        "!atención!\nun descuento por producto(s) permitido solamente".toUpperCase()
      );
      return;
    }
    if (
      !window.confirm(
        "!atención!\nel descuento del producto se hará sobre el importe total de la cantidad y no sobre el precio. sólo se permite un descuento por movimiento.\n¿deseas continuar?".toUpperCase()
      )
    )
      return;
    const entry = window.prompt("Importe en porcentaje %", 0);
    if (entry === null) return;
    const _dscto = parseInt(entry);
    const _importe = list[idx].importe;
    const total = Math.round((_importe * _dscto) / 100);
    const _totalDscto = _importe - total;
    list[idx].importe = _totalDscto;
    list[idx].dscto = total;
    const { importe, totalConDscto } = procesarItems(list, 0);
    const newCta = {
      ...cuenta,
      items: list,
      cashInfo: {
        ...cuenta.cashInfo,
        importe,
        dscto: 0,
        total: totalConDscto,
      },
      // obs: `Se descontó ${list[idx].name}(#${idx + 1}).\n${cuenta.obs}`,
    };
    updateCuenta(cuenta._id, newCta, (res) => {
      if (res) console.log("ok");
    });
  };

  const targetCapturaModal = () => {
    //onHide();
    setTimeout(() => {
      capturaForm();
    }, 200);
  };

  const targetComandaModal = () => {
    showComandaModal();
    onHide();
  };

  const targetPagar = () => {
    if (!cuenta.impreso) {
      alert("es necesario imprimir la cuenta primero".toUpperCase());
      return;
    }
    //onHide();
    pagar();
  };

  const setDescuento = () => {
    if (cuenta.impreso) {
      alert("la cuenta ya se encuntra impresa".toUpperCase());
      return;
    }
    let porcentaje = window.prompt("Aplicar descuento en porcentaje %: ");
    if (!porcentaje) return;
    porcentaje = parseInt(porcentaje);
    const { totalConDscto } = procesarItems(cuenta.items, porcentaje);
    const newCta = {
      ...cuenta,
      cashInfo: {
        ...cuenta.cashInfo,
        dscto: porcentaje,
        total: totalConDscto,
      },
    };
    updateCuenta(cuenta._id, newCta, (res) => {
      console.log("Descuento aplicado");
    });
  };

  const handleShow = () => {};
  const handleExited = () => {
    setItemsIdx("");
    reiniciarCuenta();
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-detalle-cuenta"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>
              Detalle de la orden {cuenta.orden}{" "}
              {cuenta.servicio === "pll" ? "Para LLevar" : cuenta.servicio}
            </h3>
            <button
              onClick={() => targetCapturaModal()}
              disabled={cuenta.impreso ? true : false}
              type="button"
              className="btn btn-warning btn-lg text-uppercase text-dark fw-bold"
            >
              <i className="bi bi-card-list"></i> capturar
            </button>
            <button
              onClick={targetComandaModal}
              type="button"
              className="btn btn-warning btn-lg text-uppercase text-dark fw-bold"
            >
              <i className="bi bi-printer"></i> imprimir
            </button>
            <div className="btn-group dropdown">
              <button
                type="button"
                className="btn btn-warning dropdown-toggle text-uppercase btn-lg text-dark fw-bold"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                opciones
              </button>
              <ul className="dropdown-menu text-uppercase">
                <li>
                  <a
                    onClick={targetPagar}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    <i className="bi bi-cash-coin me-2"></i> pagar
                  </a>
                </li>
                <li>
                  <a
                    onClick={showDividirModal}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    <i className="bi bi-layout-split me-2"></i>
                    dividir
                  </a>
                </li>
                <li>
                  <a
                    onClick={reabrir}
                    className="dropdown-item fs-4 py-2"
                    href="#"
                  >
                    <i className="bi bi-arrow-repeat me-2"></i>
                    reabrir
                  </a>
                </li>
                <li>
                  <a
                    onClick={setDescuento}
                    className="dropdown-item fs-4 py-3"
                    href="#"
                  >
                    -(%) descuento
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
          <div className="col-md-12 p-1">
            <div className="card bg-white">
              <div className="card-header p-1 d-flex justify-content-between">
                <ul className="list-group list-group-horizontal text-uppercase">
                  <li className="list-group-item">
                    <span className="fw-bolder">torreta: </span>
                    {cuenta.torreta}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bolder">folio: </span>
                    {cuenta.folio}
                  </li>
                  <li className="list-group-item px-1">
                    <span className="fw-bolder">
                      <i className="bi bi-clock"></i>{" "}
                    </span>
                    {formatoFecha(cuenta.createdAt)[0]}
                  </li>
                  {cuenta.closedAt && (
                    <li className="list-group-item px-1">
                      <span className="fw-bolder">cierre: </span>
                      {formatoFecha(cuenta.closedAt)[1]}
                    </li>
                  )}
                  <li className="list-group-item">
                    <span className="fw-bolder">operador: </span>
                    {cuenta.createdBy}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bolder">Reparto: </span>
                    {cuenta.repartidor && cuenta.repartidor}
                  </li>
                </ul>
                {cuenta.impreso && (
                  <h4>
                    <i className="bi bi-printer me-2"></i>Impreso
                  </h4>
                )}
              </div>
              <div className="card-body p-0 detalle-items-body">
                <table className="table table-bordered border-dark">
                  <thead>
                    <tr className="text-uppercase text-center bg-secondary text-white">
                      <th scope="col">#</th>
                      <th scope="col">
                        {cuenta.estado !== "abierto" ? null : (
                          <i className="bi bi-x-circle"></i>
                        )}
                      </th>
                      <th scope="col">-%</th>
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
                          onClick={() => selectItem(i)}
                          key={i}
                          className={`fw-bold text-uppercase ${
                            itemsIdx === i ? "bg-info" : ""
                          } ${item.cancelado ? "bg-danger" : ""} `}
                        >
                          <th scope="row">{i + 1}</th>
                          <th scope="row" className="text-center">
                            <button
                              disabled={
                                item.cancelado
                                  ? true
                                  : false || cuenta.impreso
                                  ? true
                                  : false
                              }
                              onClick={() => cancelarItem(i)}
                              title="CANCELAR"
                              type="button"
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </th>
                          <th scope="row" className="text-center">
                            {item.cancelado ? null : (
                              <button
                                disabled={cuenta.impreso ? true : false}
                                onClick={() => descontarProducto(i)}
                                title="DESCONTAR"
                                type="button"
                                className="btn btn-primary btn-sm"
                              >
                                -%
                              </button>
                            )}
                          </th>
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
              <div style={{ overflowX: "auto" }} className="card-footer p-1">
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
    </Modal>
  );
}

export default DetalleCuenta;
