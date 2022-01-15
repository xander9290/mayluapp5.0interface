import PuntoVentaItem from "./navitems/PuntoVentaItem";
import AdminItem from "./navitems/AdminItem";
import Clock from "./Clock";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success py-1">
      <div className="container-fluid">
        <span className="navbar-brand border border-2 rounded px-1 bg-dark">
          MAYLU App
        </span>
        <ul className="navbar-nav">
          <PuntoVentaItem />
          <AdminItem />
        </ul>
        <Clock />
      </div>
    </nav>
  );
}

export default Nav;
