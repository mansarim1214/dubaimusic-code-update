import React from "react";
import "./frontend.css";



const Preloader = () => {
  return (
    <div className="text-center bg-custom  preloader">
      
      <img
            src="/dubai-music-white-logo.webp"
            width="150px"
            className="d-inline-block align-top"
            alt="Logo"
          />

<p>Loading...</p>
    </div>
  );
};

export default Preloader;
