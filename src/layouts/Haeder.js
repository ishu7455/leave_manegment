import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// Importing external CSS files in React

import "../plugins/fontawesome-free/css/all.min.css";
import "../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
import "../plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import "../plugins/jqvmap/jqvmap.min.css";
import "../dist/css/adminlte.min.css";
import "../plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "../plugins/summernote/summernote-bs4.min.css";
import "../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css";
import "../plugins/datatables-responsive/css/responsive.bootstrap4.min.css";
import "../plugins/datatables-buttons/css/buttons.bootstrap4.min.css";




const Header = () => {

    const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user"));
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("authToken");
       // console.log(token);
        const response = await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
           'user' : token
          }),
        });
  
        if (response.ok) {
          localStorage.removeItem("token"); // Remove token from storage
          localStorage.removeItem("user");
          navigate("/login"); // Redirect to login page
        } else {
          const errorData = await response.json();
          console.error("Logout failed:", errorData.message);
        }
      } catch (error) {
        console.error("An error occurred during logout:", error);
      }
    };
  
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
      {savedUser ? (
      <li className="nav-item d-none d-sm-inline-block">
      <button onClick={handleLogout} className="nav-link btn btn-link">
        Logout
      </button>
      </li>
      ) : ([] )
}
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