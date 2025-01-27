import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModalImage from 'react-modal-image';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const message = sessionStorage.getItem('message');
    if (message) {
      toast.success(message);
      setTimeout(() => {
        sessionStorage.removeItem('message');
      }, 2000);
    }
  }, []);

  const fetchEmployees = async (page = 1) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/employee-list?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmployees(data.employees.data || []);
        setCurrentPage(data.employees.current_page);
        setTotalPages(data.employees.last_page);
      } else {
        console.error("Failed to fetch employees:", data.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]); 

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/delete/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Employee deleted successfully!");
        fetchEmployees(currentPage); 
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); 
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Employee List</h3>
                </div>
                <div className="card-body">
                  <table
                    id="example1"
                    className="table table-bordered table-striped"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Aadhar Image</th>
                        <th>Passbook Image</th>
                        <th>Pan Image</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length > 0 ? (
                        employees.map((emp) => (
                          <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>
                            <div style={{ width: "100px", height: "100px", overflow: "hidden" }}>
                              <ReactModalImage
                                small={`http://127.0.0.1:8000/storage/${emp.aadhar_image}`}
                                large={`http://127.0.0.1:8000/storage/${emp.aadhar_image}`}
                                alt="Aadhar"
                               // className="modal-image"
                              />
                            </div>
                            </td>
                            <td>
                            <div style={{ width: "100px", height: "100px", overflow: "hidden" }}>
                              <ReactModalImage
                                small={`http://127.0.0.1:8000/storage/${emp.passbook_image}`}
                                large={`http://127.0.0.1:8000/storage/${emp.passbook_image}`}
                                alt="Passbook"
                               // className="modal-image"
                              />
                            </div>
                            </td>
                            <td>
                            <div style={{ width: "100px", height: "100px", overflow: "hidden" }}>
                              <ReactModalImage
                                small={`http://127.0.0.1:8000/storage/${emp.pan_image}`}
                                large={`http://127.0.0.1:8000/storage/${emp.pan_image}`}
                                alt="Pan"
                              //  className="modal-image"
                              />
                            </div>
                            </td>
                            <td>
                              <Link to={`/edit/${emp.id}`}>
                                <li className="nav-icon fas fa-edit"></li>
                              </Link>
                            </td>
                            <td>
                              <Link to="" onClick={(e) => { e.preventDefault(); deleteEmployee(emp.id); }}>
                                <li className="danger-icon fas fa-trash" style={{ color: "#e80909" }}></li>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center' }}>
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="pagination" style={{ display: "flex", float: "right", marginTop: "22px" }}>
                    <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </button>
                    <span style={{ padding: "7px 4px" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button className="btn btn-primary" style={{ padding: "-1px 19px" }} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmployeeList;
