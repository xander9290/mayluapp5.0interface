import NavAside from "./controls/NavAside";
import CuentasAbiertas from "./CuentasAbiertas";

function CuentasContainer() {
  return (
    <div className="container-fluid d-flex justify-content-start cuentas-container p-0 bg-dark">
      <div style={{ overflowX: "hidden" }} className="cuentas">
        <CuentasAbiertas />
      </div>
      <div className="controls">
        <NavAside />
      </div>
    </div>
  );
}

export default CuentasContainer;
