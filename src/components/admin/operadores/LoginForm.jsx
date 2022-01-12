import { useState, useContext, useRef } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Modal } from "react-bootstrap";

const initialOperador = { name: "", pswd: "" };
function LoginForm({ show, onHide }) {
  const { operadores, loginOperador } = useContext(AppContext);
  const [operador, setOperador] = useState(initialOperador);
  const [idx, setIdx] = useState("");

  const pswdRef = useRef();
  const handleOperador = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    loginOperador(operador, (res) => {
      if (res) {
        onHide();
      } else {
        alert(
          "accesso denegado\ncontraseña u operador no válido".toUpperCase()
        );
        pswdRef.current.focus();
      }
    });
  };

  const selectOperador = (id) => {
    const findOperador = operadores.find((operador) => operador._id === id);
    if (findOperador) setOperador({ ...findOperador, pswd: "" });
    pswdRef.current.focus();
  };

  const handleShow = () => {};
  const handleExited = () => {
    setOperador(initialOperador);
    setIdx("");
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="login-form-modal"
      size="sm"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-start bg-secondary">
            <h3>Iniciar Sesión</h3>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12 p-1">
            <div className="card bg-white">
              <div className="card-header p-1">
                <h5 className="car-title text-center d-flex justify-content-between">
                  <span className="ms-2">Operador</span>
                  <span className="me-5">Rol</span>
                </h5>
              </div>
              <div className="card-body p-1">
                <ul
                  style={{
                    height: "250px",
                    overflowY: "auto",
                    cursor: "pointer",
                  }}
                  className="list-group"
                >
                  {operadores.map((operador) => (
                    <li
                      key={operador._id}
                      onClick={() => setIdx(operador._id)}
                      onDoubleClick={() => selectOperador(operador._id)}
                      className={`list-group-item list-group-item-action text-uppercase fs-5 fw-bold d-flex justify-content-between mb-1 ${
                        operador._id === idx ? "active" : ""
                      }`}
                    >
                      <span>{operador.name}</span>
                      <span>{operador.rol}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer p-1">
                <form onSubmit={handleSubmitLogin}>
                  <div className="mb-2">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      name="name"
                      value={operador.name}
                      onChange={handleOperador}
                      autoComplete="off"
                      required
                      placeholder="Operador"
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      name="pswd"
                      ref={pswdRef}
                      value={operador.pswd}
                      onChange={handleOperador}
                      maxLength="4"
                      autoComplete="off"
                      required
                      placeholder="Contraseña"
                    />
                  </div>
                  <div className="mb-2 d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      ENTRAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LoginForm;
