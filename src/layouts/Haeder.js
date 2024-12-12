import React from "react";
import { Link } from 'react-router-dom';


const Header = () => {
return(
<>

<div className="preloader flex-column justify-content-center align-items-center">
    <img className="animation__shake" src="dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60"/>
  </div>

  <nav className="main-header navbar navbar-expand navbar-white navbar-light">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" data-widget="pushmenu" to="#" role="button"><i className="fas fa-bars"></i></Link>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="index3.html" className="nav-link">Home</Link>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="#" className="nav-link">Contact</Link>
      </li>
    </ul>

    <ul className="navbar-nav ml-auto">
     
      <li className="nav-item">
        <Link className="nav-link" data-widget="fullscreen" to="#" role="button">
          <i className="fas fa-expand-arrows-alt"></i>
        </Link>
      </li>
     
    </ul>
  </nav>
  </>
)
};
export default Header;