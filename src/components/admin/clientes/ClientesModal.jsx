import { useState } from "react";
import { Modal } from "react-bootstrap";
import ClientesForm from "./ClientesForm";
import ClientesTable from "./ClientesTable";

const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  lastEdit: "",
};
function ClientesModal({ show, onHide }) {
  const [cliente, setCliente] = useState(initialCliente);
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
            <h3>Clientes</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            <ClientesForm
              cliente={cliente}
              setCliente={setCliente}
              initialCliente={initialCliente}
            />
          </div>
          <div className="col-md-8 p-1">
            <ClientesTable setCliente={setCliente} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ClientesModal;
