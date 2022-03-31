import { createContext } from "react";

import useCategorias from "../hooks/useCategorias";
import useSubcategorias from "../hooks/useSubcategorias";
import useProductos from "../hooks/useProductos";
import useCompuestos from "../hooks/useCompuesto";
import useClientes from "../hooks/useClientes";
import useOperador from "../hooks/useOperador";
import useCuenta from "../hooks/useCuenta";
import useOtrosMedios from "../hooks/useOtrosMedios";
import useTickets from "../hooks/useTickets";
import useCaja from "../hooks/useCaja";

export const AppContext = createContext();

function AppProvider({ children }) {
  const { categorias, createCategoria, updateCategoria, deleteCategoria } =
    useCategorias();
  const {
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
  } = useSubcategorias();
  const { productos, createProducto, updateProducto, deleteProducto } =
    useProductos();
  const { compuestos, createCompuesto, updateCompuesto, deleteCompuesto } =
    useCompuestos();
  const { clientes, createCliente, updateCliente, deleteCliente } =
    useClientes();
  const {
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    exitProcess,
  } = useOperador();
  const {
    cuentas,
    createCuenta,
    updateCuenta,
    cuenta,
    setCuenta,
    selectCuenta,
    reiniciarCuenta,
    initialCuenta,
    cargarCuentas,
    idx,
    setIdx,
  } = useCuenta();
  const { otrosMedios, createMedio, deleteMedio } = useOtrosMedios();
  const { settings, changeNotaNegocioSettings, changeNotaClienteSettings } =
    useTickets();
  const { cajas, createCaja, deleteCaja, abrirCajon } = useCaja();
  const data = {
    //   Categorias
    categorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    // Subcategorias
    subcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
    // Productos
    productos,
    createProducto,
    updateProducto,
    deleteProducto,
    // Compuestos
    compuestos,
    createCompuesto,
    updateCompuesto,
    deleteCompuesto,
    // Clientes
    clientes,
    createCliente,
    updateCliente,
    deleteCliente,
    // Operadores
    operadores,
    createOperador,
    loginOperador,
    updateOperador,
    deleteOperador,
    session,
    setSession,
    exitProcess,
    // Cuentas
    cuentas,
    createCuenta,
    updateCuenta,
    cuenta,
    setCuenta,
    selectCuenta,
    reiniciarCuenta,
    initialCuenta,
    cargarCuentas,
    idx,
    setIdx,
    // otros medios
    otrosMedios,
    createMedio,
    deleteMedio,
    // Tickets
    settings,
    changeNotaNegocioSettings,
    changeNotaClienteSettings,
    // caja
    cajas,
    createCaja,
    deleteCaja,
    abrirCajon,
  };
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

export default AppProvider;
