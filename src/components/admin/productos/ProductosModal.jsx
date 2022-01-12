import { useState } from "react";
import { Modal } from "react-bootstrap";
import ProductosTable from "./ProductosTable";
import ProductosForm from "./ProductosForm";

const initialProducto = {
  name: "",
  price: 0,
  subcategoriaId: "",
  areaNota: "",
  contable: true,
  lastEdit: "",
};
function ProductosModal({ show, onHide }) {
  const [producto, setProducto] = useState(initialProducto);
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
            <h3>Productos</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            <ProductosForm
              initialProducto={initialProducto}
              producto={producto}
              setProducto={setProducto}
            />
          </div>
          <div className="col-md-8 p-1">
            <ProductosTable producto={producto} setProducto={setProducto} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductosModal;
