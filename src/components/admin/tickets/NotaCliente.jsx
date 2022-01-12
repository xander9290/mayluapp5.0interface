import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";

function NotaCliente() {
  const { changeNotaClienteSettings } = useContext(AppContext);

  const [values, setValues] = useState({
    logoTitle: "",
    logoSubtitle: "",
    infoAddress1: "",
    infoAddress2: "",
    infoAddress3: "",
    infoTel: "",
    infoWapp: "",
    footerMsg1: "",
    footerMsg2: "",
    footerMsg3: "",
  });

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setValues({ ...parseSettings.notaCliente });
    }
  }, []);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!window.confirm("confirmar cambios".toUpperCase())) return;
    changeNotaClienteSettings(values);
  };

  return (
    <form id="notaCliente" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Nota Cliente</legend>
        <div className="mb-2">
          <h6>Logotipo</h6>
          <label>Título de logotipo</label>
          <input
            type="text"
            className="form-control"
            name="logoTitle"
            value={values.logoTitle}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Subtítulo de logotipo</label>
          <input
            type="text"
            className="form-control"
            name="logoSubtitle"
            value={values.logoSubtitle}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
        <div className="mb-2">
          <h6>Dirección y Contacto</h6>
          <label>Dirección 1</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress1"
            value={values.infoAddress1}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Dirección 2</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress2"
            value={values.infoAddress2}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Dirección 3</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress3"
            value={values.infoAddress3}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Teléfono(s)</label>
          <input
            type="text"
            className="form-control"
            name="infoTel"
            value={values.infoTel}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>WhatsApp</label>
          <input
            type="text"
            className="form-control"
            name="infoWapp"
            value={values.infoWapp}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
        <div className="mb-2">
          <h6>Pie de Nota</h6>
          <label>Leyenda 1</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg1"
            value={values.footerMsg1}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Leyenda 2</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg2"
            value={values.footerMsg2}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Leyenda 3</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg3"
            value={values.footerMsg3}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary btn-sm mb-3">
        Guardar
      </button>
    </form>
  );
}

export default NotaCliente;
