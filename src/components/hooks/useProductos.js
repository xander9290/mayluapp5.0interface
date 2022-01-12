import { useState, useEffect } from "react";
import routes from "../routes";

const url = "http://localhost:3100/productos";
function useProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(async () => {
    const data = await routes.get(url);
    setProductos(data);
  }, []);

  const createProducto = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setProductos([data, ...productos]);
      })
      .catch((err) => console.error(err));
  };

  const updateProducto = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = productos.findIndex((producto) => producto._id === id);
        let list = productos;
        list[idx] = data;
        setProductos([...list]);
      })
      .catch((err) => console.error(err));
  };

  const deleteProducto = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = productos.filter((producto) => producto._id !== id);
      setProductos(changedValues);
    }
  };

  return { productos, createProducto, updateProducto, deleteProducto };
}

export default useProductos;
