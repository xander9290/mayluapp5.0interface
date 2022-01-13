import { useState, useEffect } from "react";
import routes from "../routes";

const url = "http://localhost:3100/operadores";
function useOperador() {
  const [operadores, setOperadores] = useState([]);
  const [session, setSession] = useState({
    login: false,
    operador: null,
    rol: null,
  });

  useEffect(async () => {
    const data = await routes.get(url);
    setOperadores(data);
  }, []);

  const createOperador = (body) => {
    routes
      .post(url, body)
      .then((data) => {
        setOperadores([data, ...operadores]);
      })
      .catch((error) => console.log(error));
  };

  const loginOperador = (body, res) => {
    routes
      .post(url + "/login", body)
      .then((data) => {
        if (data.login) {
          setSession({
            login: data.login,
            operador: data.operador.name,
            rol: data.operador.rol,
          });
        }
        res(data.login);
      })
      .catch((error) => console.log(error));
  };

  const exitProcess = async () => {
    await routes.post(url + "/exit");
  };

  const updateOperador = (id, body) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = operadores.findIndex((operador) => operador._id === id);
        let list = operadores;
        list[idx] = data;
        setOperadores([...list]);
      })
      .catch((error) => console.log(error));
  };

  const deleteOperador = async (id) => {
    if (id === "61c41e4febfb09c8211a3053") return;
    if (!window.confirm("Confirmar Acción")) return;
    const data = await routes.delete(url + "/" + id);
    if (data) {
      const changedValues = operadores.filter(
        (operador) => operador._id !== id
      );
      setOperadores(changedValues);
    }
  };

  return {
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    exitProcess,
  };
}

export default useOperador;
