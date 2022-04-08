import { useState, useEffect } from "react";
import routes from "../routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/almacenes";
} else {
  url = "/almacenes";
}
function useAlmacen() {
  const [almacenes, setAlmacenes] = useState([]);

  useEffect(() => {
    routes
      .get(url)
      .then((data) => setAlmacenes(data))
      .catch((err) => console.log(err));
  }, []);

  const createAlmacen = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setAlmacenes([data, ...almacenes]);
      })
      .catch((err) => console.log(err));
  };

  const updateAlmacen = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const updatedAlmacen = almacenes.map((almacen) => {
          if (almacen._id === id) {
            almacen = data;
          }
          return almacen;
        });
        setAlmacenes(updatedAlmacen);
      })
      .catch((err) => console.log(err));
  };

  const deleteAlmacen = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = almacenes.filter((almacen) => almacen._id !== id);
      setAlmacenes(changedValues);
    } else {
      console.error(data);
    }
  };

  return { almacenes, createAlmacen, updateAlmacen, deleteAlmacen };
}

export default useAlmacen;
