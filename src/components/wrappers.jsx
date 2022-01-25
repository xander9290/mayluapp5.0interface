import { Modal } from "react-bootstrap";

export function MyModal({
  children,
  title,
  show,
  onHide,
  onShow,
  onExited,
  dialogClassName,
}) {
  const handleShow = () => {
    onShow();
  };
  const handleExited = () => {
    onExited();
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName={dialogClassName}
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>{title}</h3>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        {children}
      </div>
    </Modal>
  );
}
