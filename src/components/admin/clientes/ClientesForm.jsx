import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, formatoFecha } from "../../../helpers";

function ClientesForm({ cliente, setCliente, initialCliente }) {
  const { clientes, createCliente, updateCliente, session } =
    useContext(AppContext);

  const handleCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cliente._id) {
      const newCliente = {
        ...cliente,
        lastEdit: fechaISO(),
      };
      updateCliente(cliente._id, newCliente);
      cancelar();
    } else {
      const newCliente = {
        ...cliente,
        createdBy: session.operador,
      };
      createCliente(newCliente);
      cancelar();
    }
  };

  const cancelar = () => {
    setCliente(initialCliente);
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Clientes <span className="badge bg-primary">{clientes.length}</span>
          {cliente._id && "<Modo Edición>"}
        </h5>
      </div>
      <div className="card-body p-1 text-dark">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="label-form fs-5">Contacto</label>
            <input
              className="form-control form-control-lg mb-1"
              type="text"
              name="name"
              value={cliente.name}
              onChange={handleCliente}
              autoComplete="off"
              required
              placeholder="Nombre"
            />
            <input
              className="form-control form-control-lg"
              type="text"
              name="tel"
              value={cliente.tel}
              onChange={handleCliente}
              autoComplete="off"
              required
              placeholder="Teléfono"
            />
          </div>
          <div className="mb-3">
            <label className="label-form fs-5">Dirección</label>
            <input
              className="form-control form-control-lg mb-1"
              type="text"
              name="calle"
              value={cliente.calle}
              onChange={handleCliente}
              autoComplete="out"
              required
              placeholder="Calle y Número"
            />
            <input
              className="form-control form-control-lg mb-1"
              type="text"
              name="cruces"
              value={cliente.cruces}
              onChange={handleCliente}
              autoComplete="no"
              required
              placeholder="Cruces"
            />
            <input
              className="form-control form-control-lg mb-1"
              type="text"
              name="colonia"
              value={cliente.colonia}
              onChange={handleCliente}
              autoComplete="off"
              placeholder="Colonia"
            />
            <textarea
              className="form-control form-control-lg"
              name="obs"
              value={cliente.obs}
              onChange={handleCliente}
              rows="2"
              placeholder="Observaciones"
            ></textarea>
          </div>
          <div className="mb-2">
            {cliente._id ? (
              <button
                title="EDITAR"
                className="btn btn-primary btn-lg"
                type="submit"
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
            ) : (
              <button
                title="AGREGAR"
                className="btn btn-primary btn-lg"
                type="submit"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Guardar
              </button>
            )}
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning btn-lg ms-2"
              type="reset"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <div className="card-footer p-1">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>{cliente.createdAt && formatoFecha(cliente.createdAt)[0]}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{cliente.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>{cliente.lastEdit && formatoFecha(cliente.lastEdit)[0]}</span>
        </p>
      </div>
    </div>
  );
}

export default ClientesForm;
