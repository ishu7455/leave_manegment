import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';



const Profile = () => {
    
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [name , setName] = useState('');
  const [salary, setSalary] = useState('');
  const [role, setRole] = useState('');
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');


  const fetchUser = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) { 
      setName(data.user.name);
      setEmail(data.user.email);
      setSalary(data.user.salary);
      setRole(data.user.role.name);
      setImagePreview('http://127.0.0.1:8000/storage/'+data.user.image)

      

    } else {
      console.error('Failed to fetch profile', data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

 const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (fileInputRef.current?.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
  
    const response = await fetch('http://127.0.0.1:8000/api/profile-update',{
        method: 'post',
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData
    })
    const result = await response.json();

    if(response.ok){
       // alert('lnlkjkl');
    const updatedUser = result.user; 
    //console.log(updatedUser);
   localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log("Updated user:", JSON.parse(localStorage.getItem("user")));
        sessionStorage.setItem('toastMessage', 'Profile Update Succesfully!'); 
        navigate('/');
    }
 }


  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-body box-profile">
                <form onSubmit={handleSubmit} >
                  <div className="text-center">
                    <img
                      className="profile-user-img img-fluid img-circle"
                      src={imagePreview}
                      alt="User profile picture"
                      onClick={handleImageClick} 
                      style={{
                        width: "108px",
                        height: "108px",
                        objectFit: "cover",
                        cursor: "pointer", 
                      }}

                    />
                
                   
                   <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    style={{ marginBottom: "10px" , display:"none" }}
                    
                   />
                  </div>

                  <h3 className="profile-username text-center"> {name}</h3>

                  <p className="text-muted text-center">{role}</p>

                  <ul className="list-group list-group-unbordered mb-3">
                    <li className="list-group-item">
                      <b>Name</b>
                      <div className="float-right">
                        <input
                          className="float-right"
                          value={name}
                          onChange={(e) => setName(e.target.value)} 
                          style={{ border: 'none', outline: 'none', }}
                        />
                      </div>
                    </li>
                    <li className="list-group-item">
                      <b>Email</b> 
                      <div className="float-right">
                        <input
                          className="float-right"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)} 
                          style={{ border: 'none', outline: 'none' }}
                        />
                      </div>
                    </li>
                    <li className="list-group-item">
                      <b>Salary</b> 
                      <div className="float-right">
                        <input
                          className="float-right"
                          value={salary}
                          style={{ border: 'none', outline: 'none',  }}
                        />
                      </div>
                    </li>
                  </ul>

                  <button type="submit" className="btn btn-primary btn-block">
                        Save Changes
                   </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
