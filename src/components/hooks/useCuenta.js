import { useState, useEffect } from "react";
import routes from "../routes";
const initialCuenta = {
  folio: 0,
  orden: 0,
  torreta: "",
  personas: 1,
  servicio: "",
  clienteId: null,
  estado: "abierto",
  motivoCancelado: "",
  impreso: false,
  items: [],
  cashInfo: {
    importe: 0,
    dscto: 0,
    total: 0,
    efectivo: 0,
    tarjeta: 0,
    cambio: 0,
  },
  cardInfo: { porcentaje: 0, importe: 0, total: 0 },
  otroMedio: { medio: null, total: 0 },
  createdBy: "",
  repartidor: "",
  closedAt: "",
  time: "",
  fecha: "",
  obs: "",
};

const url = "/cuentas";
function useCuenta() {
  const [cuentas, setCuentas] = useState([]);
  const [cuenta, setCuenta] = useState(initialCuenta);

  useEffect(async () => {
    await cargarCuentas();
  }, []);

  const cargarCuentas = async () => {
    const data = await routes.get(url + "/abiertas");
    setCuentas(data);
  };

  const createCuenta = (body, cb) => {
    routes
      .post(url, body)
      .then((data) => {
        setCuentas([...cuentas, data]);
        setCuenta(data);
        cb(true);
      })
      .catch((error) => console.log(error));
  };

  const updateCuenta = (id, body, cb) => {
    routes
      .put(url + "/" + id, body)
      .then((data) => {
        const idx = cuentas.findIndex((cuenta) => cuenta._id === id);
        let list = cuentas;
        list[idx] = data;
        setCuentas([...list]);
        setCuenta(data);
        cb(true);
      })
      .catch((error) => console.log(error));
  };

  const reiniciarCuenta = () => {
    setCuenta(initialCuenta);
  };

  const selectCuenta = (id) => {
    let findCuenta;
    if (id) {
      findCuenta = cuentas.find((cuenta) => cuenta._id === id);
      if (findCuenta) setCuenta(findCuenta);
    } else {
      setCuenta(initialCuenta);
    }
  };

  return {
    cuentas,
    cargarCuentas,
    createCuenta,
    updateCuenta,
    cuenta,
    setCuenta,
    selectCuenta,
    reiniciarCuenta,
    initialCuenta,
  };
}

export default useCuenta;
