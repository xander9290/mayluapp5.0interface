import { useState } from "react";
import { fechaActual } from "../../../../helpers";
import routes from "../../../routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/cuentas";
} else {
  url = "/cuentas";
}
function useInsumo({ updateAlmacen, almacen }) {
  const [insumo, setInsumo] = useState({});
  const [insumos, setInsumos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [entradasList, setEntradasList] = useState([]);
  const [isEntradasSelected, setIsEntradasSelected] = useState(false);

  const selectInsumo = (id) => {
    if (isEntradasSelected) return;
    const getInsumo = insumos.find((insumo) => insumo._id === id);
    setInsumo(getInsumo);
  };

  const selectEntradas = (fecha) => {
    setIsEntradasSelected(false);
    const getEntradas = entradas.filter((entrada) => entrada.fecha === fecha);
    setEntradasList(getEntradas);
    setIsEntradasSelected(true);
  };

  const createInsumo = (formData) => {
    const updateInsumos = [formData, ...insumos];
    setInsumos(updateInsumos);
    const newAlmacen = {
      ...almacen,
      insumos: updateInsumos,
      entradas,
    };
    updateAlmacen(almacen._id, newAlmacen);
  };

  const updateInsumo = (id, newInsumo) => {
    const updateInsumos = insumos.map((insumo) => {
      if (insumo._id === id) {
        insumo = newInsumo;
      }
      return insumo;
    });
    setInsumos(updateInsumos);
    const newAlmacen = {
      ...almacen,
      insumos: updateInsumos,
      entradas,
    };
    updateAlmacen(almacen._id, newAlmacen);
  };

  const deleteInsumo = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    if (isEntradasSelected) {
      deleteEntrada(id);
    } else {
      const updateInsumos = insumos.filter((insumo) => insumo._id !== id);
      setInsumos(updateInsumos);
      const newAlmacen = {
        ...almacen,
        insumos: updateInsumos,
        entradas,
      };
      updateAlmacen(almacen._id, newAlmacen);
    }
  };

  const findInsumo = (codigo, cb) => {
    const findInsumo = insumos.find((insumo) => insumo.codigo === codigo);
    if (findInsumo) {
      setInsumo(findInsumo);
      cb(true);
    } else {
      cb(false);
    }
  };

  const createEntrada = (newEntrada) => {
    const updateEntrdas = [...entradas, newEntrada];
    setEntradas(updateEntrdas);
    const updateInsumos = insumos.map((insumo) => {
      if (insumo.codigo === newEntrada.codigo) {
        insumo.stock = parseFloat(newEntrada.stock) + parseFloat(insumo.stock);
      }
      return insumo;
    });
    setInsumos(updateInsumos);
    const newAlmacen = {
      ...almacen,
      insumos: updateInsumos,
      entradas: updateEntrdas,
    };
    updateAlmacen(almacen._id, newAlmacen);
  };

  const deleteEntrada = (id) => {
    const updateEntrdas = entradas.map((entrada) => {
      if (entrada._id === id) {
        entrada.cancelado = true;
      }
      return entrada;
    });
    setEntradas(updateEntrdas);
    setEntradasList(updateEntrdas);
    const entradasCanceladas = updateEntrdas.filter(
      (entrada) => entrada.cancelado === true
    );
    const updateInsumos = insumos.map((insumo) => {
      entradasCanceladas.map((entrada) => {
        if (insumo.codigo === entrada.codigo) {
          insumo.stock = parseFloat(insumo.stock) - parseFloat(entrada.stock);
          insumo.cancelado = false;
        }
        return entrada;
      });
      return insumo;
    });
    setInsumos(updateInsumos);
    const newAlmacen = {
      ...almacen,
      insumos: updateInsumos,
      entradas: updateEntrdas,
    };
    updateAlmacen(almacen._id, newAlmacen);
  };

  const actualizarStock = async (fecha) => {
    if (!almacen._id) {
      alert("Selecciona un almacén para continuar");
      return;
    }
    if (localStorage.getItem("lastUpdatedStock") === fecha) {
      alert("!ATENCIÓN!\nEsta fecha ya ha sido actualizada");
      return;
    }
    const data = await routes.get(url + "/historial/" + fecha);
    const cuentasContables = data.filter(
      (cuenta) => cuenta.estado !== "cancelado"
    );
    const getItems = [];
    cuentasContables.map((cuenta) => {
      cuenta.items.map((item) => {
        getItems.push(item);
      });
    });
    const itemsContables = getItems.filter((item) => item.cancelado === false);
    const getCompuestos = [];
    itemsContables.map((item) => {
      item.compuestos.map((com) => {
        getCompuestos.push(com);
      });
    });

    const updateInsumos = insumos.map((insumo) => {
      getCompuestos.map((compuesto) => {
        if (!compuesto) return;
        if (insumo._id === compuesto.insumoId) {
          insumo.stock =
            parseFloat(insumo.stock) - parseFloat(compuesto.unidad);
        }
        return compuesto;
      });
      return insumo;
    });

    setInsumos(updateInsumos);
    if (!window.confirm("¿Deseas guardar la actualización?")) {
      return;
    } else {
      localStorage.setItem("lastUpdatedStock", fecha);
      const newAlmacen = {
        ...almacen,
        insumos: updateInsumos,
        entradas,
      };
      updateAlmacen(almacen._id, newAlmacen);
    }
  };

  return {
    insumo,
    insumos,
    setInsumos,
    setEntradas,
    selectInsumo,
    createInsumo,
    updateInsumo,
    deleteInsumo,
    findInsumo,
    entradas,
    createEntrada,
    deleteEntrada,
    selectEntradas,
    isEntradasSelected,
    setIsEntradasSelected,
    entradasList,
    actualizarStock,
  };
}

export default useInsumo;
