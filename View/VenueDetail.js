import React, { useEffect, useState  } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import emailjs from "emailjs-com";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { BsTelephone  } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon
import { BsArrowLeftSquareFill  } from "react-icons/bs";
import "./frontend.css"; // Import the CSS file for styling
import Preloader from "./Preloader";



const VenueDetail = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // Declare galleryImages here
  
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This will take the user to the previous page in the history stack
  };
  

  useEffect(() => {
    
    const fetchVenue = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/venues/${id}`
        );
        setVenue(response.data);
        setLoading(false);

        // Load images to get their dimensions
        const imagePromises = response.data.gallery.map(async (img) => {
          const src = `${process.env.REACT_APP_API_URL}/${img}`;
          return new Promise((resolve) => {
            const image = new Image();
            image.src = src;
            image.onload = () =>
              resolve({ src, width: image.width, height: image.height });
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        setGalleryImages(loadedImages); // Set the galleryImages state
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError("Failed to fetch venue. Please try again later.");
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);


  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;

  const addTargetToLinks = (html) => {
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  

  if (loading) return <Preloader />;


  if (error) return <div>Error: {error}</div>;

  if (!venue) return <div>No venue found.</div>;

  

  return (
    <div className="venue-detail bg-custom">
      <div className="container">

      <span onClick={handleBack} className="back-btn">
      <BsArrowLeftSquareFill  size={30} className="my-2"/> {/* Arrow icon */}
    </span>

        <h1>{venue.title}</h1>
        <div>
          {venue.location && (
            <>
              Location: <span>{venue.location}</span>
            </>
          )}
        </div>
        <div>{/* Category: <span>{venue.category}</span> */}</div>
        <div id="description" className="mt-3">
          <div className="row">
            <div
              className={`col-md-${
                galleryImages.length || venue.featuredImage ? "6" : "12"
              }`}
            >
              <h4>About</h4>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    addTargetToLinks(venue.description) ||
                    "<em>Description not available yet</em>",
                }}
              />

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
            {(galleryImages.length || venue.featuredImage) && (
              <div className={`col-md-${venue.featuredImage ? "6" : "12"}`}>
                {venue.featuredImage && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${venue.featuredImage}`}
                    alt={venue.title}
                    className="venue-image mb-2"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                {galleryImages.length > 0 && (
                  <div className="gallery-container">
                    <h4>Gallery</h4>
                    <Gallery>
                      <div className="grid-container">
                        {galleryImages.map((img, index) => (
                          <Item
                            key={index}
                            original={img.src}
                            thumbnail={img.src}
                            width={img.width}
                            height={img.height}
                          >
                            {({ ref, open }) => (
                              <img
                                ref={ref}
                                onClick={open}
                                src={img.src}
                                alt={`galleryimg ${index + 1}`}
                                className="grid-item"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </Item>
                        ))}
                      </div>
                    </Gallery>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {venue.contact> 0 && (
        <div className="venueForm mt-3">
        <div className="my-2">
         
            <h1>Contact Venue</h1>
            <a href={`tel:${venue.contact}`} target="_blank"  rel="noreferrer" className="btn btn-call"><BsTelephone /> Call Now</a>
          </div>

         
        
      </div>
         )}
      </div>
    </div>
  );
};

export default VenueDetail;
