import { useState, useEffect } from "react";
import routes from "../routes";

const url = "http://localhost:3100/caja";
function useCaja() {
  const [cajas, setCajas] = useState([]);

  useEffect(async () => {
    const data = await routes.get(url);
    setCajas(data);
  }, []);

  const createCaja = async (body, cb) => {
    routes
      .post(url, body)
      .then((data) => {
        setCajas([data, ...cajas]);
        cb(data);
      })
      .catch((err) => console.error(err));
  };

  const deleteCaja = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = cajas.filter((caja) => caja._id !== id);
      setCajas(changedValues);
    }
  };

  return { cajas, createCaja, deleteCaja };
}

export default useCaja;
