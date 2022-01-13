import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fechaActual } from "../../../helpers";
import routes from "../../routes";
import { Modal } from "react-bootstrap";

import ResumenModal from "./ResumenModal";
import DetalladoModal from "./DetalladoModal";

const initialFecha = {
  fecha1: fechaActual(Date.now()),
  fecha2: fechaActual(Date.now()),
};
const initServicios = {
  comedor: { total: 0, ctas: [] },
  pll: { total: 0, ctas: [] },
  domicilio: { total: 0, ctas: [] },
};
const initCajas = {
  retiros: { total: 0, qty: [] },
  depositos: { total: 0, qty: [] },
};
const initProductosDetallado = {
  items: [],
  miscelaneos: [],
};
const initOTrosMedios = { total: 0, qty: [], list: [] };
const initTarjetas = { total: 0, qty: [] };
const url = "http://localhost:3100/cuentas";
function MonitorVentaModal({ show, onHide }) {
  const {
    productos: ps,
    otrosMedios: md,
    cajas: xcajas,
    session,
    abrirCajon,
  } = useContext(AppContext);
  const [fecha, setFecha] = useState(initialFecha);
  const [productosCancelados, setProductosCancelados] = useState([]);
  const [servicios, setServicios] = useState(initServicios);
  const [cajas, setCajas] = useState(initCajas);
  const [descuentos, setDescuentos] = useState([]);
  const [cancelados, setCancelados] = useState([]);
  const [porPagar, setPorPagar] = useState(0);
  // TARJETAS
  const [tarjetas, setTarjetas] = useState(initTarjetas);
  //otros medios de pago
  const [otroMedio, setOtroMedio] = useState(initOTrosMedios);
  // PRODUCTOS
  const [productosDetallado, setProductosDetallados] = useState(
    initProductosDetallado
  );
  const [resumen, setResumen] = useState(false);
  const [detallado, setDetallado] = useState(false);

  const handleFecha = (e) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };

  const handleSubmitFecha = (e) => {
    e.preventDefault();
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };

  const fetchCuentas = async (gte, lte) => {
    const data = await routes.get(url + "/porfechas/" + gte + "/" + lte);
    if (data.cuentas.length > 0) {
      procesarCuentas(data.cuentas);
      const cjs = xcajas.filter((caja) => {
        return caja.fecha >= fecha.fecha1 && caja.fecha <= fecha.fecha2;
      });
      procesarCaja(cjs);
    } else {
      alert("no se encontraron datos".toUpperCase());
      setCajas(initCajas);
      setServicios(initServicios);
      setProductosDetallados(initProductosDetallado);
      setPorPagar(0);
    }
  };

  const procesarCuentas = (ctas) => {
    const cuentasContables = ctas.filter(
      (cuenta) => cuenta.estado !== "cancelado"
    );
    const cuentasCanceladas = ctas.filter(
      (cuenta) => cuenta.estado === "cancelado"
    );
    procesarServicios(cuentasContables, cuentasCanceladas);
    procesarTarjetas(cuentasContables);
    procesarOtrosMedios(cuentasContables);
    procesarProductos(cuentasContables);
  };

  const procesarServicios = (ctas, ctasC) => {
    const ctasCanceladas = [];
    let ctasPorPagar = 0;
    const ctasDscto = [];
    // cuentas por Abiertas Por Pagar
    ctas
      .filter((cuenta) => {
        return cuenta.estado === "abierto" || cuenta.estado === "pendiente";
      })
      .map((cuenta) => {
        ctasPorPagar += cuenta.cashInfo.total;
      });
    // COMEDOR
    const cuentasComedor = ctas.filter(
      (cuenta) => cuenta.servicio === "comedor"
    );
    const cuentasCanceladasComedor = ctasC.filter(
      (cuenta) => cuenta.servicio === "comedor" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoComedor = ctas.filter(
      (cuenta) => cuenta.servicio === "comedor" && cuenta.cashInfo.dscto > 0
    );
    let totalComedor = 0;
    cuentasComedor.map((cuenta) => {
      totalComedor += cuenta.cashInfo.total;
    });
    cuentasCanceladasComedor.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoComedor.map((item) => {
      ctasDscto.push(item);
    });
    const comedor = {
      total: totalComedor,
      ctas: cuentasComedor,
    };
    // PARA LLEVAR
    const cuentasPll = ctas.filter((cuenta) => cuenta.servicio === "pll");
    const cuentasCanceladasPll = ctasC.filter(
      (cuenta) => cuenta.servicio === "pll" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoPll = ctas.filter(
      (cuenta) => cuenta.servicio === "pll" && cuenta.cashInfo.dscto > 0
    );
    let totalPll = 0;
    cuentasPll.map((cuenta) => {
      totalPll += cuenta.cashInfo.total;
    });
    cuentasCanceladasPll.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoPll.map((item) => {
      ctasDscto.push(item);
    });
    const pll = {
      total: totalPll,
      ctas: cuentasPll,
    };
    // DOMICILIO
    const cuentasDomicilio = ctas.filter(
      (cuenta) => cuenta.servicio === "domicilio"
    );
    const cuentasCanceladasDomicilio = ctasC.filter(
      (cuenta) =>
        cuenta.servicio === "domicilio" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoDomicilio = ctas.filter(
      (cuenta) => cuenta.servicio === "domicilio" && cuenta.cashInfo.dscto > 0
    );
    let totalDomicilio = 0;
    cuentasDomicilio.map((cuenta) => {
      totalDomicilio += cuenta.cashInfo.total;
    });
    cuentasCanceladasDomicilio.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoDomicilio.map((item) => {
      ctasDscto.push(item);
    });
    const domicilio = {
      total: totalDomicilio,
      ctas: cuentasDomicilio,
    };
    setServicios({
      ...servicios,
      comedor,
      pll,
      domicilio,
    });
    setPorPagar(ctasPorPagar);
    setCancelados(ctasCanceladas);
    setDescuentos(ctasDscto);
  };

  // PRODUCTOS
  const procesarProductos = (ctas) => {
    const _items = [];
    let itemsCancelados = [];
    const list = [];

    // se vacian los productos vendidos
    ctas.map((cuenta) => {
      cuenta.items.map((item) => {
        _items.push(item);
      });
    });
    // se obtienen los productos contables
    const itemsContables = _items.filter((item) => item.contable === true);
    // se obtienen los productos cancelados
    itemsCancelados = itemsContables.filter((item) => item.cancelado === true);
    setProductosCancelados(itemsCancelados);
    // se filtran los productos cancelados
    const itemsVisibles = itemsContables.filter(
      (item) => item.cancelado === false
    );
    ps.map((producto) => {
      const contables = itemsVisibles.filter(
        (item) => item.producto_id === producto._id
      );
      if (contables.length > 0) {
        let cant = 0;
        let importe = 0;
        contables.map((contable) => {
          cant += contable.cant;
          importe += contable.importe;
        });
        const newItem = {
          cant,
          importe,
          name: contables[0].name,
        };
        list.push(newItem);
      }
    });
    // se ordenan los productos por orden alfabético
    const listSort = list.sort((a, b) => {
      if (a.cant > b.cant) return -1;
    });
    // se obtienen los poruductos en miscelaneo
    const miscelaneos = _items.filter(
      (item) => item.producto_id === "miscelaneo" && item.cancelado === false
    );
    setProductosDetallados({
      ...productosDetallado,
      items: listSort,
      miscelaneos,
    });
  };

  const procesarCaja = (cajas) => {
    const _gastos = cajas.filter((caja) => caja.tipo === "retiro");
    const _depositos = cajas.filter((caja) => caja.tipo === "deposito");
    let totalGastos = 0;
    let totalDepositos = 0;
    _gastos.map((caja) => {
      totalGastos += caja.importe;
    });
    _depositos.map((caja) => {
      totalDepositos += caja.importe;
    });
    const gastos = {
      total: totalGastos,
      qty: _gastos,
    };
    const depositos = {
      total: totalDepositos,
      qty: _depositos,
    };
    setCajas({
      ...cajas,
      retiros: gastos,
      depositos,
    });
  };

  const procesarTarjetas = (ctas) => {
    const cuentasTarjetas = ctas.filter(
      (cuenta) => cuenta.cashInfo.tarjeta > 0
    );
    let totalTarjetas = 0;
    cuentasTarjetas.map((cuenta) => {
      totalTarjetas += cuenta.cashInfo.tarjeta;
    });
    const tarjetas = {
      total: totalTarjetas,
      qty: cuentasTarjetas,
    };
    setTarjetas(tarjetas);
  };

  const procesarOtrosMedios = (ctas) => {
    const cuentasOtros = ctas.filter((cuenta) => {
      if (cuenta.otroMedio) {
        return cuenta.otroMedio.total > 0;
      }
    });
    let totalOtros = 0,
      listaMedios = [],
      list = [];
    cuentasOtros.map((cuenta) => {
      totalOtros += cuenta.otroMedio.total;
      listaMedios.push({
        name: cuenta.otroMedio.medio,
        importe: cuenta.otroMedio.total,
      });
    });
    md.map((medios) => {
      const mds = listaMedios.filter((item) => item.name === medios.name);
      if (mds.length > 0) {
        let total = 0;
        mds.map((items) => {
          total += items.importe;
        });
        const newListaMedios = {
          name: mds[0].name,
          total,
          qty: mds.length,
        };
        list.push(newListaMedios);
      }
    });
    const otrosMedios = {
      total: totalOtros,
      qty: cuentasOtros,
      list,
    };
    setOtroMedio(otrosMedios);
  };

  const targetResumen = async () => {
    if (porPagar > 0) {
      if (
        !window.confirm(
          "::::::::::::::::::::!atención!::::::::::::::::::::\n>hay cuentas abiertas o pendientes por pagar\n>¿Deseas continuar?".toUpperCase()
        )
      ) {
        return;
      } else {
        await abrirCajon();
        setResumen(true);
      }
    } else {
      //abrirCajon();
      setResumen(true);
    }
  };

  const targetDetallado = () => {
    setDetallado(true);
  };

  const handleShow = () => {
    fetchCuentas(fecha.fecha1, fecha.fecha2);
  };
  const handleExited = () => {
    setFecha(initialFecha);
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="monitor-venta-modal"
    >
      <div className="container-fluid bg-dark">
        <div className="row">
          <div className="col-md-12 p-1 d-flex justify-content-between bg-secondary">
            <h3>Monitor de Ventas</h3>
            <form onSubmit={handleSubmitFecha} className="d-flex">
              <input
                type="date"
                name="fecha1"
                value={fecha.fecha1}
                max={fechaActual(Date.now())}
                onChange={handleFecha}
                className="form-control form-control-lg"
                required
              />
              <input
                type="date"
                name="fecha2"
                value={fecha.fecha2}
                max={fechaActual(Date.now())}
                onChange={handleFecha}
                className="form-control form-control-lg"
                required
              />
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-search"></i>
              </button>
            </form>
            <button className="btn btn-danger" type="button" onClick={onHide}>
              Cerrar
              <i className="bi bi-x-circle ms-2"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 p-1">
            <div className="card bg-white mb-1">
              <div className="card-header p-1">
                <h5 className="card-title">Movimientos en Caja</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group">
                  <li className="list-group-item text-uppercase d-flex justify-content-between text-center">
                    <div>
                      <span className="fw-bold">retiros: </span>
                      <span>-${cajas.retiros.total}</span>
                      <span className="badge bg-primary ms-1">
                        {cajas.retiros.qty.length}
                      </span>
                    </div>
                    <div>
                      <span className="fw-bold">depósitos: </span>
                      <span>+${cajas.depositos.total}</span>
                      <span className="badge bg-primary ms-1">
                        {cajas.depositos.qty.length}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card bg-white">
              <div className="card-header p-1">
                <h5 className="card-title">Efectivo por Pagar</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group">
                  <li className="list-group-item text-uppercase">
                    <div>
                      <span className="fw-bold">Por pagar: </span>
                      <span>${porPagar}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4 p-1">
            <div className="card bg-white">
              <div className="card-header p-1">
                <h5 className="card-title">Otros Medios de Pago</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group">
                  <li className="list-group-item text-uppercase d-flex justify-content-between text-center">
                    <div>
                      <span className="fw-bold">tarjetas:</span>
                      <span>${tarjetas.total}</span>
                      <span className="badge bg-primary ms-1">
                        {tarjetas.qty.length}
                      </span>
                    </div>
                    <div>
                      <span className="fw-bold">otros:</span>
                      <span>${otroMedio.total}</span>
                      <span className="badge bg-primary ms-1">
                        {otroMedio.qty.length}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer p-0">
                <ul className="list-group">
                  <li className="list-group-item text-uppercase bg-primary fs-5">
                    <span className="fw-bold">total efectivo: </span>
                    <span>
                      $
                      {servicios.comedor.total +
                        servicios.pll.total +
                        servicios.domicilio.total +
                        cajas.depositos.total -
                        cajas.retiros.total -
                        tarjetas.total -
                        otroMedio.total}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-3 p-1">
            <div className="card bg-white">
              <div className="card-header p-1">
                <h5 className="card-title">Servicios</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group">
                  <li className="list-group-item text-uppercase">
                    <span className="fw-bold">comedor: </span>
                    <span>${servicios.comedor.total}</span>
                    <span className="badge bg-primary ms-1">
                      {servicios.comedor.ctas.length}
                    </span>
                  </li>
                  <li className="list-group-item text-uppercase">
                    <span className="fw-bold">para llevar: </span>
                    <span>${servicios.pll.total}</span>
                    <span className="badge bg-primary ms-1">
                      {servicios.pll.ctas.length}
                    </span>
                  </li>
                  <li className="list-group-item text-uppercase">
                    <span className="fw-bold">domicilio: </span>
                    <span>${servicios.domicilio.total}</span>
                    <span className="badge bg-primary ms-1">
                      {servicios.domicilio.ctas.length}
                    </span>
                  </li>
                  <li className="list-group-item text-uppercase bg-warning text-dark fs-5">
                    <span className="fw-bold">venta total: </span>
                    <span>
                      $
                      {servicios.comedor.total +
                        servicios.pll.total +
                        servicios.domicilio.total}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-2 p-0 py-1">
            <button
              type="button"
              className="btn btn-primary btn-lg mb-2"
              onClick={async () => await targetResumen()}
            >
              <i className="bi bi-printer h4 me-2"></i> Resumen
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={targetDetallado}
            >
              <i className="bi bi-printer h4 me-2"></i> Detallado
            </button>
          </div>
        </div>
        <ResumenModal
          show={resumen}
          onHide={() => setResumen(false)}
          servicios={servicios}
          cancelados={cancelados}
          productosCancelados={productosCancelados}
          descuentos={descuentos}
          caja={cajas}
          tarjetas={tarjetas}
          otroMedio={otroMedio}
          operador={session.operador}
        />
        <DetalladoModal
          show={detallado}
          onHide={() => setDetallado(false)}
          fecha={fecha}
          productos={productosDetallado}
          operador={session.operador}
        />
      </div>
    </Modal>
  );
}

export default MonitorVentaModal;
