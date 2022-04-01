import { useState, useEffect } from "react";

function CompuestosTable({
  setCompuesto,
  compuestos,
  deleteCompuesto,
  asignarCompuesto,
}) {
  const [buscar, setBuscar] = useState({ buscar: "" });
  const [idx, setIdx] = useState("");
  const [listaCompuestos, setListaCompuestos] = useState([]);

  useEffect(() => {
    setListaCompuestos(compuestos);
  }, [compuestos]);

  const handleBuscar = (e) => {
    setBuscar({ ...buscar, [e.target.name]: e.target.value });
  };

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    setIdx("");
    busqueda();
  };

  const busqueda = () => {
    const result = compuestos.filter((compuesto) =>
      compuesto.name.toLowerCase().includes(buscar.buscar.toLocaleLowerCase())
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setListaCompuestos(result);
    } else {
      alert("producto no encontrado".toUpperCase());
    }
  };

  const selectCompuesto = (id) => {
    const findCompuesto = listaCompuestos.find(
      (compuesto) => compuesto._id === id
    );
    if (findCompuesto) setCompuesto(findCompuesto);
  };

  const actualizar = () => {
    setListaCompuestos(compuestos);
    setIdx("");
    setBuscar({ buscar: "" });
  };

  return (
    <div className="card bg-white">
      <div className="card-header p-1 d-flex justify-content-between">
        <form className="d-flex" onSubmit={handleSubmitBuscar}>
          <input
            className="form-control form-control-lg"
            type="text"
            name="buscar"
            value={buscar.buscar}
            onChange={handleBuscar}
            required
            autoComplete="off"
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
          className="btn btn-success btn-lg text-dark"
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          Actualizar
        </button>
      </div>
      <div
        style={{ height: "500px", overflow: "auto" }}
        className="card-body p-1"
      >
        <table className="table table-bordered text-dark">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">
                <i className="bi bi-arrow-right-square"></i>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">medida</th>
              <th scope="col">unidad</th>
              <th scope="col">precio</th>
              <th scope="col">rdto</th>
            </tr>
          </thead>
          <tbody>
            {listaCompuestos.map((compuesto) => (
              <tr
                key={compuesto._id}
                id={compuesto._id}
                style={{ cursor: "default" }}
                onClick={() => setIdx(compuesto._id)}
                className={`text-uppercase ${
                  compuesto._id === idx ? "bg-info" : ""
                }`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={async () => await deleteCompuesto(compuesto._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectCompuesto(compuesto._id)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <td className="fs-5 text-center">
                  <button
                    onClick={() => asignarCompuesto(compuesto._id)}
                    title="ASIGNAR"
                    type="button"
                    className="btn btn-warning btn-sm"
                  >
                    <i className="bi bi-arrow-right-square"></i>
                  </button>
                </td>
                <td className="fs-5">{compuesto.name}</td>
                <td className="fs-5 text-center">{compuesto.medida}</td>
                <td className="fs-5 text-center">{compuesto.unidad}</td>
                <td className="fs-5 text-end">${compuesto.price}</td>
                <td className="fs-5 text-center">{compuesto.rendimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompuestosTable;
