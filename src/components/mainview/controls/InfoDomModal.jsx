import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

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
function InfoDomModal({ show, onHide, cuenta, clientes }) {
  const [cliente, setCliente] = useState(initialCliente);
  useEffect(() => {
    if (cuenta._id) {
      getClienteInfo();
    }
  }, [cuenta.clienteId]);

  const getClienteInfo = () => {
    const findCliente = clientes.find(
      (cliente) => cliente._id === cuenta.clienteId
    );
    if (findCliente) {
      setCliente(findCliente);
    } else {
      setCliente(initialCliente);
    }
  };

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
      dialogClassName="info-dom-modal"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Domicilio</h3>
            <span className="fw-bolder fs-5">ID cliente: {cliente.codigo}</span>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 p-1">
            <ul className="list-group text-uppercase fs-4">
              <li className="list-group-item">
                <span className="fw-bold">Nombre: </span>
                <span>{cliente.name}</span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Tel: </span>
                <span>{cliente.tel}</span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Calle: </span>
                <span>{cliente.calle}</span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Cruces: </span>
                <span>{cliente.cruces}</span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">colonia: </span>
                <span>{cliente.colonia}</span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Obs: </span>
                <span>{cliente.obs}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InfoDomModal;
