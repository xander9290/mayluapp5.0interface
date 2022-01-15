import { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";

const initialEfectivo = {
  mil: 0,
  quinientos: 0,
  doscientos: 0,
  cien: 0,
  cincuenta: 0,
  veinte: 0,
  diez: 0,
  cinco: 0,
  dos: 0,
  peso: 0,
};
function DeclaracionModal({
  show,
  onHide,
  declaracionEfectivo,
  setDeclaracionEfectivo,
  totalDeclarado,
  setTotalDeclarado,
  totalEfectivo,
}) {
  const inputMilRef = useRef();
  const [efectivo, setEfectivo] = useState(initialEfectivo);
  const [diferencia, setDiferencia] = useState(0);

  useEffect(() => {
    const newDeclaracion = {
      ...declaracionEfectivo,
      mil: {
        qty: efectivo.mil,
        importe: parseInt(efectivo.mil) * 1000,
      },
      quinientos: {
        qty: efectivo.quinientos,
        importe: parseInt(efectivo.quinientos) * 500,
      },
      doscientos: {
        qty: efectivo.doscientos,
        importe: parseInt(efectivo.doscientos) * 200,
      },
      cien: {
        qty: efectivo.cien,
        importe: parseInt(efectivo.cien) * 100,
      },
      cincuenta: {
        qty: efectivo.cincuenta,
        importe: parseInt(efectivo.cincuenta) * 50,
      },
      veinte: {
        qty: efectivo.veinte,
        importe: parseInt(efectivo.veinte) * 20,
      },
      diez: {
        qty: efectivo.diez,
        importe: parseInt(efectivo.diez) * 10,
      },
      cinco: {
        qty: efectivo.cinco,
        importe: parseInt(efectivo.cinco) * 5,
      },
      dos: {
        qty: efectivo.dos,
        importe: parseInt(efectivo.dos) * 2,
      },
      peso: {
        qty: efectivo.peso,
        importe: parseInt(efectivo.peso) * 1,
      },
    };
    setDeclaracionEfectivo(newDeclaracion);
  }, [efectivo]);

  useEffect(() => {
    let total =
      declaracionEfectivo.mil.importe +
      declaracionEfectivo.quinientos.importe +
      declaracionEfectivo.doscientos.importe +
      declaracionEfectivo.cien.importe +
      declaracionEfectivo.cincuenta.importe +
      declaracionEfectivo.veinte.importe +
      declaracionEfectivo.diez.importe +
      declaracionEfectivo.cinco.importe +
      declaracionEfectivo.dos.importe +
      declaracionEfectivo.peso.importe;

    let dif = totalEfectivo - total;
    setTotalDeclarado(total);
    setDiferencia(dif);
  }, [declaracionEfectivo]);

  const handleEfectivo = (e) => {
    let value = e.target.value;
    if (isNaN(value) || value === "") value = 0;
    setEfectivo({ ...efectivo, [e.target.name]: parseInt(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalDeclarado < totalEfectivo) {
      if (
        !window.confirm(
          `hay una diferencia negativa (-)$${
            totalEfectivo - totalDeclarado
          } en la declaración\n¿deseas continuar`.toUpperCase()
        )
      )
        return;
    }
    onHide();
  };

  const reiniciar = () => {
    setEfectivo(initialEfectivo);
    inputMilRef.current.focus();
  };

  const handleShow = () => {
    reiniciar();
    inputMilRef.current.focus();
  };
  const handleExited = () => {};
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="declaracion-modal"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Declaración de Cajero</h3>
            <button
              disabled={totalDeclarado > 0 ? true : false}
              className="btn btn-danger"
              type="button"
              onClick={onHide}
            >
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 p-1">
            <form className="card" onSubmit={handleSubmit}>
              <div className="card-header p-1 d-flex justify-content-between align-items-end">
                <h5 className="card-title">Efectivo Físico</h5>
                <button
                  disabled={totalDeclarado > 0 ? false : true}
                  type="submit"
                  className="btn btn-primary"
                >
                  Declarar
                </button>
                <button
                  onClick={reiniciar}
                  type="button"
                  className="btn btn-warning"
                >
                  Reiniciar
                </button>
              </div>
              <div className="card-body p-0">
                <table className="table table-bordered text-uppercase text-center table-sm">
                  <thead>
                    <tr>
                      <th scope="col">denominación</th>
                      <th scope="col">cantidad</th>
                      <th scope="col">importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $1000
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="mil"
                          ref={inputMilRef}
                          value={efectivo.mil}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.mil.importe)
                          ? 0
                          : declaracionEfectivo.mil.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $500
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="quinientos"
                          value={efectivo.quinientos}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.quinientos.importe)
                          ? 0
                          : declaracionEfectivo.quinientos.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $200
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="doscientos"
                          value={efectivo.doscientos}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.doscientos.importe)
                          ? 0
                          : declaracionEfectivo.doscientos.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $100
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="cien"
                          value={efectivo.cien}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.cien.importe)
                          ? 0
                          : declaracionEfectivo.cien.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $50
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="cincuenta"
                          value={efectivo.cincuenta}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.cincuenta.importe)
                          ? 0
                          : declaracionEfectivo.cincuenta.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $20
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="veinte"
                          value={efectivo.veinte}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.veinte.importe)
                          ? 0
                          : declaracionEfectivo.veinte.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $10
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="diez"
                          value={efectivo.diez}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.diez.importe)
                          ? 0
                          : declaracionEfectivo.diez.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $5
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="cinco"
                          value={efectivo.cinco}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.cinco.importe)
                          ? 0
                          : declaracionEfectivo.cinco.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $2
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="dos"
                          value={efectivo.dos}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.dos.importe)
                          ? 0
                          : declaracionEfectivo.dos.importe}
                      </td>
                    </tr>
                    <tr>
                      <th valign="middle" scope="row" className="fs-5">
                        $1
                      </th>
                      <td className="d-flex justify-content-center">
                        <input
                          style={{ width: "50%" }}
                          name="peso"
                          value={efectivo.peso}
                          onChange={handleEfectivo}
                          className="form-control fw-bold text-center py-1"
                          type="text"
                          autoComplete="off"
                        />
                      </td>
                      <td valign="middle" className="fs-5">
                        $
                        {isNaN(declaracionEfectivo.peso.importe)
                          ? 0
                          : declaracionEfectivo.peso.importe}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fs-5">
                        Total: ${isNaN(totalDeclarado) ? 0 : totalDeclarado}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </form>
          </div>
          {/* <div className="col-md-3 p-1">
            <div className="card">
              <div className="card-header p-1">
                <h5 className="card-title text-center">Diferencia</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group">
                  <li
                    className={`list-group-item fs-5 text-center ${
                      totalDeclarado < totalEfectivo
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {(() => {
                      if (totalDeclarado > totalEfectivo) return "Excedente: ";
                    })()}{" "}
                    ${Math.abs(totalDeclarado - totalEfectivo)}
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Modal>
  );
}

export default DeclaracionModal;
