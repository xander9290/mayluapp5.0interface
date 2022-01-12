import { useState, useContext, useRef } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Modal } from "react-bootstrap";
import { verifyExiste } from "../../../helpers";

const initialOtroMedio = {
  name: "",
};
function OtrosMediosModal({ show, onHide }) {
  const { otrosMedios, createMedio, deleteMedio } = useContext(AppContext);
  const [otroMedio, setOtroMedio] = useState(initialOtroMedio);

  const inputRef = useRef();
  const handleOtroMedio = (e) => {
    setOtroMedio({ ...otroMedio, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyExiste(otrosMedios, otroMedio.name)) {
      alert("!ERROR!\nnombre no disponible".toUpperCase());
      return null;
    }
    createMedio(otroMedio, (res) => {
      if (res) cancelar();
    });
  };

  const cancelar = () => {
    setOtroMedio(initialOtroMedio);
    inputRef.current.focus();
  };

  const handleShow = () => {
    inputRef.current.focus();
  };
  const handleExited = () => {
    setOtroMedio(initialOtroMedio);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="otros-medios-modal"
      //   size="sm"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Medios de Pago</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <div className="card bg-white">
              <div className="card-header p-1">
                <h5 className="card-title">
                  Otros Medios{" "}
                  <span className="badge bg-primary">{otrosMedios.length}</span>{" "}
                </h5>
                <form onSubmit={handleSubmit} className="d-flex">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="name"
                    ref={inputRef}
                    value={otroMedio.name}
                    onChange={handleOtroMedio}
                    required
                    placeholder="Nuevo medio"
                    autoComplete="off"
                  />
                  <button
                    className="btn btn-primary btn-lg ms-1"
                    title="Guardar"
                    type="submit"
                  >
                    <i className="bi bi-plus-circle"></i>
                  </button>
                  <button
                    onClick={cancelar}
                    title="CANCELAR"
                    className="btn btn-warning btn-lg ms-1"
                    type="reset"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </form>
              </div>
              <div className="card-body p-1 otros-medios-modal-body">
                <ul className="list-group text-dark">
                  {otrosMedios.map((medio) => (
                    <li
                      key={medio._id}
                      style={{ cursor: "default" }}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="text-uppercase">{medio.name}</span>
                      <div>
                        <button
                          onClick={() => deleteMedio(medio._id)}
                          title="ELIMINAR"
                          type="button"
                          className="btn btn-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OtrosMediosModal;
