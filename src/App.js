import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Home from "./Home";
import Signup from "./Auth/Singup";
import Layout from "./layouts/Layout";
import Login from "./Auth/Login";
import EmployeeList from "./Admin/EmployeeList";
import Edit from "./Admin/Edit";
import Leave from "./Admin/Leave";
import LeaveList from "./Admin/LeaveList";
import { useEffect , useState } from "react";



function AppRoutes() {
  const [userData, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser || {});
    } catch (error) {
      console.error("Invalid user data in localStorage", error);
      setUser({});
    }
  }, []);

  const routes = [
    { path: "/", element: <Home />, title: "Dashboard" },
    { path: "/signup", element: <Signup />, title: "Add User" },
    { path: "/login", element: <Login />, title: "Login", noLayout: true }, // Add `noLayout` flag
    { path: "/employee-list", element: <EmployeeList />, title: "Employee List" },
    { path: "/edit/:id", element: <Edit />, title: "Edit Employee" },
    { path: "/apply-leave/:id?", element: <Leave />, title: "Apply Leave" },
    {
      path: "/leave-list",
      element: <LeaveList />,
      title: "Leave List",
      breadcrumbs: [
        ...(userData?.role_id === 4 || userData?.role_id === 5
          ? [{ label: "Apply Leave", path: "/apply-leave" }]
          : []),
      ],
    },
  ];

  const wrappedRoutes = routes.map((route) => ({
    path: route.path,
    element: route.noLayout 
      ? route.element // Skip Layout for routes with `noLayout: true`
      : (
          <Layout
            child={route.element}
            title={route.title}
            breadcrumbs={route.breadcrumbs}
          />
        ),
  }));

  return useRoutes(wrappedRoutes);
}


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
