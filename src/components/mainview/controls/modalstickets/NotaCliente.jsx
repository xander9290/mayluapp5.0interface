import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { Modal } from "react-bootstrap";
import { numeroALetras, formatoFecha } from "../../../../helpers";

const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  lastEdit: "",
};
function NotaCliente({ cuenta, show, onHide }) {
  const { clientes, settings, reiniciarCuenta } = useContext(AppContext);

  const setVista = () => {
    const printContents = document.getElementById("comandaVista").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");

    w.document.write(
      `
              <style>
                  * {
                      text-transform: uppercase;
                      font-family: Ticketing;
                  }
                  h1,h2,h3,h4,h5,h6,p {
                      margin: 0;
                      padding: 0;
                  }
                  #logoContainer {
                    background-color: black;
                    color: white;
                    border-radius: 6px;
                    text-align: center;
                    width: 58%;
                    margin: 0 auto;
                    padding: 8px;
            }
                  #logoNameTitle {
                      font-size: 35px;
                      font-family: China !important;
                  }
                  #logoSubName {
                      font-size: 18px;
                      font-family: China !important;
                  }
                  #logo {
                      border: 3px dashed white;
                      border-radius: 6px;
                      padding: 6px;
                  }
                  #infoEmpresa {
                      text-align: center;
                  }
                  #infoCuenta {
                      text-align: center;
                  }
                  #repartoTel {
                    display: flex;
                    justify-content: space-between;
                  }
                  #reparto {
                    margin-right: 15px;
                  }
                  strong {
                      font-size: 20px;
                      font-weight: bold;
                  }
                  table {
                      width: 100%;
                  }
                  table tbody tr td {
                      font-size: 17px;
                  }
                  table tbody tr {
                      padding: 0;
                  }
                  td:first-child {
                      text-align: center
                  }
                  td:last-child p {
                    width: 55%;
                    text-align: right;
                  }
                  #totalInfo {
                     padding-right: 40px;
                  }
                  ul {
                      text-align: right;
                  }
                  ul li {
                      text-decoration: none;
                      display: block;
                      margin-bottom: 1px;
                      margin: 0px;
                      padding: 0px;
                    }
                  #footer {
                      text-align: center;
                  }
              </style>
            `
    );
    w.document.write(printContents);
    w.document.title = `ORDEN_${
      cuenta.orden
    }_${cuenta.servicio.toUpperCase()}_NOTACLIENTE`;
    w.document.close();
    w.focus();
    w.print();
    w.close();
    return true;
  };

  const [areas, setAreas] = useState([]);
  const [cliente, setCliente] = useState(initialCliente);

  useEffect(() => {
    if (cuenta._id) {
      ordenarItems();
      getCliente();
    }
  }, [cuenta]);

  const ordenarItems = () => {
    const items = [];
    const getItems = cuenta.items.filter((items) => items.cancelado === false);
    getItems.map((item) => {
      items.push(item);
    });

    const a1 = items
      .filter((item) => item.area_nota === "area1")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a2 = items
      .filter((item) => item.area_nota === "area2")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a3 = items
      .filter((item) => item.area_nota === "area3")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    const a4 = items
      .filter((item) => item.area_nota === "area4")
      .sort((a, b) => {
        if (a.name < b.name) return -1;
      });

    // setArea1([...a1]);
    // setArea2([...a2]);
    // setArea3([...a3]);
    setAreas([...a1, ...a2, ...a3, ...a4]);
  };

  const getCliente = () => {
    const findCliente = clientes.find(
      (cliente) => cliente._id === cuenta.clienteId
    );
    if (findCliente) setCliente(findCliente);
  };

  const handleShow = () => {
    if (setVista()) onHide();
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      backdrop="static"
      keyboard="true"
    >
      <div id="comandaVista">
        <div
          style={{
            display: settings.notaCliente.logoTitle === "" ? "none" : "block",
          }}
          id="logoContainer"
        >
          <div id="logo">
            <h3 id="logoNameTitle">{settings.notaCliente.logoTitle}</h3>
            <h5 id="logoSubName">{settings.notaCliente.logoSubtitle}</h5>
          </div>
        </div>
        <div id="infoEmpresa">
          <p
            style={{
              display:
                settings.notaCliente.infoAddress1 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress1}
          </p>
          <p
            style={{
              display:
                settings.notaCliente.infoAddress2 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress2}
          </p>
          <p
            style={{
              display:
                settings.notaCliente.infoAddress3 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress3}
          </p>
          <p
            id="tel"
            style={{
              display: settings.notaCliente.infoTel === "" ? "none" : "block",
            }}
          >
            tel: {settings.notaCliente.infoTel}
          </p>
          <p
            id="wsap"
            style={{
              display: settings.notaCliente.infoWapp === "" ? "none" : "block",
            }}
          >
            whatsapp: {settings.notaCliente.infoWapp}
          </p>
        </div>
        <div id="infoCuenta">
          <strong>
            {" "}
            <p>
              orden: {cuenta.orden} {cuenta.servicio}
            </p>
            <p>
              {cuenta.servicio === "comedor" ? "mesa: " : "cliente: "}{" "}
              {cuenta.torreta}
            </p>
          </strong>
          <p>
            oper: {cuenta.createdBy} {formatoFecha(cuenta.createdAt)[0]}
          </p>
        </div>
        {cuenta.servicio === "comedor" ? null : !cuenta.clienteId ? null : (
          <div style={{ paddingLeft: "10px" }} id="clienteInfo">
            <hr></hr>
            <strong>
              <p>
                {cliente.calle}, entre:
                {cliente.cruces}, col: {cliente.colonia}
              </p>
            </strong>
            <small id="repartoTel">
              <span>tel: {cliente.tel}</span>
              {cuenta.repartidor && (
                <span id="reparto">Reparto: {cuenta.repartidor}</span>
              )}
            </small>
            <small>{cliente.obs && <p>obs: {cliente.obs}</p>}</small>
          </div>
        )}
        <hr></hr>
        <div id="itemsInfo">
          <table>
            <thead>
              <tr>
                <th>cant</th>
                <th>desc</th>
                <th>importe</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((item, i) => (
                <tr
                  style={{
                    display: item.cancelado ? "none" : "",
                  }}
                  key={i}
                >
                  <td valign="top">{item.cant}</td>
                  <td>
                    <p>{item.name}</p>
                    <small>
                      {item.modificadores.map((m, i) => (
                        <p key={i}>
                          {">>"}
                          {m.name} {m.price > 0 ? "$" + m.price : ""}
                        </p>
                      ))}
                    </small>
                  </td>
                  <td valign="top">
                    <p>${item.importe}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr></hr>
        </div>
        <div id="totalInfo">
          <small>
            <ul>
              <li
                style={{
                  display: cuenta.cashInfo.dscto > 0 ? "block" : "none",
                }}
              >
                subtotal: ${cuenta.cashInfo.importe}
              </li>
              <li
                style={{
                  display: cuenta.cashInfo.dscto > 0 ? "block" : "none",
                }}
              >
                descuento: -${cuenta.cashInfo.dscto}
              </li>
              <li>
                <h1>total: ${cuenta.cashInfo.total}</h1>
              </li>
              <li
                style={{
                  display: cuenta.cashInfo.efectivo > 0 ? "block" : "none",
                }}
              >
                efectivo: ${cuenta.cashInfo.efectivo}
              </li>
              <li
                style={{
                  display: cuenta.cashInfo.tarjeta > 0 ? "block" : "none",
                }}
              >
                Pago con tarjeta ${cuenta.cashInfo.tarjeta} +
                {cuenta.cardInfo.porcentaje}%: ${cuenta.cardInfo.total}
              </li>
              <li
                style={{
                  display: cuenta.otroMedio.total > 0 ? "block" : "none",
                }}
              >
                {cuenta.otroMedio.medio}: ${cuenta.otroMedio.total}
              </li>
              <li
                style={{
                  display: cuenta.cashInfo.cambio > 0 ? "block" : "none",
                }}
              >
                cambio: ${cuenta.cashInfo.cambio}
              </li>
            </ul>
            {numeroALetras(cuenta.cashInfo.total, {
              plural: "PESOS 00/100",
              singular: "PESO 00/100",
            })}
          </small>
          <hr></hr>
          <div id="footer">
            <p
              style={{
                display:
                  settings.notaCliente.footerMsg1 === "" ? "none" : "block",
              }}
            >
              {settings.notaCliente.footerMsg1}
            </p>
            <small
              style={{
                display:
                  settings.notaCliente.footerMsg2 === "" ? "none" : "block",
              }}
            >
              <p>{settings.notaCliente.footerMsg2}</p>
            </small>
            <small
              style={{
                display:
                  settings.notaCliente.footerMsg3 === "" ? "none" : "block",
              }}
            >
              <p>{settings.notaCliente.footerMsg3}</p>
            </small>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default NotaCliente;
