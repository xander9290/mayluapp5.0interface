import { useState, useContext, useRef } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Modal } from "react-bootstrap";

const initialPswd = {
  pswd: "",
};

function LoginMonitorModal({ show, onHide, setMonitor }) {
  const { loginOperador, session } = useContext(AppContext);
  const [pswd, setPswd] = useState(initialPswd);

  const inputPwsd = useRef();
  const handlePswd = (e) =>
    setPswd({ ...pswd, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOper = {
      name: session.operador,
      pswd: pswd.pswd,
    };
    loginOperador(newOper, (res) => {
      if (res) {
        setTimeout(() => {
          setMonitor(true);
          onHide();
        }, 150);
      } else {
        alert("acceso denegado".toUpperCase());
      }
    });
  };

  const handleShow = () => {
    inputPwsd.current.focus();
  };
  const handleExited = () => {
    setPswd(initialPswd);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      //   dialogClassName="modals-admin"
      size="sm"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Autorizar</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                type="password"
                name="pswd"
                maxLength="4"
                ref={inputPwsd}
                value={pswd.pswd}
                onChange={handlePswd}
                className="form-control form-control-lg"
                required
                placeholder="contraseña"
                autoComplete="off"
              />
              <button
                title="ENTRAR"
                type="submit"
                className="btn btn-primary btn-lg"
              >
                <i className="bi bi-box-arrow-in-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LoginMonitorModal;
