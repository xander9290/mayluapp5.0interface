import { useRef, useState } from "react";
import { verifyExiste } from "../../../../helpers";

function CompuestoForm({
  compuestos,
  compuesto,
  initialCompuesto,
  setCompuesto,
  createCompuesto,
  updateCompuesto,
  almacenes,
  categorias,
}) {
  const nameInput = useRef();
  const [insumos, setInsumos] = useState([]);
  const [insumo, setInsumo] = useState({});

  const handleCompuesto = (e) => {
    setCompuesto({ ...compuesto, [e.target.name]: e.target.value });
  };

  const handleAlmacen = (e) => {
    const getAlmacen = almacenes.find(
      (almacen) => almacen._id === e.target.value
    );
    if (getAlmacen) {
      setInsumos(getAlmacen.insumos);
    }
  };

  const handleInsumo = (e) => {
    const getInsumo = insumos.find((insumo) => insumo._id === e.target.value);
    if (getInsumo) {
      setInsumo(getInsumo);
    } else {
      setInsumo({});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (compuesto._id) {
      const newCompuesto = {
        ...compuesto,
        price: calcularPrecio().precio,
        precioInsumo: parseInt(insumo.price),
        insumo: parseInt(insumo.unidad),
        medida: compuesto.medida,
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
        precioInsumo: parseInt(insumo.price),
        insumo: parseInt(insumo.unidad),
        medida: compuesto.medida,
        rendimiento: calcularPrecio().rendimiento,
        insumoId: insumo._id,
      };
      createCompuesto(newCompuesto);
      cancelar();
    }
  };

  const calcularPrecio = () => {
    const xinsumo = parseInt(insumo.unidad);
    const precioInsumo = parseInt(insumo.price);
    const unidad = parseInt(compuesto.unidad);
    let precio = Math.ceil((precioInsumo * unidad) / xinsumo);
    if (precio === 0) precio = 1;
    const rendimiento = Math.ceil(xinsumo / unidad);
    return { precio, rendimiento };
  };

  const cancelar = () => {
    setCompuesto(initialCompuesto);
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Compuestos
          <span className="badge bg-primary ms-1">{compuestos.length}</span>
          {compuesto._id && <small>{" <Edición>"}</small>}
        </h5>
      </div>
      <div className="card-body p-1">
        <div className="mb-1">
          <input
            className="form-control"
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
            className="form-control"
            type="text"
            name="unidad"
            min="0"
            value={compuesto.unidad}
            onChange={handleCompuesto}
            placeholder="Unidad"
            autoComplete="off"
            required
          />
          <select
            className="form-select text-uppercase"
            name="medida"
            value={compuesto.medida}
            onChange={handleCompuesto}
            required
          >
            <option value="">Medida</option>
            <option value="gr">Gr</option>
            <option value="ml">Ml</option>
            <option value="kg">KG</option>
            <option value="pza">Pza</option>
          </select>
        </div>
        <fieldset>
          <legend className="text-dark">Insumos</legend>
          <select
            className="form-select text-uppercase mb-2"
            name="almacenes"
            onChange={handleAlmacen}
          >
            <option value="">Almacén</option>
            {almacenes.map((almacen) => (
              <option key={almacen._id} value={almacen._id} className="fs-4">
                {almacen.name}
              </option>
            ))}
          </select>
          <select
            name="insumoId"
            className="form-select text-uppercase mb-2"
            onChange={handleInsumo}
            required
          >
            <option value="">Insumos</option>
            {insumos.map((insumo) => (
              <option className="fs-4" key={insumo._id} value={insumo._id}>
                {insumo.name}
              </option>
            ))}
          </select>
          <select
            className="form-select mb-1 text-uppercase"
            name="categoriaId"
            value={compuesto.categoriaId}
            onChange={handleCompuesto}
            required
          >
            <option value="">Categoría</option>
            {categorias.map((categoria) => (
              <option
                className="fs-4"
                key={categoria._id}
                value={categoria._id}
              >
                {categoria.name}
              </option>
            ))}
          </select>
        </fieldset>
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
      <div className="card-footer p-1"></div>
    </form>
  );
}

export default CompuestoForm;
