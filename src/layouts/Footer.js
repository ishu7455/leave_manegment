import React from "react";
import { Link } from 'react-router-dom';


const Footer = () => {
return(
<>
<footer className="main-footer">
    <strong>Copyright &copy; 2014-2021 <Link to="https://adminlte.io">AdminLTE.io</Link>.</strong>
    All rights reserved.
    <div className="float-right d-none d-sm-inline-block">
      <b>Version</b> 3.1.0
    </div>
  </footer>
  <aside className="control-sidebar control-sidebar-dark">
  </aside>
</>
)
}  

export default Footer;