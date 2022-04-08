import { useState } from "react";
import { Modal } from "react-bootstrap";
import ProductosTable from "./ProductosTable";
import ProductosForm from "./ProductosForm";
import Almacen from "./almacen/Almacen";
import Compuestos from "./compuestos/Compuestos";

const initialProducto = {
  name: "",
  price: 0,
  subcategoriaId: "",
  areaNota: "",
  contable: true,
  lastEdit: "",
  compuestos: [],
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
            <h5>Almacen</h5>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <nav>
          <div className="nav nav-pills mb-1" role="tablist">
            <button
              className="nav-link active fs-6"
              data-bs-toggle="tab"
              data-bs-target="#almacen"
              type="button"
              role="tab"
              aria-controls="almacen"
              aria-selected="true"
            >
              Almacén
            </button>
            <button
              className="nav-link fs-6"
              data-bs-toggle="tab"
              data-bs-target="#compuestos"
              type="button"
              role="tab"
              aria-controls="compuestos"
              aria-selected="false"
            >
              Compuestos
            </button>
            <button
              className="nav-link fs-6"
              data-bs-toggle="tab"
              data-bs-target="#productos"
              type="button"
              role="tab"
              aria-controls="productos"
              aria-selected="false"
            >
              Productos
            </button>
            <button
              className="nav-link fs-6"
              data-bs-toggle="tab"
              data-bs-target="#estadistica"
              type="button"
              role="tab"
              aria-controls="estadistica"
              aria-selected="false"
            >
              Estadística
            </button>
          </div>
        </nav>
        <div className="tab-content">
          <div
            className="tab-pane fade"
            id="productos"
            role="tabpanel"
            aria-labelledby="productos-tab"
          >
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
          <div
            className="tab-pane fade show active"
            id="almacen"
            role="tabpanel"
            aria-labelledby="almacen-tab"
          >
            <Almacen />
          </div>
          <div
            className="tab-pane fade"
            id="compuestos"
            role="tabpanel"
            aria-labelledby="compuestos-tab"
          >
            <Compuestos />
          </div>
          <div
            className="tab-pane fade"
            id="componer"
            role="tabpanel"
            aria-labelledby="componer-tab"
          >
            {/* <Estadisticas /> */}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductosModal;
