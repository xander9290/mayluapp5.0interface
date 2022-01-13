import { useState, useEffect } from "react";
import routes from "../routes";

const url = "/caja";
const puerto = "8080";
const nombreImpresora = "maylu_printer";
function useCaja() {
  const [cajas, setCajas] = useState([]);

  useEffect(async () => {
    const data = await routes.get(url);
    setCajas(data);
    await startCajonPlugin();
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

  const startCajonPlugin = async () => {
    await routes.post(url + "/starcajonplugin");
  };

  const abrirCajon = async () => {
    const respuesta = await fetch(
      `http://localhost:${puerto}/?impresora=${nombreImpresora}`
    );
    const respuestaDecodificada = await respuesta.json();
    if (respuesta.status === 200) {
      console.log("Cajón abierto");
    } else {
      console.log("Error abriendo: " + respuestaDecodificada);
    }
  };

  return { cajas, createCaja, deleteCaja, abrirCajon };
}

export default useCaja;
