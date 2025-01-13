import React from "react";
import { Link } from 'react-router-dom';


// import $ from 'jquery';
// $.something()

// Import jQuery-dependent plugins
import '../plugins/jquery/jquery.min.js';
import '../plugins/jquery-ui/jquery-ui.min.js';
import '../plugins/bootstrap/js/bootstrap.bundle.min.js';
import '../plugins/chart.js/Chart.min.js';
// import '../plugins/jqvmap/jquery.vmap.min.js';  // Ensure this is imported after jQuery
// import '../plugins/jqvmap/maps/jquery.vmap.usa.js';
import '../plugins/jquery-knob/jquery.knob.min.js';
import '../plugins/moment/moment.min.js';
import '../plugins/summernote/summernote-bs4.min.js';
import '../plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js';
import '../dist/js/adminlte.js';

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