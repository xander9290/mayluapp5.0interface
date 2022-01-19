import { useState, useContext, useEffect, Fragment } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { Modal } from "react-bootstrap";
import { numeroALetras, formatoFecha } from "../../../../helpers";

function ComandaModal({ show, onHide, cuenta }) {
  const { updateCuenta, settings, reiniciarCuenta } = useContext(AppContext);

  const setViewPrint = () => {
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
                        width: 42%;
                        margin: 0 auto;
                        padding: 8px;
                    }
                    #logoNameTitle {
                        font-size: 42px;
                    }
                    #logoSubName {
                        font-size: 25px;
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
    }_${cuenta.servicio.toUpperCase()}_COMANDA`;
    w.document.close();
    w.focus();
    w.print();
    w.close();
    //onHide();
    return true;
  };

  const [area1, setArea1] = useState([]);
  const [area2, setArea2] = useState([]);
  const [area3, setArea3] = useState([]);
  const [area4, setArea4] = useState([]);

  useEffect(() => {
    if (cuenta._id) {
      ordenarItems();
    }
  }, [cuenta]);

  const ordenarItems = () => {
    const items = [];
    const getItems = cuenta.items.filter((items) => items.cancelado === false);
    getItems.map((item) => {
      items.push(item);
    });

    const a1 = items.filter((item) => item.area_nota === "area1");
    const a2 = items.filter((item) => item.area_nota === "area2");
    const a3 = items.filter((item) => item.area_nota === "area3");
    const a4 = items.filter((item) => item.area_nota === "area4");

    setArea1([...a1]);
    setArea2([...a2]);
    setArea3([...a3]);
    setArea4([...a4]);
    //setAreas([...a1, ...a2, ...a3]);
  };
  const handleExited = () => {};

  const handleShow = () => {
    if (setViewPrint()) {
      const newCta = {
        ...cuenta,
        impreso: true,
      };
      updateCuenta(cuenta._id, newCta, (res) => {
        if (res) {
          reiniciarCuenta();
          onHide();
        }
      });
    }
  };

  const renderArea1 = () => {
    if (settings.notaNegocio.areasVisibles.area1) {
      return (
        <Fragment>
          {area1.length === 0 ? null : (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 1-----</h5>
              </td>
            </tr>
          )}
          {area1.map((item, i) => (
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
        </Fragment>
      );
    }
  };
  const renderArea2 = () => {
    if (settings.notaNegocio.areasVisibles.area2) {
      return (
        <Fragment>
          {area2.length === 0 ? null : (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 2-----</h5>
              </td>
            </tr>
          )}
          {area2.map((item, i) => (
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
        </Fragment>
      );
    }
  };
  const renderArea3 = () => {
    if (settings.notaNegocio.areasVisibles.area3) {
      return (
        <Fragment>
          {area3.length === 0 ? null : (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 3-----</h5>
              </td>
            </tr>
          )}
          {area3.map((item, i) => (
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
        </Fragment>
      );
    }
  };
  const renderArea4 = () => {
    if (settings.notaNegocio.areasVisibles.area4) {
      return (
        <Fragment>
          {area4.length === 0 ? null : (
            <tr>
              <td colSpan="3">
                <h5 style={{ textAlign: "center" }}>-----AREA 4-----</h5>
              </td>
            </tr>
          )}
          {area4.map((item, i) => (
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
              <td valign="top">${item.importe}</td>
            </tr>
          ))}
        </Fragment>
      );
    }
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      onShow={handleShow}
      onExited={handleExited}
      backdrop="static"
      keyboard="true"
    >
      <div id="comandaVista">
        <div id="infoCuenta">
          <strong>
            {" "}
            <p>
              orden: {cuenta.orden} {cuenta.servicio}
            </p>
            <p>cliente: {cuenta.torreta}</p>
          </strong>
          <p>
            oper: {cuenta.createdBy} {formatoFecha(cuenta.createdAt)[0]}
          </p>
        </div>
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
              {renderArea1()}
              {renderArea2()}
              {renderArea3()}
              {renderArea4()}
            </tbody>
          </table>
          <hr></hr>
        </div>
        <div id="totalInfo">
          <small>
            <ul>
              <div
                style={{
                  display: settings.notaNegocio.totalInfo.subtotal
                    ? "block"
                    : "none",
                }}
              >
                <li
                  style={{
                    display: cuenta.cashInfo.dscto > 0 ? "block" : "none",
                  }}
                >
                  subtotal: ${cuenta.cashInfo.importe}
                </li>
              </div>
              <div
                style={{
                  display: settings.notaNegocio.totalInfo.descuento
                    ? "block"
                    : "none",
                }}
              >
                <li
                  style={{
                    display: cuenta.cashInfo.dscto > 0 ? "block" : "none",
                  }}
                >
                  descuento: -${cuenta.cashInfo.dscto}
                </li>
              </div>
              <li
                style={{
                  display: settings.notaNegocio.totalInfo.total
                    ? "block"
                    : "none",
                }}
              >
                <h1>total: ${cuenta.cashInfo.total}</h1>
              </li>
              <div
                style={{
                  display: settings.notaNegocio.totalInfo.efectivo
                    ? "block"
                    : "none",
                }}
              >
                <li
                  style={{
                    display: cuenta.cashInfo.efectivo > 0 ? "block" : "none",
                  }}
                >
                  efectivo: ${cuenta.cashInfo.efectivo}
                </li>
              </div>
              <div
                style={{
                  display: settings.notaNegocio.totalInfo.tarjeta
                    ? "block"
                    : "none",
                }}
              >
                <li
                  style={{
                    display: cuenta.cashInfo.tarjeta > 0 ? "block" : "none",
                  }}
                >
                  Pago con tarjeta +{cuenta.cardInfo.porcetanje}%: $
                  {cuenta.cardInfo.total}
                </li>
              </div>
              <div
                style={{
                  display: settings.notaNegocio.totalInfo.cambio
                    ? "block"
                    : "none",
                }}
              >
                <li
                  style={{
                    display: cuenta.cashInfo.cambio > 0 ? "block" : "none",
                  }}
                >
                  cambio: ${cuenta.cashInfo.cambio}
                </li>
              </div>
            </ul>
            {numeroALetras(cuenta.cashInfo.total, {
              plural: "PESOS 00/100",
              singular: "PESO 00/100",
            })}
          </small>
          <hr></hr>
        </div>
      </div>
    </Modal>
  );
}

export default ComandaModal;
