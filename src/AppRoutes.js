// import { useRoutes } from "react-router-dom";
// import Home from "./Home";
// import Signup from "./Auth/Singup";
// import Layout from "./layouts/Layout";
// import Login from "./Auth/Login";
// import EmployeeList from "./Admin/EmployeeList";
// import Edit from "./Admin/Edit";
// import Leave from "./Admin/Leave";
// import LeaveList from "./Admin/LeaveList";
// import ProtectedRoute from "./ProtectedRoute";

// // Wrap the entire AppRoutes component in Router
// function AppRoutes() {
//   const routes = [
//     { path: "/", element: <ProtectedRoute><Home /></ProtectedRoute>, title: "Dashboard" },
//     { path: "/signup", element: <Signup />, title: "Add User" },
//     { path: "/login", element: <Login />, title: "Login", noLayout: true },
//     { path: "/employee-list", element: <EmployeeList />, title: "Employee List" },
//     { path: "/edit/:id", element: <Edit />, title: "Edit Employee" },
//     { path: "/apply-leave/:id?", element: <Leave />, title: "Apply Leave" },
//     { path: "/leave-list", element: <LeaveList />, title: "Leave List" },
//   ];

//   const wrappedRoutes = routes.map((route) => ({
//     path: route.path,
//     element: route.noLayout 
//       ? route.element 
//       : <Layout children={route.element} title={route.title} />,
//   }));

//   return useRoutes(wrappedRoutes);
// }

// export default AppRoutes;
