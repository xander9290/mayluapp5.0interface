import { useState, useEffect } from "react";
import routes from "../routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/categorias";
} else {
  url = "/categorias";
}
function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    routes
      .get(url)
      .then((data) => setCategorias(data))
      .catch((err) => console.log(err));
  }, []);

  const createCategoria = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setCategorias([data, ...categorias]);
      })
      .catch((err) => console.log(err));
  };

  const updateCategoria = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = categorias.findIndex((categoria) => categoria._id === id);
        let list = categorias;
        list[idx] = data;
        setCategorias([...list]);
      })
      .catch((err) => console.log(err));
  };

  const deleteCategoria = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = categorias.filter(
        (categoria) => categoria._id !== id
      );
      setCategorias(changedValues);
    } else {
      console.error(data);
    }
  };

  return { categorias, createCategoria, updateCategoria, deleteCategoria };
}

export default useCategorias;
