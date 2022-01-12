import { Modal } from "react-bootstrap";

import CajaForm from "./CajaForm";
import CajaTable from "./CajaTable";

function CajaModal({ show, onHide }) {
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
      dialogClassName="caja-modal"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Movimientos en Caja</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            <CajaForm />
          </div>
          <div className="col-md-8 p-1">
            <CajaTable />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CajaModal;
