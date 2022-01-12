import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, verifyExiste, formatoFecha } from "../../../helpers";

const initialOperador = {
  name: "",
  pswd: "",
  rol: "",
};
function OperadorForm() {
  const {
    operadores,
    createOperador,
    updateOperador,
    deleteOperador,
    session,
  } = useContext(AppContext);
  const [operador, setOperador] = useState(initialOperador);
  const [idx, setIdx] = useState("");

  const handleOperador = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (operador._id) {
      const newOper = {
        ...operador,
        lastEdit: fechaISO(),
      };
      updateOperador(operador._id, newOper);
      cancelar();
    } else {
      const newOper = {
        ...operador,
        createdBy: session.operador,
      };
      if (verifyExiste(operadores, operador.name)) {
        alert(
          `!ERROR!\nEl valor "${operador.name}" para este operador no esta disponible.`
        );
        return;
      }
      createOperador(newOper);
      cancelar();
    }
  };

  const selectOperador = (id) => {
    const findOperador = operadores.find((operador) => operador._id === id);
    if (findOperador) setOperador(findOperador);
  };

  const cancelar = () => {
    setOperador(initialOperador);
    setIdx("");
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Operadores{" "}
          <span className="badge bg-primary">{operadores.length}</span>
          {operador._id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            className="form-control form-control-lg"
            type="text"
            name="name"
            value={operador.name}
            onChange={handleOperador}
            autoComplete="off"
            required
            placeholder="Nombre"
          />
          <input
            className="form-control form-control-lg"
            type="password"
            name="pswd"
            maxLength="4"
            value={operador.pswd}
            onChange={handleOperador}
            autoComplete="off"
            required
            placeholder="Contraseña"
          />
          <select
            className="form-select form-select-lg"
            name="rol"
            value={operador.rol}
            onChange={handleOperador}
            required
          >
            <option value="">Rol</option>
            <option value="master">Master</option>
            <option value="cajero">Cajero</option>
            <option value="repartidor">Repartidor</option>
          </select>
          {operador._id ? (
            <button
              title="EDITAR"
              className="btn btn-primary btn-lg me-1"
              type="submit"
            >
              <i className="bi bi-pencil"></i>
            </button>
          ) : (
            <button
              title="AGREGAR"
              className="btn btn-primary btn-lg me-1"
              type="submit"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
          )}
          <button
            onClick={cancelar}
            title="CANCELAR"
            className="btn btn-warning btn-lg"
            type="reset"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </form>
      </div>
      <div className="card-body p-1 cards-body-admin">
        <table className="table table-bordered text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">Nombre</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((operador) => (
              <tr
                key={operador._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(operador._id)}
                className={`text-uppercase ${
                  operador._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={async () => await deleteOperador(operador._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectOperador(operador._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <td>{operador.name}</td>
                <td className="text-center">{operador.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-1">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {operador.createdAt && formatoFecha(operador.createdAt)[0]}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{operador.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>{operador.lastEdit && formatoFecha(operador.lastEdit)[0]}</span>
        </p>
      </div>
    </div>
  );
}

export default OperadorForm;
