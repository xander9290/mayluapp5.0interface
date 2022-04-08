import { useState } from "react";

function AsignarCompuesto({
  listaCompuestos,
  setListaCompuestos,
  productos,
  desAsignarCompuesto,
  updateProducto,
}) {
  const [err, setErr] = useState(null);
  const [producto, setProducto] = useState({});

  const handleProducto = (e) => {
    const findProducto = productos.find(
      (producto) => producto._id === e.target.value
    );
    if (findProducto) {
      setProducto(findProducto);
      setListaCompuestos(findProducto.compuestos);
    } else {
      setProducto({});
      setListaCompuestos([]);
    }
    setErr(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!producto._id) {
      setErr("selecciona un producto");
      return;
    }
    const newProducto = {
      ...producto,
      compuestos: listaCompuestos,
    };
    updateProducto(producto._id, newProducto);
    alert("Acción exitosa");
  };

  const limpiar = () => {
    setListaCompuestos([]);
    setProducto({});
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white">
      {setErr && <small className="text-form text-danger fs-6">{err}</small>}
      <div className="card-header d-flex p-1">
        <select
          onChange={handleProducto}
          className="form-select text-uppercase"
          name="productoId"
          required
        >
          <option value="">Producto</option>
          {productos.map((producto) => (
            <option key={producto._id} value={producto._id}>
              {producto.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary mx-1">
          <i className="bi bi-plus-circle"></i>
        </button>
        <button onClick={limpiar} type="reset" className="btn btn-warning">
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
      <div
        style={{ height: "450px", overflowY: "auto" }}
        className="card-body p-1"
      >
        <ul className="list-group">
          {listaCompuestos.map((compuesto) => (
            <li
              key={compuesto._id}
              style={{ userSelect: "none" }}
              className="list-group-item d-flex justify-content-between align-items-center bg-white text-dark"
            >
              <span className="text-uppercase">
                {compuesto.name} ${compuesto.price}
              </span>
              <button
                onClick={() => desAsignarCompuesto(compuesto._id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="bi bi-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer p-1 text-end">
        <h5>
          Costo del producto: $
          {listaCompuestos.reduce((prev, ac) => prev + ac.price, 0)}
        </h5>
      </div>
    </form>
  );
}

export default AsignarCompuesto;
