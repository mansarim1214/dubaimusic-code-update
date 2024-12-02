import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Preloader from "./Preloader"; // Import Preloader component
import "./frontend.css";

const MusicStore = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore`
        );
        
        // Filter only published stores
        const publishedStores = response.data.filter(
          (store) => store.status === "published"
        );
        
        setStores(publishedStores);  // Set fetched stores to state
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch stores. Please try again later.");  // Set error state if data fetch fails
        setLoading(false);  // Set loading to false in case of error as well
      }
    };

    fetchData();
  }, []);

  

  if (loading) return <Preloader />; // Use the Preloader component
  if (error) return <div className="bg-custom">{error}</div>;
  if (!stores || stores.length === 0) return <div className="bg-custom">No store found.</div>;

  return (
    <div className="bg-custom">
      <h2 className="my-2 fav-title">Music Stores</h2>
      <div className="container-fluid">
        <div className="storeGrid"> {/* Grid layout */} 
          {stores.map((store) => (
            <div
              key={store._id}
              className="storeCard"
              style={{
                textAlign: "center",
                padding: "10px",
              }}
            >
              <Link to={`/music-store/${store._id}`}>
                <div className="storeImage">
                  {store.featuredImage && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${store.featuredImage}`}
                      alt={store.name}
                      width="100%"
                      loading="lazy"
                    />
                  )}
                  <div className="storeContent">
                    <h4 className="artTitle">{store.name}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicStore;
