import { useEffect, useState } from "react";
import dateFormat, { masks } from "dateformat";
import { fechaActual } from "../../../../helpers";

function InsumosTable({
  insumos,
  selectInsumo,
  deleteInsumo,
  setEditInsumo,
  isEntradasSelected,
  setIsEntradasSelected,
  entradasList,
  actualizarStock,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [idx, setIdx] = useState("");
  const [listaInsumos, setListaInsumos] = useState([]);
  const [price, setPrice] = useState(0);
  const [fecha, setFecha] = useState(fechaActual(Date.now()));
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    setListaInsumos(insumos);
  }, [insumos]);

  useEffect(() => {
    if (entradasList.length > 0) {
      setListaInsumos(entradasList);
      calcularPrice();
    } else {
      setListaInsumos([]);
    }
  }, [entradasList]);

  useEffect(() => {
    if (!localStorage.getItem("lastUpdatedStock")) {
      localStorage.setItem("lastUpdatedStock", "");
    }

    setLastUpdate(localStorage.getItem("lastUpdatedStock"));
  }, []);

  const calcularPrice = () => {
    let total = 0;
    const calculables = entradasList.filter(
      (entrada) => entrada.cancelado === false
    );
    calculables.map((c) => {
      total += c.price;
    });
    setPrice(total);
  };

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    const result = insumos.filter(
      (insumo) =>
        insumo.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        insumo.codigo === busqueda
    );
    if (result.length === 1) {
      const id = result[0]._id;
      setIdx(id);
      document.getElementById(id).scrollIntoView();
    } else if (result.length > 1) {
      setIdx("");
      setListaInsumos(result);
    } else {
      alert("producto no encontrado".toUpperCase());
    }
  };

  const handleActualizarStock = (e) => {
    e.preventDefault();
    actualizarStock(fecha);
  };

  const actualizar = () => {
    setIdx("");
    setListaInsumos(insumos);
    setBusqueda("");
    setIsEntradasSelected(false);
  };
  return (
    <div className="card bg-white">
      <div className="card-header p-1 d-flex justify-content-between align-items-center">
        <form className="d-flex" onSubmit={handleSubmitBusqueda}>
          <input
            className="form-control"
            type="text"
            name="name"
            onChange={(e) => setBusqueda(e.target.value)}
            required
            autoComplete="off"
            placeholder="Buscar..."
          />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
        {isEntradasSelected ? (
          <h4 className="card-title">Entrada de Insumos</h4>
        ) : (
          <h4 className="card-title">Almacén</h4>
        )}
        <button
          onClick={actualizar}
          type="button"
          title="Actualizar"
          className="btn btn-success text-dark"
        >
          <i className="bi bi-arrow-repeat"></i>
        </button>
      </div>
      <div
        style={{ height: "470px", overflow: "scroll" }}
        className="card-body p-0"
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
              <th scope="col">stock</th>
              <th scope="col">precio</th>
              {isEntradasSelected ? <th scope="col">proveedor</th> : null}
              <th scope="col">creación</th>
              <th scope="col">código</th>
            </tr>
          </thead>
          <tbody>
            {listaInsumos.map((insumo) => (
              <tr
                key={insumo._id}
                id={insumo._id}
                style={{ cursor: "default", userSelect: "none" }}
                onClick={() => setIdx(insumo._id)}
                onDoubleClick={() => selectInsumo(insumo._id)}
                className={`text-uppercase ${
                  insumo._id === idx ? "bg-info" : ""
                } ${insumo.cancelado ? "bg-danger" : ""}`}
              >
                <th scope="row" className="text-center">
                  <button
                    onClick={() => deleteInsumo(insumo._id)}
                    title="ELIMINAR"
                    type="button"
                    className="btn btn-danger btn-sm"
                    disabled={insumo.cancelado}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => setEditInsumo(insumo)}
                    title="EDITAR"
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={isEntradasSelected ? true : false}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </th>
                <th scope="row" className="text-center">
                  <button
                    onClick={() => selectInsumo(insumo._id)}
                    title="Seleccionar"
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={isEntradasSelected ? true : false}
                  >
                    <i className="bi bi-arrow-right-square"></i>
                  </button>
                </th>
                <td className="text-nowrap fs-5">{insumo.name}</td>
                <td className="text-center text-nowrap fs-5">
                  {insumo.unidad} {insumo.medida}
                </td>
                <td className="text-center text-nowrap fs-5">{insumo.stock}</td>
                <td className="text-end fs-5">${insumo.price}</td>
                {isEntradasSelected ? (
                  <td className="fs-5 text-nowrap">{insumo.proveedor}</td>
                ) : null}
                <td className="text-center text-nowrap fs-5">
                  {dateFormat(insumo.createdAt, "dd/mm/yyyy HH:MM")}
                </td>
                <td className="text-center fs-5">{insumo.codigo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-1 d-flex justify-content-end">
        {isEntradasSelected ? (
          <span className="fs-4">Total: ${price}</span>
        ) : (
          <form onSubmit={handleActualizarStock} className="d-flex">
            <input
              type="date"
              name="fecha1"
              value={fecha}
              min={lastUpdate}
              max={fechaActual(Date.now())}
              onChange={(e) => setFecha(e.target.value)}
              className="form-control"
              required
            />
            <button
              title="Actualizar Stock"
              className="btn btn-warning"
              type="submit"
            >
              <i className="bi bi-arrow-repeat"></i>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default InsumosTable;
