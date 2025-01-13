import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState({
    name: "Guest User",
    image: "dist/img/AdminLTELogo.png",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const location = useLocation();
  
  const isActive = (path) => {
    if (path === "/apply-leave") {
      const regex = /^\/apply-leave(\/\d+)?$/;
      return regex.test(location.pathname) ? "active" : "";
    }
  
    if (path === "/edit") {
      const regex = /^\/edit\/\d+$/;
      return regex.test(location.pathname) ? "active" : "";
    }
  
    // Fallback for static routes
    return location.pathname === path ? "active" : "";
  };
  


  const updateImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/image-update", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.data.image);
        const updatedUser = { ...user, image: data.data.image }; 
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      } else {
        alert(`Failed to update image: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating image:", error);
      alert("An error occurred while updating the image.");
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image" style={{ position: "relative" }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="imageUpload"
              onChange={updateImage}
            />
            <img
              src={`http://127.0.0.1:8000/storage/${user.image}`}
              className="img-circle elevation-2"
              alt="User"
              style={{ width: "35px", height: "35px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => document.getElementById("imageUpload").click()}
            />
          </div>
          <div className="info">
            <Link to="#" className="d-block">{user.name}</Link>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item menu-open">
              <Link to="#" className={`nav-link ${isActive("/") || isActive("/signup") || isActive("/employee-list") || isActive("/leave-list") || isActive("/edit") || isActive("/apply-leave") ? "active" : ""}`}>
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Dashboard
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/" className={`nav-link ${isActive("/")}`}>
                    <i className="far fa-circle nav-icon"></i>
                    <p>Dashboard</p>
                  </Link>
                </li>
               {[1,2,3].includes(user?.role_id) && ( 
                <>
                <li className="nav-item">
                  <Link to="/signup" className={`nav-link ${isActive("/signup")}`}>
                    <i className="far fa-circle nav-icon"></i>
                    <p>ADD Employee</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/employee-list" className={`nav-link ${isActive("/employee-list")} || ${isActive("/edit")}`}>
                    <i className="far fa-circle nav-icon"></i>
                    <p>Employee List</p>
                  </Link>
                </li>
                </>
              )}
                <li className="nav-item">
                  <Link to="/leave-list" className={`nav-link ${isActive("/leave-list")} ||  ${isActive("/apply-leave")}`}>
                    <i className="far fa-circle nav-icon"></i>
                    <p>Leave List</p>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
