import { useState } from "react";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      //dispatch action from hooks
    }
    alert("please provide a valid input");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (

    <div className="bg-custom">
      <div className="container bg-black p-5">
    <form onSubmit={handleSubmitEvent} className="form">
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
      <button className="btn px-5 btn-danger ">Login</button>
    </form>

    </div>
    </div>
  );
};

export default Login;