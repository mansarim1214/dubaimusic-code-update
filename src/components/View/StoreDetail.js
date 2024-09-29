import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsTelephone  } from "react-icons/bs";
import { useParams } from "react-router-dom";
import "./frontend.css";

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore/${id}`
        );
        setStore(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store:", error);
        setError("Failed to fetch store. Please try again later.");
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);


  const addTargetToLinks = (html) => {
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!store) return <div>No store found.</div>;

  return (
    <div className="store-detail bg-custom">
      <div className="container">
        {store.featuredImage && (
          <img
            src={`${process.env.REACT_APP_API_URL}/${store.featuredImage}`}
            alt={store.name}
            className="store-image mb-2"
            style={{ width: "100%", height: "auto" }}
          />
        )}

        <h1>{store.name}</h1>
        

        <div id="description" className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <h4>Bio</h4>

              {store.bio && (
                <>
                  <div dangerouslySetInnerHTML={{ __html: addTargetToLinks(store.bio) }} />
                </>
              )}
            </div>

            <div className="col-md-6">
              {store.logo && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${store.logo}`}
                  alt={`${store.name} Logo`}
                  className="store-logo"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </div>
          </div>
        </div>

        {store.contact && (
          <div className="artistForm mt-3">
            <div className="my-2">
             
                <h1>Contact Store</h1>
                <a href={`tel:${store.contact}`} target="_blank"  rel="noreferrer" className="btn btn-call"><BsTelephone /> Call Now</a>
              </div>

             
            
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
