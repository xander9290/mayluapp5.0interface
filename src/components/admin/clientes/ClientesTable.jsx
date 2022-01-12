import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../contexts/AppContext";

function ClientesTable({ setCliente }) {
  const { clientes, deleteCliente } = useContext(AppContext);

  const [listaClientes, setlistaClientes] = useState([]);
  const [idx, setIdx] = useState("");
  const [buscar, setBuscar] = useState({ buscar: "" });

  const buscarRef = useRef();
  useEffect(() => {
    setlistaClientes(clientes);
  }, [clientes]);

  const handleBuscar = (e) => {
    setBuscar({ ...buscar, [e.target.name]: e.target.value });
  };

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    const result = clientes.filter(
      (cliente) =>
        cliente.name
          .toLowerCase()
          .includes(buscar.buscar.toLocaleLowerCase()) ||
        cliente.codigo === parseInt(buscar.buscar) ||
        cliente.tel.toLowerCase().includes(buscar.buscar.toLocaleLowerCase())
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setlistaClientes(result);
    } else {
      alert("cliente no encontrado".toUpperCase());
      buscarRef.current.focus();
    }
  };

  const selectCliente = (id) => {
    const findCliente = clientes.find((cliente) => cliente._id === id);
    if (findCliente) setCliente(findCliente);
  };

  const actualizar = () => {
    setlistaClientes(clientes);
    setIdx("");
    setBuscar({ buscar: "" });
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1 d-flex justify-content-between">
        <form onSubmit={handleSubmitBuscar} className="d-flex">
          <input
            className="form-control form-control-lg"
            type="text"
            name="buscar"
            ref={buscarRef}
            value={buscar.buscar}
            onChange={handleBuscar}
            autoComplete="off"
            required
            placeholder="Buscar..."
          />
          <button
            title="BUSCAR"
            className="btn btn-primary btn-lg"
            type="submit"
          >
            <i className="bi bi-search"></i>
          </button>
        </form>
        <button
          onClick={actualizar}
          type="button"
          className="btn btn-success text-dark btn-lg"
        >
          <i className="bi bi-arrow-repeat"></i>
          Actualizar
        </button>
      </div>
      <div className="card-body p-1 cards-body-admin-productos">
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
              <th scope="col">Teléfono</th>
              <th scope="col">calle</th>
              <th scope="col">código</th>
            </tr>
          </thead>
          <tbody>
            {listaClientes.map((cliente) => (
              <tr
                id={cliente._id}
                key={cliente._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(cliente._id)}
                className={`text-uppercase ${
                  cliente._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={async () => await deleteCliente(cliente._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectCliente(cliente._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <td>{cliente.name}</td>
                <td>{cliente.tel}</td>
                <td>{cliente.calle}</td>
                <td className="text-center">{cliente.codigo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientesTable;
