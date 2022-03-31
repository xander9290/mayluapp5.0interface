import { useState, useEffect } from "react";
import routes from "../routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/compuestos";
} else {
  url = "/compuestos";
}

function useCompuestos() {
  const [compuestos, setCompuestos] = useState([]);

  useEffect(async () => {
    const data = await routes.get(url);
    setCompuestos(data);
  }, []);

  const createCompuesto = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setCompuestos([data, ...compuestos]);
      })
      .catch((err) => console.error(err));
  };

  const updateCompuesto = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = compuestos.findIndex((compuesto) => compuesto._id === id);
        let list = compuestos;
        list[idx] = data;
        setCompuestos([...list]);
      })
      .catch((err) => console.error(err));
  };

  const deleteCompuesto = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = compuestos.filter(
        (compuesto) => compuesto._id !== id
      );
      setCompuestos(changedValues);
    }
  };

  return { compuestos, createCompuesto, updateCompuesto, deleteCompuesto };
}

export default useCompuestos;
