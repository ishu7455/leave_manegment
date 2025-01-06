import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';


const Leave = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [type_id, setLeaveType] = useState('');
  const [toDate, setToDate] = useState(null);

  const [fromDate, setFromDate] = useState(null);
  const [types, setTypes] = useState([]);
  const [errors, setErrors] = useState([]);
  const [editData, setEditData] = useState([]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveData = {
      to_date: toDate ? format(toDate, 'yyyy-MM-dd') : null,
      from_date: fromDate ? format(fromDate, 'yyyy-MM-dd') : null,
      type_id: type_id,
      id: id
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/leave-apply', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      const result = await response.json();
     // console.log(result.message);
      if (response.ok) {
        sessionStorage.setItem('message', 'Leave updated successfully!');
        navigate('/leave-list');
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred!');
    }
  };

  const fetchLeave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/leave-fetch', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTypes(data.types || []);
      } else {
        toast.error('Failed to fetch leave types.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching leave types.');
    }
  };

  const editLeave = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/leave-edit/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEditData(data.leave); 
        setLeaveType(data.leave.type_id);
        setFromDate(data.leave.from_date);
        setToDate(data.leave.to_date);
      } else {
        toast.error('Error fetching leave data.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching leave data.');
    }
  };
  useEffect(() => {
    fetchLeave();
    if (id) {
      editLeave(id); 
    }
  }, [id]); 

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Apply Leave</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>From Date</label>
                        <div>
                          <DatePicker
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            placeholderText="Select From Date"
                            isClearable
                          />
                           {errors.from_date && <div className="text-danger">{errors.from_date}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>To Date</label>
                        <div>
                          <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            minDate={fromDate || new Date()}
                            placeholderText="Select To Date"
                            isClearable
                          />
                          {errors.to_date && <div className="text-danger">{errors.to_date}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Leave Type</label>
                        <select
                          className="form-control"
                          value={type_id}
                          onChange={(e) => setLeaveType(e.target.value)}
                        >
                          <option value="">Select Leave Type</option>
                          {types.length > 0
                            ? types.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))
                            : <option disabled>No leave types available</option>
                          }
                        </select>
                        {errors.type_id && <div className="text-danger">{errors.type_id}</div>}

                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Leave;
