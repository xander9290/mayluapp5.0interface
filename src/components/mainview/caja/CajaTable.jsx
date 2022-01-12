import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

import { formatoFecha } from "../../../helpers";

function CajaTable() {
  const { cajas, deleteCaja } = useContext(AppContext);

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">Movimientos</h5>
      </div>
      <div
        style={{ height: "500px", overflow: "auto" }}
        className="card-body p-0"
      >
        <table className="table table-bordered text-dark">
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
                <th scope="row">
                  <button
                    onClick={null}
                    title="IPRIMIR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-printer"></i>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CajaTable;
