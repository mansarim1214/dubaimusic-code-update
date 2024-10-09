import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Link } from "react-router-dom";
import { BsFillGeoAltFill } from "react-icons/bs";
import WelcomeModal from "./WelcomeModal";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";

gsap.registerPlugin(Draggable);

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const carouselRefs = useRef([]);

  const isMobile = () => window.innerWidth <= 500;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/venues`
        );
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };


  const categoryOrder = [
    // "Coca Cola Arena",
    "Hot Picks",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  
  // Function to group venues by category and shuffle the venues in each category
  const groupVenuesByCategory = () => {
    const groupedVenues = {};
    
    // Group the venues by category
    venues.forEach((venue) => {
      if (!groupedVenues[venue.category]) {
        groupedVenues[venue.category] = [];
      }
      groupedVenues[venue.category].push(venue);
    });
  
    const orderedGroupedVenues = {};
  
    // Ensure categories appear in the order defined in categoryOrder
    categoryOrder.forEach((category) => {
      if (groupedVenues[category]) {
        orderedGroupedVenues[category] = shuffleArray(groupedVenues[category]); // Shuffle the venues within the category
      }
    });
  
    return orderedGroupedVenues;
  };
  

  // Get grouped venues
  const groupedVenues = groupVenuesByCategory();

  // Carousel Setting
  const scrollCarousel = (direction, index) => {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      const item = carousel.querySelector(".venueImage");
      if (!item) {
        console.error("No items found in carousel");
        return;
      }

      const itemWidth = item.clientWidth; // Width of one item
      const scrollAmount = itemWidth * 3; // Scroll 3 items at a time

      let newScrollPosition = carousel.scrollLeft + scrollAmount * direction;
      newScrollPosition = Math.max(
        0,
        Math.min(newScrollPosition, carousel.scrollWidth - carousel.clientWidth)
      );

      gsap.to(carousel, {
        scrollLeft: newScrollPosition,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  // Enable dragging on mobile
  useEffect(() => {
    if (isMobile()) {
      carouselRefs.current.forEach((carousel) => {
        if (carousel) {
          gsap.killTweensOf(carousel);

          Draggable.create(carousel, {
            type: "x",
            bounds: {
              minX: -carousel.scrollWidth + carousel.clientWidth,
              maxX: 0,
            },
            inertia: true, // Enable inertia for smoother dragging end
            throwProps: true, // Allow for smoother throw behavior
            edgeResistance: 0.65,
            onThrowUpdate: () => {
              gsap.to(carousel, { x: carousel._gsap.x, ease: "power2.out" });
            },
            snap: {
              x: (value) => Math.round(value / 16.67) * 200, // Adjust based on item width
            },
          });
        }
      });
    }
  }, [groupedVenues]);

  return (
    <div className="bg-custom">

<WelcomeModal />

      <div className="container-fluid p-0">
        {Object.keys(groupedVenues).map((category, index) => {
          const carousel = carouselRefs.current[index];
          const isScrollable =
            carousel && carousel.scrollWidth > carousel.clientWidth;

          return (
            <div key={category} className="category-wrapper">
            

              <div className="div mb-2 ">
              <h2 className="my-2 fav-title">{category}</h2>


                <hr></hr>
              </div>

              <div className="row">
                <div className="col p-relative">
                  {/* Conditionally render the left arrow */}
                  {isScrollable && (
                    <button
                      className="arrow left react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
                      onClick={() => scrollCarousel(-1, index)}
                    >
                      <BsChevronCompactLeft />
                    </button>
                  )}
                  <div
                    className="venueCarousel"
                    ref={(el) => (carouselRefs.current[index] = el)}
                    style={{
                      display: "flex",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {groupedVenues[category].map((venue) => (
                      <div
                        key={venue._id}
                        className="venueImage"
                        style={{ flex: "0 0 16.67%", padding: "0 5px" }}
                      >
                        <Link to={`/venuedetail/${venue._id}`}>
                          <div className="artistImage">
                            {venue.featuredImage && (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${venue.featuredImage}`}
                                alt={venue.title}
                                width="100%"
                                loading="lazy"
                              />
                            )}
                            <div className="artContent">
                              <h4 className="artTitle">{venue.title}</h4>
                              {venue.location && (
                                <span className="location">
                                  <BsFillGeoAltFill /> {venue.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  {/* Conditionally render the right arrow */}
                  {isScrollable && (
                    <button
                      className="arrow right react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
                      onClick={() => scrollCarousel(1, index)}
                    >
                      <BsChevronCompactRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Venues;
