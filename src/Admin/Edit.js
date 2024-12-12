import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role_id, setRoleId] = useState('');
  const [salary, setSalary] = useState('');
  const [passbook_image, setPassbookImage] = useState(null);
  const [pan_image, setPanImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [previewPassbookImage, setPreviewPassbookImage] = useState(null);
  const [previewPanImage, setPreviewPanImage] = useState(null);
  const [previewAadharImage, setPreviewAadharImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/edit/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setName(data.employee.name);
          setEmail(data.employee.email);
          setRoleId(data.employee.role_id);
          setSalary(data.employee.salary);
          // Set existing images URLs
          setPreviewPassbookImage(data.employee.passbook_image ? `http://127.0.0.1:8000/storage/${data.employee.passbook_image}` : null);
          setPreviewPanImage(data.employee.pan_image ? `http://127.0.0.1:8000/storage/${data.employee.pan_image}` : null);
          setPreviewAadharImage(data.employee.aadhar_image ? `http://127.0.0.1:8000/storage/${data.employee.aadhar_image}` : null);
        } else {
          console.error('Failed to fetch employee:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
      setLoading(false);
    };

    fetchEmployee();
    fetchRoles();
  }, [id]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/roles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRoles(data.roles);
      } else {
        console.error('Failed to fetch roles:', data.message);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role_id', role_id);
    formData.append('salary', salary);

    if (passbook_image) formData.append('passbook_image', passbook_image);
    if (pan_image) formData.append('pan_image', pan_image);
    if (aadharImage) formData.append('aadhar_image', aadharImage);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/update/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('message', 'Employee updated successfully!');
  
        navigate('/employee-list');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          toast.error(data.message || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  // Handle image preview
  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Edit Employee</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          id="name"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter name"
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email"
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                          className="form-control"
                          id="role"
                          value={role_id}
                          onChange={(e) => setRoleId(e.target.value)}
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        {errors.role && <div className="text-danger">{errors.role}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="salary">Salary</label>
                        <input
                          type="number"
                          className="form-control"
                          id="salary"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          placeholder="Enter salary"
                        />
                        {errors.salary && <div className="text-danger">{errors.salary}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="passbook_image">Passbook Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="passbook_image"
                          onChange={(e) => handleImageChange(e, setPassbookImage, setPreviewPassbookImage)}
                        />
                        {previewPassbookImage && (
                          <div>
                            <h5>Preview:</h5>
                            <img
                              src={previewPassbookImage}
                              alt="Passbook Preview"
                              style={{ height: '150px', width: '150px' }}
                            />
                          </div>
                        )}
                        {previewPassbookImage === null && (
                          <img
                            src={`http://127.0.0.1:8000/storage/${passbook_image}`}
                            alt="Existing Passbook"
                            style={{ height: '150px', width: '150px' }}
                          />
                        )}
                        {errors.passbookImage && <div className="text-danger">{errors.passbookImage}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="pan_image">PAN Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="pan_image"
                          onChange={(e) => handleImageChange(e, setPanImage, setPreviewPanImage)}
                        />
                        {previewPanImage && (
                          <div>
                            <h5>Preview:</h5>
                            <img
                              src={previewPanImage}
                              alt="PAN Preview"
                              style={{ height: '150px', width: '150px' }}
                            />
                          </div>
                        )}
                        {previewPanImage === null && (
                          <img
                            src={`http://127.0.0.1:8000/storage/${pan_image}`}
                            alt="Existing PAN"
                            style={{ height: '150px', width: '150px' }}
                          />
                        )}
                        {errors.panImage && <div className="text-danger">{errors.panImage}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="aadhar_image">Aadhar Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="aadhar_image"
                          onChange={(e) => handleImageChange(e, setAadharImage, setPreviewAadharImage)}
                        />
                        {previewAadharImage && (
                          <div>
                            <h5>Preview:</h5>
                            <img
                              src={previewAadharImage}
                              alt="Aadhar Preview"
                              style={{ height: '150px', width: '150px' }}
                            />
                          </div>
                        )}
                        {previewAadharImage === null && (
                          <img
                            src={`http://127.0.0.1:8000/storage/${aadharImage}`}
                            alt="Existing Aadhar"
                            style={{ height: '150px', width: '150px' }}
                          />
                        )}
                        {errors.aadharImage && <div className="text-danger">{errors.aadharImage}</div>}
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

    </section>
  );
};

export default Edit;
