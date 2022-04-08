import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { fechaISO, verifyExiste, genCodigo } from "../../../../helpers";

const initInsumo = {
  name: "",
  unidad: "",
  medida: "",
  stock: 0,
  price: "",
  createdAt: fechaISO(),
  cancelado: false,
};
function InsumoForm({
  insumos,
  createInsumo,
  updateInsumo,
  almacenId,
  editInsumo,
  setEditInsumo,
}) {
  const unidadRef = useRef();
  const nameRef = useRef();

  const [insumo, setInsumo] = useState(initInsumo);

  const handleInsumo = (e) => {
    setInsumo({ ...insumo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!almacenId) {
      alert("Selecciona un almacen para continuar");
      return;
    }
    if (isNaN(insumo.unidad) && isNaN(insumo.price)) {
      unidadRef.current.focus();
      return;
    }
    if (insumo._id) {
      const newInsumo = {
        ...insumo,
        price: parseFloat(insumo.price),
      };
      updateInsumo(insumo._id, newInsumo, null);
      setInsumo(initInsumo);
      setEditInsumo({});
    } else {
      if (verifyExiste(insumos, insumo.name)) {
        alert("ya existe un insumo con la misma descripción");
        return;
      }
      const newInsumo = {
        ...insumo,
        _id: uuidv4(),
        codigo: genCodigo(insumos).toString(),
        stock: parseInt(insumo.stock),
        price: parseFloat(insumo.price),
      };
      createInsumo(newInsumo);
      setInsumo(initInsumo);
      nameRef.current.focus();
    }
  };

  const cancelar = () => {
    setInsumo(initInsumo);
    setEditInsumo({});
  };

  useEffect(() => {
    if (editInsumo._id) setInsumo(editInsumo);
  }, [editInsumo]);

  return (
    <form onSubmit={handleSubmit} className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">
          Insumos
          <span className="badge bg-primary ms-1">{insumos.length}</span>
          {insumo._id && "<Modo Edición>"}
        </h5>
      </div>
      <div className="card-body p-1 text-dark">
        <div className="mb-1">
          <label>Nuevo Insumo</label>
          <input
            className="form-control"
            type="text"
            name="name"
            ref={nameRef}
            value={insumo.name}
            onChange={handleInsumo}
            placeholder="Descripción"
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-1 d-flex">
          <input
            className="form-control"
            type="text"
            ref={unidadRef}
            name="unidad"
            value={insumo.unidad}
            onChange={handleInsumo}
            required
            autoComplete="off"
            placeholder="Unidad"
          />
          <select
            className="form-select text-uppercase"
            name="medida"
            value={insumo.medida}
            onChange={handleInsumo}
            required
          >
            <option value="">Medida</option>
            <option className="fs-5" value="gr">
              Gr
            </option>
            <option className="fs-5" value="ml">
              Ml
            </option>
            <option className="fs-5" value="kg">
              Kg
            </option>
            <option className="fs-5" value="pza">
              pza
            </option>
          </select>
          <input
            className="form-control"
            type="text"
            name="price"
            value={insumo.price}
            onChange={handleInsumo}
            required
            autoComplete="off"
            placeholder="Precio $"
          />
        </div>
        <div className="mb-1">
          <label>Stock inicial</label>
          <input
            className="form-control"
            type="text"
            name="stock"
            value={insumo.stock}
            onChange={handleInsumo}
            autoComplete="off"
            placeholder="Stock inicial"
          />
        </div>
        {insumo._id ? (
          <button title="EDITAR" className="btn btn-primary mx-1" type="submit">
            Editar
          </button>
        ) : (
          <button
            title="AGREGAR"
            className="btn btn-primary mx-1"
            type="submit"
          >
            Agregar
          </button>
        )}
        <button
          onClick={cancelar}
          title="CANCELAR"
          className="btn btn-warning"
          type="reset"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default InsumoForm;
