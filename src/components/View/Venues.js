import React, { useState, useEffect } from "react";
import axios from "axios";
// import MultiCarousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
// import { Link } from 'react-router-dom';
// import { BsFillGeoAltFill } from "react-icons/bs";

const Venues = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/venues`
        );
        console.log("Fetched Venues:", response.data); // Debugging
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  // Function to group venues by category
  const groupVenuesByCategory = () => {
    const groupedVenues = {};
    venues.forEach((venue) => {
      if (!groupedVenues[venue.category]) {
        groupedVenues[venue.category] = [];
      }
      groupedVenues[venue.category].push(venue);
    });
    return groupedVenues;
  };

  // Get grouped venues
  const groupedVenues = groupVenuesByCategory();
  console.log("Grouped Venues:", groupedVenues); // Debugging

  // const responsive = {
  //   desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
  //   tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
  //   mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  // };

  return (
    <div className="bg-custom">
      <div className="container">
        {Object.keys(groupedVenues).map((category) => (
          <div key={category} className="category-wrapper">
            {/* <h2 className="my-2 fav-title">{category}</h2> */}
            <div className="row">
              {/* <div className="col">
                <MultiCarousel responsive={responsive}
                ssr={true}

                autoPlaySpeed={2000}

                customTransition="all 1.2s"
                transitionDuration={400}


                slidesToSlide={3}
                
                >
                  {groupedVenues[category].map((venue) => (
                    <div key={venue._id}>
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
                            <span className="location">{<BsFillGeoAltFill />} {venue.location}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </MultiCarousel>
              </div> */}

              <h1 style={{ fontFamily: "Netflix Sans,Helvetica Neue,Segoe UI,Roboto,Ubuntu,sans-serif", textAlign: "center" }}>Stay tuned!</h1>
              <h5 className="mt-3" style={{ fontFamily: "Netflix Sans,Helvetica Neue,Segoe UI,Roboto,Ubuntu,sans-serif", textAlign:"center", lineHeight:"30px" }}>
                Our Venues section is coming soon, where you’ll find the best
                live music spots in Dubai, listed for every day of the week.
                Whether you're looking for the hottest spots to catch live
                performances or planning your next big event, we’ve got you
                covered. Keep an eye out—this exciting feature is just around
                the corner!
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;
