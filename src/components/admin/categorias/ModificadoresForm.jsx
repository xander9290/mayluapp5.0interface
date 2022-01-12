import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, verifyExiste, formatoFecha } from "../../../helpers";

const initialModificador = {
  name: "",
  price: 0,
  createdAt: fechaISO(),
  lastEdit: "",
  id: null,
};

function ModificadoresForm({
  modificadores,
  setModificadores,
  selectedSubcategoria,
}) {
  const { session } = useContext(AppContext);
  const [modificador, setModificador] = useState(initialModificador);
  const [idx, setIdx] = useState("");

  useEffect(() => {
    if (modificadores.length === 0) cancelar();
  }, [modificadores]);

  const handleModificador = (e) => {
    setModificador({ ...modificador, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modificador.id) {
      const newMod = {
        ...modificador,
        price: parseInt(modificador.price),
        lastEdit: fechaISO(),
      };
      const findIndex = modificadores.findIndex(
        (mod) => mod.id === modificador.id
      );
      const list = modificadores;
      list[findIndex] = newMod;
      setModificadores([...list]);
      cancelar();
    } else {
      const newMod = {
        ...modificador,
        id: modificadores.length + 1,
        createdBy: session.operador,
      };
      if (verifyExiste(modificadores, modificador.name)) {
        alert(
          `!ERROR!\nEl valor "${modificador.name}" para este modificador no esta disponible.`
        );
        return;
      }
      setModificadores([...modificadores, newMod]);
      cancelar();
    }
  };

  const selectModificador = (id) => {
    const findModificador = modificadores.find(
      (modificador) => modificador.id === id
    );
    console.log(findModificador);
    setModificador(findModificador);
  };

  const deleteModificador = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const newList = [];
    const changedValues = modificadores.filter(
      (modificador) => modificador.id !== id
    );
    changedValues.map((m, i) => {
      newList.push({ ...m, id: i + 1 });
    });
    setModificadores(newList);
    cancelar();
  };

  const cancelar = () => {
    setModificador(initialModificador);
    setIdx("");
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Modificadores{" "}
          <span className="badge bg-primary">{modificadores.length}</span>
          {modificador.id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div
            style={{ pointerEvents: selectedSubcategoria }}
            className="d-flex justify-content-between"
          >
            <input
              className="form-control form-control-lg"
              type="text"
              name="name"
              value={modificador.name}
              onChange={handleModificador}
              autoComplete="off"
              required
              placeholder="Descrupción"
            />
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                className="form-control form-control-lg"
                type="number"
                name="price"
                min="0"
                value={modificador.price}
                onChange={handleModificador}
                autoComplete="off"
              />
            </div>
            {modificador.id !== null ? (
              <button
                title="EDITAR"
                className="btn btn-primary mx-1"
                type="submit"
              >
                <i className="bi bi-pencil"></i>
              </button>
            ) : (
              <button
                title="AGREGAR"
                className="btn btn-primary mx-1"
                type="submit"
              >
                <i className="bi bi-plus-circle"></i>
              </button>
            )}
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning"
              type="reset"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        </form>
      </div>
      <div className="card-body cards-body-admin p-1">
        <table className="table table-striped table-bordered text-dark">
          <thead>
            <tr className="text-center">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            {modificadores.map((modificador) => (
              <tr
                key={modificador.id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(modificador.id)}
                className={`text-uppercase ${
                  idx === modificador.id ? "bg-info" : ""
                }`}
              >
                <td>
                  <button
                    onClick={() => deleteModificador(modificador.id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => selectModificador(modificador.id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm ms-1"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td className="text-dark">{modificador.name}</td>
                <td className="text-end text-dark">${modificador.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-1">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {modificador.createdAt && formatoFecha(modificador.createdAt)[0]}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{modificador.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>
            {modificador.lastEdit && formatoFecha(modificador.lastEdit)[0]}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ModificadoresForm;
