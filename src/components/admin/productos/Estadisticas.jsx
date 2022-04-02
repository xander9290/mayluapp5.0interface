import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaActual } from "../../../helpers";
import routes from "../../routes";

let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3100/cuentas";
} else {
  url = "/cuentas";
}
const initialCriterios = {
  fecha1: fechaActual(Date.now()),
  fecha2: fechaActual(Date.now()),
  subcategoriaId: "",
};
function Estadisticas({}) {
  const { subcategorias } = useContext(AppContext);
  const [criterio, setCriterio] = useState(initialCriterios);
  const [listaCompuestos, setListaCompuestos] = useState([]);

  const handleCriterio = (e) => {
    setCriterio({ ...criterio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await routes.get(
      url + "/porfechas/" + criterio.fecha1 + "/" + criterio.fecha2
    );
    const cuentasContables = data.cuentas.filter(
      (cuenta) => cuenta.estado !== "cancelado"
    );

    const getItems = [];
    cuentasContables.map((cuenta) => {
      cuenta.items.map((item) => {
        getItems.push(item);
      });
    });
    const itemsContables = getItems.filter((item) => item.cancelado === false);
    console.log(itemsContables);
    const getCompuestos = [];
    itemsContables.map((item) => {
      item.compuestos.map((com) => {
        getCompuestos.push(com);
      });
    });

    const helper = {};
    const result = getCompuestos.reduce(function (r, o) {
      let key = o._id + "-" + o.name;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      } else {
        helper[key].medida += o.medida;
        helper[key].price += o.price;
      }

      return r;
    }, []);
    setListaCompuestos(result);
  };
  return (
    <div className="row">
      <div className="col-md-5 p-1 offset-3">
        <div className="card bg-white">
          <div className="card-header p-1">
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="date"
                name="fecha1"
                value={criterio.fecha1}
                min="2022-04-01"
                max={fechaActual(Date.now())}
                onChange={handleCriterio}
                className="form-control"
                required
              />
              <input
                type="date"
                name="fecha2"
                value={criterio.fecha2}
                min="2022-04-01"
                max={fechaActual(Date.now())}
                onChange={handleCriterio}
                className="form-control"
                required
              />
              {/* <select
                className="form-select text-uppercase"
                name="subcategoriaId"
                value={criterio.subcategoriaId}
                onChange={handleCriterio}
                required
              >
                <option value="">Subcategoria</option>
                <option value="todas">Todas</option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria._id} value={subcategoria._id}>
                    {subcategoria.name}
                  </option>
                ))}
              </select> */}
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div
            style={{ height: "520px", overflowY: "scroll" }}
            className="card-body p-1"
          >
            <table className="table table-bordered text-dark">
              <thead>
                <tr className="text-center text-uppercase">
                  <th scope="col">Descripción</th>
                  <th scope="col">medida</th>
                  <th scope="col">unidad</th>
                  <th scope="col">precio</th>
                </tr>
              </thead>
              <tbody>
                {listaCompuestos.map((compuesto) => (
                  <tr
                    key={compuesto._id}
                    style={{ cursor: "default" }}
                    className="text-uppercase"
                  >
                    <td className="fs-5">{compuesto.name}</td>
                    <td className="fs-5 text-center">{compuesto.medida}</td>
                    <td className="fs-5 text-center">{compuesto.unidad}</td>
                    <td className="fs-5 text-end">${compuesto.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
