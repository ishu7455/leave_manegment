import React from "react";
import Header from "./Haeder";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';






const Layout = ({ child }) => {
  useEffect(() => {
    const message = sessionStorage.getItem('message');
    if (message) {
      toast.success(message);
      setTimeout(() => {
        sessionStorage.removeItem('message');
      }, 2000);
    }
  }, []);
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
            <h1 className="m-0">Dashboard</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item active">Dashboard v1</li>
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