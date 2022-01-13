import { Modal } from "react-bootstrap";
import { formatoFecha } from "../../../helpers";

function CajaTicket({ show, onHide, caja, initialCaja, setCaja }) {
  const setVista = () => {
    const printContents = document.getElementById("body").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");
    w.document.write(
      `
        <style>
        *{
          text-transform: uppercase;
          font-family: Ticketing;
        }
        p,h3,h2,h4 {
          margin: 0px;
          padding: 0px;
        }
      </style>
                `
    );
    w.document.title =
      `moviento_en_caja_${caja.tipo}_folio_${caja.folio}`.toUpperCase();
    w.document.write(printContents);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    onHide();
    return true;
  };

  const handleShow = () => {
    setVista();
  };

  const handleExited = () => {
    setCaja(initialCaja);
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      onExited={handleExited}
    >
      <Modal.Body>
        <div id="body">
          <br></br>
          <hr></hr>
          <h2>{caja.tipo}</h2>
          <h4>fecha: {formatoFecha(caja.createdAt)[0]}</h4>
          <h4>
            Operador: {caja.createdBy} folio: {caja.folio}
          </h4>
          <hr></hr>
          <h3>concepto: {caja.concepto}</h3>
          <h3>importe: ${caja.importe}</h3>
          <hr></hr>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CajaTicket;
