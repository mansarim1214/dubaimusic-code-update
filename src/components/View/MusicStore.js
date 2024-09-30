import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./frontend.css";

const MusicStore = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore`
        );
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-custom">
      <div className="container-fluid">
        <h2 className="my-2 fav-title">Music Stores</h2>
        <div
          className="storeGrid" // Grid layout
          
        >
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
