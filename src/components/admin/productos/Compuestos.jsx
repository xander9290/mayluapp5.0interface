import { useContext, useState, useRef } from "react";
import { AppContext } from "../../contexts/AppContext";
import { verifyExiste } from "../../../helpers";
import CompuestosTable from "./CompuestosTable";
import AsignarCompuesto from "./AsignarCompuesto";

const initialCompuesto = {
  name: "",
  medida: 0,
  unidad: "",
  price: 0, // precio del compuesto
  punitario: "", // precio del insumo NUMBER
  insumo: "", // medida del insumo NUMBER
  rendimiento: 0,
};
function Compuestos({}) {
  const nameInput = useRef();
  const {
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    productos,
    updateProducto,
  } = useContext(AppContext);
  const [compuesto, setCompuesto] = useState(initialCompuesto);
  const [listaCompuestos, setListaCompuestos] = useState([]);

  const handleCompuesto = (e) => {
    setCompuesto({ ...compuesto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (compuesto._id) {
      const newCompuesto = {
        ...compuesto,
        price: calcularPrecio().precio,
        punitario: parseInt(compuesto.punitario),
        insumo: parseInt(compuesto.insumo),
        medida: parseInt(compuesto.medida),
        rendimiento: calcularPrecio().rendimiento,
      };
      updateCompuesto(compuesto._id, newCompuesto);
      cancelar();
    } else {
      if (verifyExiste(compuestos, compuesto.name)) {
        nameInput.current.focus();
        alert(
          `!ERROR!\nEl valor "${compuesto.name}" para este compuesto no esta disponible.`
        );
        return;
      }

      const newCompuesto = {
        ...compuesto,
        price: calcularPrecio().precio,
        punitario: parseInt(compuesto.punitario),
        insumo: parseInt(compuesto.insumo),
        medida: parseInt(compuesto.medida),
        rendimiento: calcularPrecio().rendimiento,
      };
      createCompuesto(newCompuesto);
      cancelar();
    }
  };

  const calcularPrecio = () => {
    const insumo = parseInt(compuesto.insumo);
    const punitario = parseInt(compuesto.punitario);
    const medida = parseInt(compuesto.medida);
    let precio = Math.ceil((punitario * medida) / insumo);
    if (precio === 0) precio = 1;
    const rendimiento = Math.ceil(insumo / medida);
    return { precio, rendimiento };
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

  const desAsginarCompuesto = (id) => {
    if (!window.confirm("Confirmar")) return;
    const updateCompuestos = listaCompuestos.filter(
      (compuesto) => compuesto._id !== id
    );
    setListaCompuestos(updateCompuestos);
  };

  const cancelar = () => {
    setCompuesto(initialCompuesto);
  };
  return (
    <div className="row">
      <div className="col-md-3 p-1">
        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="card bg-white mb-2">
          <div className="card-header">
            <h5 className="card-title">
              Compuestos
              <span className="badge bg-primary">{compuestos.length}</span>
              {compuesto._id && <small>{" <Edición>"}</small>}
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-1">
              <input
                className="form-control form-control-lg"
                type="text"
                name="name"
                ref={nameInput}
                value={compuesto.name}
                onChange={handleCompuesto}
                placeholder="Nombre"
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-1 d-flex">
              <input
                className="form-control form-control-lg"
                type="text"
                name="medida"
                min="0"
                value={compuesto.medida}
                onChange={handleCompuesto}
                placeholder="Medida"
                autoComplete="off"
                required
              />
              <select
                className="form-select form-select-lg text-uppercase"
                name="unidad"
                value={compuesto.unidad}
                onChange={handleCompuesto}
                required
              >
                <option value="">Unidad</option>
                <option value="gr">Gr</option>
                <option value="ml">Ml</option>
                <option value="kg">KG</option>
                <option value="pza">Pza</option>
              </select>
            </div>
            <fieldset>
              <legend className="text-dark">Insumo</legend>
              <div className="mb-1 d-flex">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="insumo"
                  value={compuesto.insumo}
                  onChange={handleCompuesto}
                  placeholder="Insumo GR"
                  autoComplete="off"
                  required
                />
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="punitario"
                  value={compuesto.punitario}
                  onChange={handleCompuesto}
                  placeholder="Precio $"
                  autoComplete="off"
                  required
                />
              </div>
            </fieldset>
            <div className="mb-2"></div>
            {compuesto._id ? (
              <button title="EDITAR" className="btn btn-primary" type="submit">
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
            ) : (
              <button title="AGREGAR" className="btn btn-primary" type="submit">
                <i className="bi bi-plus-circle me-2"></i>
                Agregar
              </button>
            )}
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning ms-2"
              type="reset"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
          </div>
          <div className="card-footer p-1">
            <h5>
              Precio del producto: $
              {listaCompuestos.reduce((pre, cur) => pre + cur.price, 0)}
            </h5>
          </div>
        </form>
      </div>
      <div className="col-md-6 p-1">
        {/* TABLE */}
        <CompuestosTable
          setCompuesto={setCompuesto}
          compuestos={compuestos}
          deleteCompuesto={deleteCompuesto}
          asignarCompuesto={asignarCompuesto}
        />
      </div>
      <div className="col-md-3 p-1">
        <AsignarCompuesto
          productos={productos}
          updateProducto={updateProducto}
          setListaCompuestos={setListaCompuestos}
          listaCompuestos={listaCompuestos}
          desAsginarCompuesto={desAsginarCompuesto}
        />
      </div>
    </div>
  );
}

export default Compuestos;
