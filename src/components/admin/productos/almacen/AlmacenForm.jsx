import { useState } from "react";

const initAlmacen = {
  name: "",
  insumos: [],
};
function AlmacenForm({
  almacenes,
  createAlmacen,
  updateAlmacen,
  deleteAlmacen,
  selectAlmacen,
}) {
  const [almacen, setAlmacen] = useState(initAlmacen);
  const [idx, setIdx] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (almacen._id) {
      updateAlmacen(almacen._id, almacen);
      setAlmacen(initAlmacen);
    } else {
      createAlmacen(almacen);
      setAlmacen(initAlmacen);
    }
  };

  const editAlmacen = (id) => {
    const findAlmacen = almacenes.find((almacen) => almacen._id === id);
    setAlmacen(findAlmacen);
  };

  return (
    <div className="card bg-white mb-2">
      <div className="card-header p-1">
        <h5 className="card-title">
          Almacenes
          <span className="badge bg-primary ms-1">{almacenes.length}</span>
          {almacen._id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            className="form-control"
            type="text"
            name="name"
            value={almacen.name}
            onChange={(e) =>
              setAlmacen({ ...almacen, [e.target.name]: e.target.value })
            }
            placeholder="Nuevo"
            autoComplete="off"
            required
          />
          {almacen._id ? (
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
            onClick={() => setAlmacen(initAlmacen)}
            title="CANCELAR"
            className="btn btn-warning"
            type="reset"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </form>
      </div>
      <div
        style={{ height: "200px", overflowY: "auto" }}
        className="card-body p-0 py-1"
      >
        <ul className="list-group">
          {almacenes.map((almacen) => (
            <li
              key={almacen._id}
              style={{ userSelect: "none" }}
              onClick={() => setIdx(almacen._id)}
              onDoubleClick={() => selectAlmacen(almacen._id)}
              className={`list-group-item p-1 text-dark d-flex justify-content-between align-items-center text-uppercase ${
                almacen._id === idx ? "bg-info" : "bg-white"
              }`}
            >
              <div>
                <button
                  onClick={async () => await deleteAlmacen(almacen._id)}
                  title="ELIMINAR"
                  type="button"
                  className="btn btn-danger btn-sm me-1"
                >
                  <i className="bi bi-trash"></i>
                </button>
                <button
                  onClick={() => editAlmacen(almacen._id)}
                  title="EDITAR"
                  type="button"
                  className="btn btn-primary btn-sm"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <span className="fw-bold text-dark">{almacen.name}</span>
              <button
                title="SELECCIONAR"
                type="button"
                className="btn btn-secondary"
                onClick={() => selectAlmacen(almacen._id)}
              >
                <i className="bi bi-arrow-right-square"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AlmacenForm;
