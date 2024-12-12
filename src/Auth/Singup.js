import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState('');
  const [salary, setSalary] = useState('');
  const [passbookImage, setPassbookImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [previewPassbookImage, setPreviewPassbookImage] = useState(null);
  const [previewPanImage, setPreviewPanImage] = useState(null);
  const [previewAadharImage, setPreviewAadharImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    console.log(file);
    setImage(file);
    const reader = new FileReader();
    console.log(reader);
    reader.onloadend = () => {
      setPreview(reader.result);  
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let formErrors = {};

    // Basic validation
    if (!name) formErrors.name = 'Name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!password) formErrors.password = 'Password is required';
    if (!role_id) formErrors.role = 'Role is required'; 
    if (!salary) formErrors.salary = 'Salary is required';
    if (!passbookImage) formErrors.passbookImage = 'Passbook image is required';
    if (!panImage) formErrors.panImage = 'PAN image is required';
    if (!aadharImage) formErrors.aadharImage = 'Aadhar image is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role_id', role_id); 
    formData.append('salary', salary);
    formData.append('passbook_image', passbookImage);
    formData.append('pan_image', panImage);
    formData.append('aadhar_image', aadharImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/add-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('toastMessage', 'Signup successful!'); 
      } 
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('An error occurred. Please try again later.');  
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/roles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
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

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Signup Form</h3>
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
                          id="name"
                          value={name}
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
                        {errors.aadharImage && <div className="text-danger">{errors.aadharImage}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
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

export default Signup;
