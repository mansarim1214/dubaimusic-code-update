import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/View/Navbar";
import Footer from "./components/View/Footer";
import Home from "./components/View/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import ArtistDetail from "./components/View/ArtistDetail";
import Favorites from "./components/View/Favorites";
import Venues from "./components/View/Venues";
import VenueDetail from "./components/View/VenueDetail";
import "./App.css";
import "./index.css";

import Login from "./components/Login";


const App = () => {
  return (
    <div className="App">
    <Router>
     
    
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
              <Route path="/dashboard" element={<Dashboard />} />
           
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venuedetail/:id" element={<VenueDetail />} />
        </Routes>
        
        <Footer />

        </Router>
      </div>
   
  );
};

export default App;