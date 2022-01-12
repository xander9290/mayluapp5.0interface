import { useState, useEffect } from "react";
import routes from "../routes";

const url = "http://localhost:3100/clientes";
function useClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(async () => {
    const data = await routes.get(url);
    setClientes(data);
  }, []);

  const createCliente = (body, cb) => {
    routes
      .post(url, body)
      .then((data) => {
        setClientes([data, ...clientes]);
        cb(data);
      })
      .catch((error) => console.log(error));
  };

  const updateCliente = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = clientes.findIndex((cliente) => cliente._id === id);
        let list = clientes;
        list[idx] = data;
        setClientes([...list]);
      })
      .catch((error) => console.log(error));
  };

  const deleteCliente = async (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = clientes.filter((cliente) => cliente._id !== id);
      setClientes(changedValues);
    }
  };

  return { clientes, createCliente, updateCliente, deleteCliente };
}

export default useClientes;
