import { useState } from "react";

import CategoriasModal from "../../admin/categorias/CategoriasModal";
import ProductosModal from "../../admin/productos/ProductosModal";
import ClientesModal from "../../admin/clientes/ClientesModal";
import OperadorModal from "../../admin/operadores/OperadorModal";
import TicketsModal from "../../admin/tickets/TicketsModal";
import OtrosMediosModal from "../../admin/otrosmedios/OtrosMediosModal";

function AdminItem() {
  const [categoriasModal, setCategoriasModal] = useState(false);
  const [productosModal, setProductosModal] = useState(false);
  const [clientesModal, setClientesModal] = useState(false);
  const [operadoresModal, setOperadoresModal] = useState(false);
  const [ticketsModal, setTicketsModal] = useState(false);
  const [otrosMedios, setOtrosMedios] = useState(false);
  return (
    <li className="nav-item dropdown ms-2">
      <a
        className="nav-link dropdown-toggle bg-white fs-5 text-dark"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Administración
      </a>
      <ul className="dropdown-menu">
        <li>
          <a
            onClick={() => setCategoriasModal(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Categorías
          </a>
        </li>
        <li>
          <a
            onClick={() => setProductosModal(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Almacén
          </a>
        </li>
        <li>
          <a
            onClick={() => setClientesModal(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Clientes
          </a>
        </li>
        <li>
          <a
            onClick={() => setOperadoresModal(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Operadores
          </a>
        </li>
        <li>
          <a
            onClick={() => setTicketsModal(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Tickets
          </a>
        </li>
        <li>
          <a
            onClick={() => setOtrosMedios(true)}
            href="#"
            className="dropdown-item fs-5 py-2"
          >
            Otros Medios
          </a>
        </li>
      </ul>
      <CategoriasModal
        show={categoriasModal}
        onHide={() => setCategoriasModal(false)}
      />
      <ProductosModal
        show={productosModal}
        onHide={() => setProductosModal(false)}
      />
      <ClientesModal
        show={clientesModal}
        onHide={() => setClientesModal(false)}
      />
      <OperadorModal
        show={operadoresModal}
        onHide={() => setOperadoresModal(false)}
      />
      <OtrosMediosModal
        show={otrosMedios}
        onHide={() => setOtrosMedios(false)}
      />
      <TicketsModal show={ticketsModal} onHide={() => setTicketsModal(false)} />
    </li>
  );
}

export default AdminItem;
