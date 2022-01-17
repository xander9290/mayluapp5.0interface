import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaISO, timeAgo } from "../../../helpers";
// Bototnes Component
import AbrirBtn from "./AbrirBtn";
import ImprimirBtn from "./ImprimirBtn";
import OpcionesBtn from "./OpcionesBtn";
// Modals
import CapturaForm from "./CapturaForm";
import DetalleCuenta from "./DetalleCuenta";
import ComandaModal from "./modalstickets/ComandaModal";
import NotaCliente from "./modalstickets/NotaCliente";
import AsignarRepModal from "./modalstickets/AsignarRepModal";
import PagarModal from "./PagarModal";

function NavAside() {
  const { cuenta, updateCuenta, reiniciarCuenta } = useContext(AppContext);

  const [capturaForm, setCapturaForm] = useState(false);
  const [detalleCuenta, setDetalleCuenta] = useState(false);
  const [comandaModal, setComandaModal] = useState(false);
  const [notaCliente, setNotaCliente] = useState(false);
  const [asignarRep, setAsignarRep] = useState(false);
  const [pagarCuenta, setPagarCuenta] = useState(false);

  useEffect(() => {
    if (cuenta._id) {
      if (cuenta.items.length === 0) return;
      if (cuenta.impreso) return;
      if (cuenta.estado !== "abierto") return;
      setTimeout(() => {
        setDetalleCuenta(true);
      }, 150);
    }
  }, [cuenta]);

  const showCaptura = () => {
    if (cuenta._id) {
      setCapturaForm(true);
    } else {
      alert("selecciona o abre una orden para continuar".toUpperCase());
    }
  };

  const targetDetalle = () => {
    if (!cuenta._id) {
      alert(
        "!atención!\nselecciona o abre una cuenta para continuar".toUpperCase()
      );
      return;
    }

    setDetalleCuenta(true);
  };

  const targetComandaModal = () => {
    if (!cuenta._id) {
      alert("selecciona o abre una cuenta para continuar".toUpperCase());
      return;
    }
    // if (cuenta.cashInfo.total === 0) {
    //   alert("orden sin productos".toUpperCase());
    //   return;
    // }
    setComandaModal(true);
  };

  const targetNotaCliente = () => {
    if (!cuenta._id) {
      alert("selecciona o abre una cuenta para continuar".toUpperCase());
      return;
    }
    if (!cuenta.impreso) {
      alert("Acción fuera de tiempo".toUpperCase());
      return;
    }
    setNotaCliente(true);
  };

  const pagar = () => {
    if (cuenta.servicio === "domicilio") {
      if (cuenta.estado === "pendiente") {
        setPagarCuenta(true);
      } else {
        setAsignarRep(true);
      }
    } else {
      setPagarCuenta(true);
    }
  };

  const reabrir = () => {
    if (!window.confirm("confirmar acción".toUpperCase())) return;
    const newCta = {
      ...cuenta,
      estado: "abierto",
      repartidor: "",
      impreso: false,
      time: "",
    };
    updateCuenta(cuenta._id, newCta, (res) => {
      // commit("Ha reabierto la orden " + cuenta.orden, operadorSession);
    });
  };

  const cancelar = () => {
    if (!window.confirm("confirmar acción".toUpperCase())) return;
    let motivoCancelado = window.prompt(
      "motivo de la cancelación".toUpperCase()
    );
    if (!motivoCancelado) motivoCancelado = "sin especificar";
    const newCuenta = {
      ...cuenta,
      estado: "cancelado",
      motivoCancelado,
      closedAt: fechaISO(),
      time: timeAgo(new Date(cuenta.createdAt)),
    };
    updateCuenta(cuenta._id, newCuenta, (res) => {
      if (res) reiniciarCuenta();
    });
  };

  const targetAsignarRep = () => {
    if (cuenta.servicio !== "domicilio") {
      alert("no disponible para este servicio".toUpperCase());
      return;
    }
    if (cuenta.cashInfo.total === 0) {
      alert("la cuenta no tiene items".toUpperCase());
      return;
    }
    setAsignarRep(true);
  };

  return (
    <nav className="nav flex-column p-1">
      <AbrirBtn setCapturaForm={() => setCapturaForm(true)} />
      <button
        onClick={showCaptura}
        disabled={cuenta.impreso ? true : false}
        type="button"
        className="btn btn-warning text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        capturar
      </button>
      <button
        onClick={targetDetalle}
        type="button"
        className="btn btn-warning text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        detalle
      </button>
      <ImprimirBtn
        disabled={cuenta._id ? false : true}
        showComandaModal={targetComandaModal}
        showNotaCliente={targetNotaCliente}
      />
      <button
        onClick={pagar}
        type="button"
        disabled={cuenta.impreso ? false : true}
        className="btn btn-warning text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        pagar
      </button>
      <OpcionesBtn targetAsignarRep={targetAsignarRep} />
      <button
        onClick={reabrir}
        type="button"
        disabled={cuenta.impreso ? false : true}
        className="btn btn-warning text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        reabrir
      </button>
      <button
        type="button"
        onClick={cancelar}
        disabled={cuenta.impreso ? false : true}
        className="btn btn-warning text-uppercase btn-lg fw-bold text-dark py-3 fs-4 mt-1"
      >
        cancelar
      </button>
      <CapturaForm
        show={capturaForm}
        onHide={() => setCapturaForm(false)}
        showDetalle={() => setDetalleCuenta(true)}
      />
      <DetalleCuenta
        show={detalleCuenta}
        onHide={() => setDetalleCuenta(false)}
        capturaForm={() => setCapturaForm(true)}
        showComandaModal={() => setComandaModal(true)}
        pagar={pagar}
      />
      <ComandaModal
        show={comandaModal}
        onHide={() => setComandaModal(false)}
        cuenta={cuenta}
      />
      <NotaCliente
        show={notaCliente}
        onHide={() => setNotaCliente(false)}
        cuenta={cuenta}
      />
      <AsignarRepModal
        show={asignarRep}
        onHide={() => setAsignarRep(false)}
        showNotaCliente={() => setNotaCliente(true)}
      />
      <PagarModal
        show={pagarCuenta}
        onHide={() => setPagarCuenta(false)}
        showNotaCliente={() => setNotaCliente(true)}
      />
    </nav>
  );
}

export default NavAside;
