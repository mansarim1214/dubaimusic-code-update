import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Preloader from './Preloader'; 
import DOMPurify from "dompurify";
import { useParams, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp Icon
import "./frontend.css";

// Lazy load the icons
const BsArrowLeftSquareFill = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsArrowLeftSquareFill }))
);
const BsTelephone = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsTelephone }))
);

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Fetch store details
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore/${id}`
        );
        setStore(response.data);
      } catch (err) {
        console.error("Error fetching store:", err);
        setError("Failed to fetch store. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  // Add target="_blank" and rel="noopener noreferrer" to links
  const addTargetToLinks = (html) =>
    DOMPurify.sanitize(html).replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );

  // WhatsApp share URL
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;

  
  if (loading) {
    return <Preloader />; // Show Preloader while loading data
  }
  if (error) return <div className="store-detail bg-custom">{error}</div>;
  if (!store) return <div className="store-detail bg-custom">No store found.</div>;

  return (
    <div className="store-detail bg-custom">
      <div className="container">
        {/* Back Button */}
        <Suspense fallback={<div>Loading Back Button...</div>}>
          <span onClick={handleBack} className="back-btn">
            <BsArrowLeftSquareFill size={30} className="my-2" />
          </span>
        </Suspense>

        {/* Featured Image */}
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
            {/* Store Bio */}
            <div className="col-md-7">
              <h4>Bio</h4>
              {store.bio && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: addTargetToLinks(store.bio),
                  }}
                />
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

            {/* Store Logo */}
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

        {/* Contact Information */}
        {store.contact && (
          <div className="artistForm mt-3">
            <h1>Contact Store</h1>
            <Suspense fallback={<div>Loading Call Button...</div>}>
              <a
                href={`tel:${store.contact}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-call"
              >
                <BsTelephone /> Call Now
              </a>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;