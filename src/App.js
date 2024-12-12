import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Home from "./Home";
import Signup from "./Auth/Singup";
import Layout from "./layouts/Layout";
import Login from "./Auth/Login";
import EmployeeList from './Admin/EmployeeList';
import Edit from './Admin/Edit';
import Ishu from "./Admin/ishu";
import Leave from "./Admin/Leave";



function AppRoutes() {
  return useRoutes([
    { path: "/", element: <Layout child={<Home />} /> },
    { path: "/Signup", element: <Layout child={<Signup />} /> },
    { path: "/login",element: <Login />  },
    { path: "/employee-list",element: <Layout child={<EmployeeList />} />  },
    { path: "/edit/:id", element: <Layout child={<Edit />} /> },
    { path: "/apply-leave", element: <Layout child={<Leave />} /> },

    {path: "/test",element: <Ishu />}



  ]);
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
