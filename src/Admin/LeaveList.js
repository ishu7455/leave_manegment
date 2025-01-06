import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate"; // For Pagination


const LeaveList = () => {
  
  const [leave, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [userData, setUser] = useState(null);
  //const [message, setmessage] = useState('');


  
  

  const fetchLeave = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/admin/leave-list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLeaveData(data.types || []);
        const message = sessionStorage.getItem('message');
        if (message) {
         // alert('reach');
          toast.success(message);
          // setTimeout(() => {
             sessionStorage.removeItem('message');
          // }, 1000);
         }
      } else {
        toast.error(data.message || "Failed to fetch leave data.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteLeave = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/leave-delete/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Leave deleted successfully.");
        setLeaveData(leave.filter((item) => item.id !== id)); 
      } else {
        toast.error(result.message || "Failed to delete leave.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); 
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
    fetchLeave();

  
  }, []);

 
const filteredLeaves = leave.filter(
  (leaveItem) =>
    (leaveItem.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (String(leaveItem.user.employee_code).includes(searchQuery)) || 
    (leaveItem.type.name.toLowerCase().includes(searchQuery.toLowerCase()))
);

  // Get the current page's leaves
  const offset = currentPage * itemsPerPage;
  const currentLeaves = filteredLeaves.slice(offset, offset + itemsPerPage);

  return (
    <section className="content">
      <div className="container-fluid">
        <ToastContainer />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Employee Leave List</h3>
                <div className="card-tools">
                  <input
                    type="text"
                    placeholder="Search by name or employee code"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table id="example1" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>S No</th>
                        <th>Employee Code</th>
                        <th>Name</th>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        {[4, 5].includes(userData?.role_id) && (
                        <>
                        <th>Edit</th>
                        <th>Delete</th>
                        </>
                         )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentLeaves.map((leaveItem, index) => (
                        <tr key={leaveItem.id}>
                          <td>{index + 1}</td>
                          <td>{leaveItem.user.employee_code}</td>
                          <td>{leaveItem.user.name}</td>
                          <td>{leaveItem.type.name}</td>
                          <td>{leaveItem.from_date}</td>
                          <td>{leaveItem.to_date}</td>
                          {[4, 5].includes(userData?.role_id) && (
                          <>
                          <td>
                            <Link to={`/apply-leave/${leaveItem.id}`}>
                              <i className="nav-icon fas fa-edit"></i>
                            </Link>
                          </td>
                          <td>
                            <button
                              onClick={() => deleteLeave(leaveItem.id)}
                              style={{ border: "none", background: "none", color: "#e80909" }}
                            >
                              <i className="danger-icon fas fa-trash"></i>
                            </button>
                          </td>
                          </>
              )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="pagination-container">
          <ReactPaginate
            pageCount={Math.ceil(filteredLeaves.length / itemsPerPage)}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="Previous"
            nextLabel="Next"
          />
        </div>
      </div>
    </section>
  );
};

export default LeaveList;
