import { Modal } from "react-bootstrap";
import NotaCliente from "./NotaCliente";
import NotaNegocio from "./NotaNegocio";

function TicketsModal({ show, onHide }) {
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
      dialogClassName="modals-admin-tickets"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Tickets</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <div className="card bg-white">
              <div className="card-header p-0">
                <div
                  className="list-group list-group-horizontal"
                  id="menu-tickets"
                >
                  <a
                    className="list-group-item list-group-item-action"
                    href="#notaCliente"
                  >
                    Cliente
                  </a>
                  <a
                    className="list-group-item list-group-item-action"
                    href="#notaNegocio"
                  >
                    Negocio
                  </a>
                  <a
                    className="list-group-item list-group-item-action"
                    href="#notaResumen"
                  >
                    Resumen
                  </a>
                  <a
                    className="list-group-item list-group-item-action"
                    href="#notaDetallado"
                  >
                    Detallado
                  </a>
                </div>
              </div>
              <div
                style={{ height: "480px", overflowY: "scroll" }}
                className="card-body p-1 text-dark"
              >
                <div
                  data-bs-spy="scroll"
                  data-bs-target="#menu-tickets"
                  data-bs-offset="0"
                  tabIndex="0"
                >
                  <NotaCliente />
                  <NotaNegocio />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TicketsModal;
