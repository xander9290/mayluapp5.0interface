import { useEffect, useRef, useState } from "react";
import { fechaActual, fechaISO } from "../../../../helpers";
import { v4 as uuidv4 } from "uuid";
import dateFormat, { masks } from "dateformat";

const initStock = {
  price: "",
  stock: "",
  pesoBruto: "",
  proveedor: "",
};
const initBusqueda = {
  codigo: "",
  name: "",
};
function Entradas({
  almacenId,
  insumo,
  findInsumo,
  entradas,
  createEntrada,
  selectEntradas,
  isEntradasSelected,
}) {
  const codigoRef = useRef();
  const stockRef = useRef();
  const [stock, setStock] = useState(initStock);
  const [busqueda, setBusqueda] = useState(initBusqueda);
  const [proveedor, setProveedor] = useState("");
  const [entradasList, setEntradasList] = useState([].reverse());

  const handleStock = (e) => {
    let value = e.target.value;
    if (isNaN(value) || value === "") value = 0;
    setStock({ ...stock, [e.target.name]: parseFloat(value) });
  };

  const handleBusqueda = (e) => {
    e.preventDefault();
    if (!almacenId) {
      alert("Selecciona un almacén para continuar");
      return;
    }
    findInsumo(busqueda.codigo, (res) => {
      if (!res) {
        alert("Insumo no encontrado");
        codigoRef.current.select();
      } else {
        stockRef.current.focus();
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!almacenId) {
      alert("Selecciona un almacén para continuar");
      return;
    }
    if (!insumo._id) return;
    const newEntrada = {
      ...insumo,
      ...stock,
      _id: uuidv4(),
      stock: parseInt(stock.stock),
      createdAt: fechaISO(),
      fecha: fechaActual(Date.now()),
      cancelado: false,
      proveedor,
    };
    createEntrada(newEntrada);
    cancelar();
  };

  const cancelar = () => {
    setBusqueda(initBusqueda);
    setStock(initStock);
    setProveedor("");
    codigoRef.current.focus();
  };

  useEffect(() => {
    if (insumo._id) {
      setBusqueda({ name: insumo.name, codigo: insumo.codigo });
    }
  }, [insumo]);

  useEffect(() => {
    if (entradas.length > 0) {
      const helper = {};
      const result = entradas.reduce(function (r, o) {
        let key = o.fecha;

        if (!helper[key]) {
          helper[key] = Object.assign({}, o); // create a copy of o
          r.push(helper[key]);
        } else {
          helper[key].precio += o.precio;
        }

        return r;
      }, []);
      setEntradasList(result.reverse());
    } else {
      setEntradasList([]);
    }
  }, [entradas]);

  return (
    <div className="card bg-white">
      <div className="card-header p-1">
        <h5 className="card-title">Entradas de Almacén</h5>
      </div>
      <div
        style={{ pointerEvents: isEntradasSelected ? "none" : "" }}
        className="card-body p-1"
      >
        <form onSubmit={handleBusqueda} className="d-flex mb-1">
          <input
            className="form-control"
            type="text"
            name="codigo"
            ref={codigoRef}
            maxLength="4"
            value={busqueda.codigo}
            onChange={(e) =>
              setBusqueda({ ...busqueda, [e.target.name]: e.target.value })
            }
            placeholder="codigo"
            required
            autoComplete="off"
          />
          <button title="BUSCAR" className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <input
              className="form-control text-uppercase"
              type="text"
              name="name"
              value={busqueda.name}
              placeholder="Descripción"
              readOnly
            />
          </div>
          <div className="mb-1 d-flex">
            <input
              className="form-control me-1"
              type="text"
              name="stock"
              ref={stockRef}
              value={stock.stock}
              onChange={handleStock}
              placeholder="Stock"
              autoComplete="off"
              required
            />
            <input
              className="form-control"
              type="text"
              name="price"
              value={stock.price}
              onChange={handleStock}
              placeholder="Precio $"
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-1">
            <input
              className="form-control"
              type="text"
              name="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Proveedor"
              autoComplete="off"
            />
          </div>
          <button className="btn btn-primary me-2" type="submit">
            Aceptar
          </button>
          <button onClick={cancelar} className="btn btn-warning" type="reset">
            Cancelar
          </button>
        </form>
      </div>
      <div className="card-footer p-0">
        <h5>Historial de Entradas</h5>
        <ul
          style={{ height: "150px", overflowY: "scroll" }}
          className="list-group"
        >
          {entradasList.map((entrada) => (
            <li
              onDoubleClick={() => selectEntradas(entrada.fecha)}
              style={{ userSelect: "none" }}
              key={entrada.fecha}
              className="list-group-item d-flex justify-content-between align-items-center bg-white text-dark"
            >
              <button
                onClick={() => selectEntradas(entrada.fecha)}
                title="Seleccionar"
                type="button"
                className="btn btn-secondary btn-sm"
              >
                <i className="bi bi-arrow-left-square"></i>
              </button>
              <span className="fs-5">
                {dateFormat(entrada.createdAt, "dd/mm/yyyy HH:MM")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Entradas;
