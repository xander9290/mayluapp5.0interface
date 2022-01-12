function ImprimirBtn({ showComandaModal, showNotaCliente, disabled }) {
  return (
    <div className="btn-group dropstart">
      <button
        type="button"
        disabled={disabled}
        className="btn btn-warning dropdown-toggle text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        imprimir
      </button>
      <ul className="dropdown-menu text-uppercase">
        <li>
          <a
            onClick={showComandaModal}
            className="dropdown-item fs-3 py-3"
            href="#"
          >
            negocio
          </a>
        </li>
        <li>
          <a
            onClick={showNotaCliente}
            className="dropdown-item fs-3 py-3"
            href="#"
          >
            cliente
          </a>
        </li>
      </ul>
    </div>
  );
}

export default ImprimirBtn;
