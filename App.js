import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/View/Navbar";
import Footer from "./components/View/Footer";
import Musicians from "./components/View/Musicians";
import Dashboard from "./components/Dashboard/Dashboard";
import ArtistDetail from "./components/View/ArtistDetail";
import Favorites from "./components/View/Favorites";
import Venues from "./components/View/Venues";
import VenueDetail from "./components/View/VenueDetail";
import "./App.css";
import "./index.css";
import Unauthorized from './components/Dashboard/Unauthorized';
// import ProtectedRoute from './components/Dashboard/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Jobs from './components/View/Jobs';
import About from "./components/View/About";
import Login from "./components/Dashboard/Login";
import MusicStore from "./components/View/MusicStore";
import StoreDetail from "./components/View/StoreDetail";
import WeddingVIP from "./components/View/WeddingVIP";
import WeddingVIPDetail from "./components/View/WeddingVipDetail";





const App = () => {
  return (

    <AuthProvider>
    <div className="App">
    <Router>
     
    
        <Navbar />
        <Routes>
          <Route path="/" element={<Musicians />} /> 
          
          <Route path="/login" element={<Login />} />

       
          
              {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
              <Route path="/db-sarim-shehran1214" element={<Dashboard />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
           
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/wedding-vip-packages" element={<WeddingVIP />} />
          <Route path="/venuedetail/:id" element={<VenueDetail />} />
          <Route path="/music-store/:id" element={<StoreDetail />} />
          <Route path="/wedding-vip-packages/:id" element={<WeddingVIPDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/music-store" element={<MusicStore />} />
        </Routes>
        
        <Footer />

        </Router>
      </div>

      </AuthProvider>
   
  );
};

export default App;