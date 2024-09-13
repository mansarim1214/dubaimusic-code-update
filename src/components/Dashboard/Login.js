import { useState } from 'react';
const md5 = require('md5'); // Import the md5 library

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '' });
  const [error, setError] = useState('');



  const handleSubmitEvent = async (e) => {
   
    e.preventDefault();
    try {
      const md5Hash = md5('admin123');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: input.email,
          password: md5Hash,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/venues";
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };
  

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div className="bg-custom">
      <div className="container ">
        <div className="row"  style={{ justifyContent: 'center' }}>
          <div className="col-md-6 bg-black p-5">
        <form onSubmit={handleSubmitEvent} className="form mb-3">
          <div className="form_control">
            <label htmlFor="user-email">Email</label>
            <input
              type="email"
              id="user-email"
              name="email"
              aria-describedby="user-email"
              aria-invalid="false"
              onChange={handleInput}
              className="form-control"
            />
          </div>
          <div className="form_control my-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
              className="form-control"
            />
          </div>
          <button className="btn instant-btn px-5">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
