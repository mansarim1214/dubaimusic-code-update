import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsTelephone  } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon
import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeftSquareFill  } from "react-icons/bs";
import "./frontend.css";

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This will take the user to the previous page in the history stack
  };


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


  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;


  const addTargetToLinks = (html) => {
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!store) return <div>No store found.</div>;

  return (
    <div className="store-detail bg-custom">




      <div className="container">


      <span onClick={handleBack} className="back-btn">
      <BsArrowLeftSquareFill  size={30} className="my-2"/> {/* Arrow icon */}
    </span>

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
            <div className="col-md-7">
              <h4>Bio</h4>

              {store.bio && (
                <>
                  <div dangerouslySetInnerHTML={{ __html: addTargetToLinks(store.bio) }} />
                </>
              )}

              {/* WhatsApp Share Button */}
              <div className="whatsapp-share my-5">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  <FaWhatsapp /> Share with Friends
                </a>
              </div>
           
            </div>

            <div className="col-md-5">
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
