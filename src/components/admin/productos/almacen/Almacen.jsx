import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";

import AlmacenForm from "./AlmacenForm";
import Entradas from "./Entradas";
import InsumoForm from "./InsumoForm";
import InsumosTable from "./InsumosTable";
import useInsumo from "./useInsumo";

const initAlmacen = {
  name: "",
  insumos: [],
  entradas: [],
};
function Almacen({}) {
  const { almacenes, createAlmacen, updateAlmacen, deleteAlmacen } =
    useContext(AppContext);
  const [almacen, setAlmacen] = useState(initAlmacen);
  const [editInsumo, setEditInsumo] = useState({});

  const {
    insumo,
    selectInsumo,
    insumos,
    setInsumos,
    setEntradas,
    createInsumo,
    updateInsumo,
    deleteInsumo,
    findInsumo,
    entradas,
    createEntrada,
    selectEntradas,
    isEntradasSelected,
    setIsEntradasSelected,
    entradasList,
    actualizarStock,
  } = useInsumo({
    updateAlmacen,
    almacen,
  });

  const selectAlmacen = (id) => {
    const findAlmacen = almacenes.find((almacen) => almacen._id === id);
    if (findAlmacen) {
      setAlmacen(findAlmacen);
      setInsumos(findAlmacen.insumos);
      setEntradas(findAlmacen.entradas);
      setIsEntradasSelected(false);
    } else {
      alert("no se encontró ningún almacen");
    }
  };

  return (
    <div className="row">
      <div className="col-md-3 p-1">
        <AlmacenForm
          almacenes={almacenes}
          createAlmacen={createAlmacen}
          updateAlmacen={updateAlmacen}
          deleteAlmacen={deleteAlmacen}
          selectAlmacen={selectAlmacen}
        />
        <InsumoForm
          insumos={insumos}
          createInsumo={createInsumo}
          updateInsumo={updateInsumo}
          almacenId={almacen._id}
          setEditInsumo={setEditInsumo}
          editInsumo={editInsumo}
        />
      </div>
      <div className="col-md-6 p-1">
        <InsumosTable
          insumos={insumos}
          selectInsumo={selectInsumo}
          deleteInsumo={deleteInsumo}
          setEditInsumo={setEditInsumo}
          isEntradasSelected={isEntradasSelected}
          setIsEntradasSelected={setIsEntradasSelected}
          entradasList={entradasList}
          actualizarStock={actualizarStock}
        />
      </div>
      <div className="col-md-3 p-1">
        <Entradas
          almacenId={almacen._id}
          insumo={insumo}
          findInsumo={findInsumo}
          entradas={entradas}
          createEntrada={createEntrada}
          selectEntradas={selectEntradas}
          isEntradasSelected={isEntradasSelected}
        />
      </div>
    </div>
  );
}

export default Almacen;
