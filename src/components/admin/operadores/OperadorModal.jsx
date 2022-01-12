import { Modal } from "react-bootstrap";
import OperadorForm from "./OperadorForm";

function OperadorModal({ show, onHide }) {
  const handleShow = () => {};
  const handleExited = () => {};
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modals-admin"
      size="sm"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Operadores</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 p-1">
            <OperadorForm />
          </div>
          <div className="col-md-7"></div>
        </div>
      </div>
    </Modal>
  );
}

export default OperadorModal;
