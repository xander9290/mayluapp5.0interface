import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, verifyExiste, formatoFecha } from "../../../helpers";

const initialCategoria = {
  name: "",
  fondo: "#FFFFFF",
  lastEdit: "",
};
function CategoriasForm({}) {
  const {
    categorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    session,
  } = useContext(AppContext);

  const [categoria, setCategoria] = useState(initialCategoria);

  const handleCategoria = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoria._id) {
      const newCategoria = {
        ...categoria,
        lastEdit: fechaISO(),
      };
      updateCategoria(categoria._id, newCategoria);
      cancelar();
    } else {
      const newCategoria = {
        ...categoria,
        createdBy: session.operador,
      };
      if (verifyExiste(categorias, categoria.name)) {
        alert(
          `!ERROR!\nEl valor "${categoria.name}" para esta categoría no esta disponible.`
        );
        return;
      }
      createCategoria(newCategoria);
      cancelar();
    }
  };

  const selectCategoria = (id) => {
    const findCategoria = categorias.find((categoria) => categoria._id === id);
    if (findCategoria) {
      setCategoria(findCategoria);
    } else {
      alert("Cannot find categoria".toUpperCase());
    }
  };

  const cancelar = () => {
    setCategoria(initialCategoria);
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Categorías{" "}
          <span className="badge bg-primary">{categorias.length}</span>{" "}
          {categoria._id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between">
            <input
              className="form-control form-control-lg"
              type="text"
              name="name"
              value={categoria.name}
              onChange={handleCategoria}
              autoComplete="off"
              required
              placeholder="Nombre"
            />
            <input
              className="form-control form-control-color form-control-lg"
              type="color"
              name="fondo"
              value={categoria.fondo}
              onChange={handleCategoria}
              required
            />
            {categoria._id ? (
              <button
                title="EDITAR"
                className="btn btn-primary btn-lg mx-1"
                type="submit"
              >
                <i className="bi bi-pencil"></i>
              </button>
            ) : (
              <button
                title="AGREGAR"
                className="btn btn-primary btn-lg mx-1"
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
          </div>
        </form>
      </div>
      <div className="card-body cards-body-admin p-1">
        <ul className="list-group">
          {categorias.map((categoria) => (
            <li
              key={categoria._id}
              style={{ backgroundColor: categoria.fondo }}
              className="list-group-item d-flex justify-content-between align-items-center text-uppercase"
            >
              <span className="fw-bold fs-5 text-dark" role="button">
                {categoria.name}
              </span>
              <div>
                <button
                  onClick={async () => await deleteCategoria(categoria._id)}
                  title="ELIMINAR"
                  type="button"
                  className="btn btn-danger btn-lg"
                >
                  <i className="bi bi-trash"></i>
                </button>
                <button
                  onClick={() => selectCategoria(categoria._id)}
                  title="EDITAR"
                  type="button"
                  className="btn btn-primary ms-1 btn-lg"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer p-1">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {categoria.createdAt && formatoFecha(categoria.createdAt)[0]}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{categoria.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>
            {categoria.lastEdit && formatoFecha(categoria.lastEdit)[0]}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CategoriasForm;
