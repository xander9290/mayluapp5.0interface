import { useState, useEffect } from "react";
import routes from "../routes";

const url = "/subcategorias";
function useSubcategorias() {
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    routes
      .get(url)
      .then((data) => {
        setSubcategorias(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const createSubcategoria = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setSubcategorias([data, ...subcategorias]);
      })
      .catch((err) => console.log(err));
  };

  const updateSubcategoria = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = subcategorias.findIndex(
          (subcategoria) => subcategoria._id === id
        );
        let list = subcategorias;
        list[idx] = data;
        setSubcategorias([...list]);
      })
      .catch((err) => console.log(err));
  };

  const deleteSubcategoria = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = subcategorias.filter(
        (subcategoria) => subcategoria._id !== id
      );
      setSubcategorias(changedValues);
    } else {
      console.error(data);
    }
  };

  return {
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
  };
}

export default useSubcategorias;
