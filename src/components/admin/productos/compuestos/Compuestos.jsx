import { useContext, useState, useRef } from "react";
import { verifyExiste } from "../../../../helpers";
import { AppContext } from "../../../contexts/AppContext";
import AsignarCompuesto from "./AsignarCompuestos";
import CompuestoForm from "./CompuestoForm";
import CompuestosTable from "./CopuestosTable";

const initialCompuesto = {
  name: "",
  medida: "",
  unidad: 0,
  price: 0, // precio del compuesto
  precioInsumo: 0, // precio del insumo NUMBER
  insumo: 0, // unidad del insumo NUMBER
  rendimiento: 0,
  insumoId: "",
  categoriaId: "",
};
function Compuestos() {
  const {
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    productos,
    updateProducto,
    almacenes,
    categorias,
  } = useContext(AppContext);
  const [compuesto, setCompuesto] = useState(initialCompuesto);
  const [listaCompuestos, setListaCompuestos] = useState([]);

  const selectCompuesto = (id) => {
    const getCompuesto = compuestos.find((compuesto) => compuesto._id === id);
    if (getCompuesto) setCompuesto(getCompuesto);
  };

  const asignarCompuesto = (id) => {
    const getCompuesto = compuestos.find((compuesto) => compuesto._id === id);
    if (verifyExiste(listaCompuestos, getCompuesto.name)) {
      alert("Ese elemento ya se encuentra en la lista");
      return;
    }
    const newCompuesto = [...listaCompuestos, getCompuesto];
    setListaCompuestos(newCompuesto);
  };

  const desAsignarCompuesto = (id) => {
    if (!window.confirm("Confirmar")) return;
    const updateCompuestos = listaCompuestos.filter(
      (compuesto) => compuesto._id !== id
    );
    setListaCompuestos(updateCompuestos);
  };

  return (
    <div className="row">
      <div className="col-md-3 p-1">
        <CompuestoForm
          compuestos={compuestos}
          compuesto={compuesto}
          initialCompuesto={initialCompuesto}
          setCompuesto={setCompuesto}
          createCompuesto={createCompuesto}
          updateCompuesto={updateCompuesto}
          almacenes={almacenes}
          categorias={categorias}
        />
      </div>
      <div className="col-md-6 p-1">
        <CompuestosTable
          compuestos={compuestos}
          deleteCompuesto={deleteCompuesto}
          selectCompuesto={selectCompuesto}
          asignarCompuesto={asignarCompuesto}
          categorias={categorias}
        />
      </div>
      <div className="col-md-3 p-1">
        <AsignarCompuesto
          listaCompuestos={listaCompuestos}
          setListaCompuestos={setListaCompuestos}
          productos={productos}
          desAsignarCompuesto={desAsignarCompuesto}
          updateProducto={updateProducto}
        />
      </div>
    </div>
  );
}

export default Compuestos;
