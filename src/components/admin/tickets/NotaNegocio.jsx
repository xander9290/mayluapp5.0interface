import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";

function NotaNegocio() {
  const { changeNotaNegocioSettings } = useContext(AppContext);

  const [checkNegocioAreas, setCheckNegocioAreas] = useState({
    area1: true,
    area2: true,
    area3: true,
    area4: true,
  });

  const [checkNegocioTotal, setCheckNegocioTotal] = useState({
    subtotal: true,
    descuento: true,
    total: true,
    efectivo: true,
    tarjeta: true,
    cambio: true,
  });

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setCheckNegocioAreas({ ...parseSettings.notaNegocio.areasVisibles });
      setCheckNegocioTotal({ ...parseSettings.notaNegocio.totalInfo });
    }
  }, []);

  const handleCheckNegocioAreas = (e) => {
    setCheckNegocioAreas({
      ...checkNegocioAreas,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCheckNegocioTotal = (e) => {
    setCheckNegocioTotal({
      ...checkNegocioTotal,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmitNegocio = (e) => {
    e.preventDefault();
    if (!window.confirm("confirmar cambios".toUpperCase())) return;
    const newSettings = {
      areasVisibles: checkNegocioAreas,
      totalInfo: checkNegocioTotal,
    };
    changeNotaNegocioSettings(newSettings);
  };
  return (
    <form id="notaNegocio" onSubmit={handleSubmitNegocio}>
      <fieldset>
        <legend>Nota Negocio</legend>
        <div className="mb-2">
          <h6>Áreas Visibles</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area1"
              checked={checkNegocioAreas.area1}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 1</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area2"
              checked={checkNegocioAreas.area2}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 2</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area3"
              checked={checkNegocioAreas.area3}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 3</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area4"
              checked={checkNegocioAreas.area4}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 4</label>
          </div>
        </div>
        <div className="mb-2">
          <h6>Información Totales</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="subtotal"
              checked={checkNegocioTotal.subtotal}
              onChange={handleCheckNegocioTotal}
            />
            <label>Subtotal</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="descuento"
              checked={checkNegocioTotal.descuento}
              onChange={handleCheckNegocioTotal}
            />
            <label>Descuento</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="total"
              checked={checkNegocioTotal.total}
              onChange={handleCheckNegocioTotal}
            />
            <label>Total</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="efectivo"
              checked={checkNegocioTotal.efectivo}
              onChange={handleCheckNegocioTotal}
            />
            <label>Efectivo</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="tarjeta"
              checked={checkNegocioTotal.tarjeta}
              onChange={handleCheckNegocioTotal}
            />
            <label>Tarjeta</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="cambio"
              checked={checkNegocioTotal.cambio}
              onChange={handleCheckNegocioTotal}
            />
            <label>Cambio</label>
          </div>
        </div>
      </fieldset>
      <button className="btn btn-primary btn-sm mb-3" type="submit">
        Guardar
      </button>
    </form>
  );
}

export default NotaNegocio;
