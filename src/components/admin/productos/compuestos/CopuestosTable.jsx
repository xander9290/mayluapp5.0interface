import { useEffect, useState } from "react";

function CompuestosTable({
  compuestos,
  deleteCompuesto,
  selectCompuesto,
  asignarCompuesto,
  categorias,
}) {
  const [compuestosList, setCompuestosList] = useState([]);
  const [idx, setIdx] = useState("");
  const [buscar, setBuscar] = useState("");

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    setIdx("");
    busqueda();
  };

  const busqueda = () => {
    const result = compuestos.filter((compuesto) =>
      compuesto.name.toLowerCase().includes(buscar.toLocaleLowerCase())
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setCompuestosList(result);
    } else {
      alert("producto no encontrado".toUpperCase());
    }
  };

  const buscarPorCategoria = (e) => {
    const findCompuestos = compuestos.filter(
      (compuesto) => compuesto.categoriaId === e.target.value
    );

    if (findCompuestos.length > 0) {
      setCompuestosList(findCompuestos);
    } else {
      setCompuestosList(compuestos);
    }
  };

  const actualizar = () => {
    setCompuestosList(compuestos);
    setIdx("");
    setBuscar("");
  };

  useEffect(() => {
    setCompuestosList(compuestos);
  }, [compuestos]);

  return (
    <div className="card bg-white">
      <div className="card-header p-1 d-flex justify-content-between align-items-center">
        <form className="d-flex" onSubmit={handleSubmitBuscar}>
          <input
            className="form-control"
            type="text"
            name="buscar"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            required
            autoComplete="off"
            placeholder="Buscar..."
          />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
          <select
            className="form-select mb-1 ms-2 text-uppercase"
            name="categoriaId"
            onChange={buscarPorCategoria}
          >
            <option value="">Categoría</option>
            {categorias.map((categoria) => (
              <option
                className="fs-4"
                key={categoria._id}
                value={categoria._id}
              >
                {categoria.name}
              </option>
            ))}
          </select>
        </form>
        <button
          onClick={actualizar}
          type="button"
          className="btn btn-success text-dark"
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
              <th scope="col">precio</th>
              <th scope="col">rdto</th>
            </tr>
          </thead>
          <tbody>
            {compuestosList.map((compuesto) => (
              <tr
                key={compuesto._id}
                id={compuesto._id}
                style={{ cursor: "default", userSelect: "none" }}
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
                    className="btn btn-dark btn-sm"
                  >
                    <i className="bi bi-arrow-right-square"></i>
                  </button>
                </td>
                <td className="text-nowrap align-middle">{compuesto.name}</td>
                <td className="text-center text-nowrap align-middle">
                  {compuesto.unidad} {compuesto.medida}
                </td>
                <td className="text-end align-middle">${compuesto.price}</td>
                <td className="text-center align-middle">
                  {compuesto.rendimiento}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompuestosTable;
