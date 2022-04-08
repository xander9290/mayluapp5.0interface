import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

function ProductosTable({ setProducto }) {
  const { productos, deleteProducto, categorias, subcategorias } =
    useContext(AppContext);
  const [listaProductos, setListaProductos] = useState([]);
  const [idx, setIdx] = useState("");
  const [buscar, setBuscar] = useState({ buscar: "" });

  useEffect(() => {
    setListaProductos(productos);
  }, [productos]);

  const handleBuscar = (e) => {
    setBuscar({ ...buscar, [e.target.name]: e.target.value });
  };

  const handleSubmitBuscar = (e) => {
    e.preventDefault();
    setIdx("");
    busqueda();
  };

  const busqueda = () => {
    const findSub = subcategorias.find(
      (sub) => sub.name === buscar.buscar.trim()
    );
    if (findSub) {
      const findProductosBySub = productos.filter(
        (producto) => producto.subcategoriaId === findSub._id
      );
      if (findProductosBySub.length > 0) setListaProductos(findProductosBySub);
    } else {
      const result = productos.filter(
        (producto) =>
          producto.name
            .toLowerCase()
            .includes(buscar.buscar.toLocaleLowerCase()) ||
          producto.codigo === parseInt(buscar.buscar)
      );
      if (result.length === 1) {
        const id = result[0]._id;
        setIdx(id);
        document.getElementById(id).scrollIntoView();
      } else if (result.length > 1) {
        setIdx("");
        setListaProductos(result);
      } else {
        alert("producto no encontrado".toUpperCase());
      }
    }
  };

  const selectProducto = (id) => {
    const findProducto = listaProductos.find((producto) => producto._id === id);
    if (findProducto) setProducto(findProducto);
  };

  const actualizar = () => {
    setListaProductos(productos);
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
              <th scope="col">Descripción</th>
              <th scope="col">precio</th>
              <th scope="col">Subcategoría</th>
              <th scope="col">área</th>
              <th scope="col">contable</th>
              <th scope="col">compuestos</th>
              <th scope="col">código</th>
            </tr>
          </thead>
          <tbody>
            {listaProductos.map((producto) => {
              let categoria = { name: "", fondo: "#FFFFFF" },
                subcategoria = { name: "" };
              let findSubcategoria = subcategorias.find(
                (sub) => sub._id === producto.subcategoriaId
              );
              if (findSubcategoria) {
                subcategoria = findSubcategoria;
                let findCategoria = categorias.find(
                  (cat) => cat._id === findSubcategoria.categoriaId
                );
                categoria = findCategoria;
              }
              return (
                <tr
                  key={producto._id}
                  id={producto._id}
                  style={{ cursor: "default" }}
                  onClick={() => setIdx(producto._id)}
                  className={`text-uppercase ${
                    producto._id === idx ? "bg-info" : ""
                  }`}
                >
                  <th scope="row" className="text-center">
                    <button
                      onClick={async () => await deleteProducto(producto._id)}
                      title="ELIMINAR"
                      type="button"
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </th>
                  <th scope="row" className="text-center">
                    <button
                      onClick={() => selectProducto(producto._id)}
                      title="EDITAR"
                      type="button"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </th>
                  <td className="fs-5 text-nowrap align-middle">
                    {producto.name}
                  </td>
                  <td className="text-center fs-5">${producto.price}</td>
                  <td
                    style={{
                      backgroundColor: categoria ? categoria.fondo : "",
                    }}
                    className="text-center"
                  >
                    {subcategoria.name && subcategoria.name}
                    {/* <small>
                      {" "}
                      {"<"}
                      {categoria.name && categoria.name}
                      {">"}
                    </small> */}
                  </td>
                  <td className="text-center">{producto.areaNota}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={producto.contable ? true : false}
                      readOnly
                    />
                  </td>
                  <td className="text-center">{producto.compuestos.length}</td>
                  <td className="text-center">{producto.codigo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductosTable;
