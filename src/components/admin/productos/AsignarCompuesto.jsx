import { useState } from "react";

function AsignarCompuesto({
  productos,
  updateProducto,
  setListaCompuestos,
  listaCompuestos,
  desAsginarCompuesto,
}) {
  const [productoId, setProductoId] = useState("");
  const [err, setErr] = useState(null);
  const [producto, setProducto] = useState({});

  const handleProductoId = (e) => {
    if (e.target.value === "") {
      limpiar();
      return;
    }
    setProductoId(e.target.value);
    const getProducto = productos.find(
      (producto) => producto._id === e.target.value
    );
    setProducto(getProducto);
    setListaCompuestos(getProducto.compuestos);
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
      <div className="card-header p-1">
        {setErr && <small className="text-form text-danger fs-6">{err}</small>}
        <select
          onChange={handleProductoId}
          className="form-select text-uppercase"
          name="productoId"
        >
          <option value="">Producto</option>
          {productos.map((producto) => (
            <option key={producto._id} value={producto._id}>
              {producto.name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{ height: "400px", overflowY: "auto" }}
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
                onClick={() => desAsginarCompuesto(compuesto._id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="bi bi-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer p-1">
        <button type="submit" className="btn btn-primary btn-lg mx-1">
          Asginar
        </button>
        <button
          onClick={limpiar}
          type="reset"
          className="btn btn-warning btn-lg"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default AsignarCompuesto;
