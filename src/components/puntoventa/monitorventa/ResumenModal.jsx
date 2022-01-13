import { Modal } from "react-bootstrap";
import { formatoFecha } from "../../../helpers";

function ResumenModal({
  show,
  onHide,
  servicios,
  cancelados,
  productosCancelados,
  descuentos,
  caja,
  tarjetas,
  otroMedio,
  operador,
}) {
  const setImpresion = () => {
    const printContents = document.getElementById("body").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");
    w.document.write(`
          <style>
            *{
              text-transform: uppercase;
              font-family: Ticketing;
            }
            p,h1,h2,h3,h4,h5,h6 {
                margin: 0;
                padding: 0;
            }
            #title {
                text-aling: center;
            }
          </style>`);
    w.document.write(printContents);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    onHide();
    return true;
  };

  const handleShow = () => {
    setImpresion();
  };

  const handleExited = () => {};

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="md"
      onShow={handleShow}
      onExited={handleExited}
    >
      <Modal.Body>
        <div id="body">
          <br></br>
          <h1 id="title">RESUMEN DE VENTA</h1>
          <hr></hr>
          <p>fecha: {formatoFecha(Date.now())[0]}</p>
          <p>operador: {operador}</p>
          <hr></hr>
          <h3>cuentas por servicio</h3>
          <h4>
            -comedor ({servicios.comedor.ctas.length}): $
            {servicios.comedor.total}
          </h4>
          <h4>
            -para llevar ({servicios.pll.ctas.length}): ${servicios.pll.total}
          </h4>
          <h4>
            -domicilio ({servicios.domicilio.ctas.length}): $
            {servicios.domicilio.total}
          </h4>
          <h2>
            venta total: $
            {servicios.comedor.total +
              servicios.pll.total +
              servicios.domicilio.total}
          </h2>
          <hr></hr>
          <div
            style={{
              display:
                caja.retiros.qty.length > 0 || caja.depositos.qty.length > 0
                  ? "block"
                  : "none",
            }}
          >
            <h3>movimientos en caja</h3>
            {caja.retiros.qty.map((gasto, i) => (
              <div key={i * 2}>
                <h4>
                  {gasto.tipo}: concepto: {gasto.concepto} -${gasto.importe}
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
            <h4>total retiros: -${caja.retiros.total}</h4>
            <hr></hr>
            {caja.depositos.qty.map((deposito, i) => (
              <div key={i * 3}>
                <h4>
                  {deposito.tipo}: concepto: {deposito.concepto} +$
                  {deposito.importe}
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
            <h4
              style={{
                display: caja.depositos.qty.length > 0 ? "block" : "none",
              }}
            >
              total depósitos: -${caja.depositos.total}
            </h4>
            <hr></hr>
          </div>
          <div
            style={{
              display: tarjetas.qty.length > 0 ? "block" : "none",
            }}
          >
            <h3>pagos con tarjeta</h3>
            {tarjetas.qty.map((cuenta, i) => (
              <div key={i * 4}>
                <h4>
                  -orden: {cuenta.orden} total: ${cuenta.cashInfo.tarjeta}
                  <p style={{ margin: "0", padding: "0" }}>
                    <small>{formatoFecha(cuenta.createdAt)[0]}</small>
                  </p>
                </h4>
              </div>
            ))}
            <p>-------------------------------------</p>
            <h4>total de tarjetas: ${tarjetas.total}</h4>
            <hr></hr>
          </div>
          <div
            style={{
              display: otroMedio.qty.length > 0 ? "block" : "none",
            }}
          >
            <h3>pagos con otros medios</h3>
            {otroMedio.list.map((medio, i) => (
              <div key={i * 5}>
                <h4>
                  -{medio.name} ({medio.qty}) total: ${medio.total}
                </h4>
              </div>
            ))}
            <p>-------------------------------------</p>
            <h4>total otros medios: ${otroMedio.total}</h4>
            <hr></hr>
          </div>
          <h2>
            efectivo: $
            {servicios.comedor.total +
              servicios.pll.total +
              servicios.domicilio.total +
              caja.depositos.total -
              caja.retiros.total -
              tarjetas.total -
              otroMedio.total}
          </h2>
          <div style={{ display: descuentos.length > 0 ? "block" : "none" }}>
            <hr></hr>
            <h3>ordenes con descuento</h3>
            {descuentos.map((cuenta, i) => (
              <div key={i * 5}>
                <h4>-orden:{cuenta.orden}</h4>
                <h4>importe:${cuenta.importe}</h4>
                <h4>dscto:-%{cuenta.dscto}</h4>
                <h4>
                  total:$
                  {cuenta.total}
                </h4>
                <h4>{formatoFecha(cuenta.createdAt)[0]}</h4>
                <p>-------------------------------------</p>
              </div>
            ))}
          </div>
          <div style={{ display: cancelados.length > 0 ? "block" : "none" }}>
            <hr></hr>
            <h3>ordenes canceladas</h3>
            {cancelados.map((cuenta, i) => (
              <div key={i * 6}>
                <h4>
                  -orden: {cuenta.orden} total: ${cuenta.total}
                  <p>
                    -motivo: {cuenta.motivoCancelado && cuenta.motivoCancelado}
                  </p>
                  <p style={{ margin: "0", padding: "0" }}>
                    <small>{formatoFecha(cuenta.createdAt)[0]}</small>
                  </p>
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
          </div>
          <div
            style={{
              display: productosCancelados.length > 0 ? "block" : "none",
            }}
          >
            <hr></hr>
            <h3>productos cancelados</h3>
            {productosCancelados.map((p, i) => (
              <div key={i * 7}>
                <h4>
                  <p>
                    {p.cant} {p.name}
                  </p>
                  <p>-orden: {p.orden && p.orden}</p>
                  <p>-motivo: {p.motivo && p.motivo}</p>
                  <p style={{ margin: "0", padding: "0" }}>
                    <small>{p.hora && formatoFecha(p.hora)[0]}</small>
                  </p>
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ResumenModal;
