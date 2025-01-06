import React from "react";
import Header from "./Haeder";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';






const Layout = ({ child , title ,breadcrumbs = []}) => {
  
return(
<>

 <Header/>
    <Sidebar/>
    <ToastContainer />

    <div className="content-wrapper">
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">{title}</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
            {breadcrumbs.map((breadcrumb) => (
              <>
              <li className="breadcrumb-item active"><Link to={breadcrumb.path}>{breadcrumb.label}</Link></li>
              </>
           ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
    <main>
        { child }
    </main>
 </div>
 <Footer/>
 </> 
)
}

export default Layout;