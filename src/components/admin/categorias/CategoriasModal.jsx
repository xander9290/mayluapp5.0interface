import { useState } from "react";
import { Modal } from "react-bootstrap";
import CategoriasForm from "./CategoriasForm";
import SubcategoriasForm from "./SubcategoriasForm";
import ModificadoresForm from "./ModificadoresForm";

function CategoriasModal({ show, onHide }) {
  const [modificadores, setModificadores] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("none");
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Categorías</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 p-1">
            <CategoriasForm />
          </div>
          <div className="col-md-4 p-1">
            <SubcategoriasForm
              modificadores={modificadores}
              setModificadores={setModificadores}
              setSelectedSubcategoria={setSelectedSubcategoria}
            />
          </div>
          <div className="col-md-4 p-1">
            <ModificadoresForm
              modificadores={modificadores}
              setModificadores={setModificadores}
              selectedSubcategoria={selectedSubcategoria}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CategoriasModal;
