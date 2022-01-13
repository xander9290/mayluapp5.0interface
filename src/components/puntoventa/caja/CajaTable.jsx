import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

import { formatoFecha } from "../../../helpers";

function CajaTable({ setXcaja }) {
  const { cajas, deleteCaja } = useContext(AppContext);

  const imprimirCaja = (id) => {
    const findCaja = cajas.find((caja) => caja._id === id);
    if (findCaja) {
      setXcaja(findCaja);
    } else {
      return null;
    }
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">Movimientos</h5>
      </div>
      <div
        style={{ height: "500px", overflowY: "scroll", overflowX: "scroll" }}
        className="card-body p-0"
      >
        <table className="table table-bordered text-dark text-uppercase">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-printer"></i>
              </th>
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">concepto</th>
              <th scope="col">tipo</th>
              <th scope="col">importe</th>
              <th scope="col">fecha</th>
              <th scope="col">folio</th>
              <th scope="col">operador</th>
            </tr>
          </thead>
          <tbody>
            {cajas.map((caja) => (
              <tr key={caja._id} style={{ cursor: "default" }}>
                <th valign="bottom" scope="row">
                  <button
                    onClick={() => imprimirCaja(caja._id)}
                    title="IPRIMIR"
                    type="button"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-printer"></i>
                  </button>
                </th>
                <th valign="bottom" scope="row">
                  <button
                    onClick={async () => await deleteCaja(caja._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <td valign="middle">{caja.concepto}</td>
                <td
                  valign="bottom"
                  className={`text-center fw-bold ${
                    caja.tipo === "retiro" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {caja.tipo}
                </td>
                <td valign="bottom" className="text-end">
                  ${caja.importe}
                </td>
                <td valign="bottom" className="text-center">
                  {formatoFecha(caja.createdAt)[0]}
                </td>
                <td valign="middle" className="text-center">
                  {caja.folio}
                </td>
                <td valign="middle" className="text-center">
                  <small>{caja.createdBy}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CajaTable;
