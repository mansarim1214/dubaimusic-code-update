import React, { useState, useEffect } from "react";
import axios from "axios";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import "./frontend.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [artistsByCategory, setArtistsByCategory] = useState({});
  // const [setLoading] = useState(true);
  // const [setError] = useState(null);

  // console.log('API URL:', process.env.REACT_APP_API_URL);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/categories`
        );
        const fetchedCategories = categoriesResponse.data;

        const artistsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/artists`
        );
        const fetchedArtists = artistsResponse.data;

        const desiredOrder = ["Trending", "Singers", "Band", "DJ", "Musicians"];

        fetchedCategories.sort((a, b) => {
          const aIndex = desiredOrder.indexOf(a.name);
          const bIndex = desiredOrder.indexOf(b.name);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        const storedFavorites =
          JSON.parse(localStorage.getItem("favoriteArtists")) || {};
        const groupedArtists = {};
        fetchedCategories.forEach((category) => {
          groupedArtists[category.name] = fetchedArtists
            .filter((artist) => artist.category === category.name)
            .map((artist) => ({
              ...artist,
              isFavorite: storedFavorites[artist._id] || false,
            }));
        });

        setCategories(fetchedCategories);
        setArtistsByCategory(groupedArtists);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError("Error fetching data. Please try again later.");
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = (artistId) => {
    const updatedArtistsByCategory = { ...artistsByCategory };
    let isFavorite = false;

    // Update local state
    Object.keys(updatedArtistsByCategory).forEach((category) => {
      updatedArtistsByCategory[category] = updatedArtistsByCategory[
        category
      ].map((artist) => {
        if (artist._id === artistId) {
          isFavorite = !artist.isFavorite;
          return { ...artist, isFavorite };
        }
        return artist;
      });
    });

    setArtistsByCategory(updatedArtistsByCategory);

    // Update localStorage
    const favoriteArtists =
      JSON.parse(localStorage.getItem("favoriteArtists")) || {};
    if (isFavorite) {
      favoriteArtists[artistId] = true;
    } else {
      delete favoriteArtists[artistId];
    }
    localStorage.setItem("favoriteArtists", JSON.stringify(favoriteArtists));
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 4,
    },
  };

  return (
    <>
      <div className="mainFront">
        {/* Hero Section  */}
        <div className="heroSection text-white d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="text-center">
              <h1 className="display-4">Welcome to Dubai Music</h1>
              <p>
                your go-to hub for booking the best musicians in Dubai. Whether
                you're planning a wedding, event, or managing a venue, you can
                easily book your favourite music acts with just a click. Explore
                our curated list of top talent and create the perfect atmosphere
                for any experience..
              </p>
            </div>

            <div class="default-ltr-cache-dulgtd">
              <div class="curve-container">
                <div class="default-ltr-cache-1f97ztc"></div>
              </div>
              <div class="default-ltr-cache-jtcpfi"></div>
            </div>
          </div>
        </div>

        {/* Hero section  */}

        <div className="container-fluid" id="explore">
          {categories
            .filter(
              (category) =>
                artistsByCategory[category.name] &&
                artistsByCategory[category.name].length > 0
            )
            .map((category) => (
              <section key={category._id} className="artSection">
                <h2 className="my-2 artCat">{category.name}</h2>
                <div className="artistCarousel">
                  <MultiCarousel
                     responsive={responsive}
                     autoPlaySpeed={4000}
                     transitionDuration={150} // Faster transitions
                     swipeable={true}
                     draggable={true}
                     infinite={false}
                     partialVisible={true}
                     keyBoardControl={true}
                  >
                    {artistsByCategory[category.name]?.map((artist) => (
                      <div key={artist._id}>
                        <span
                          className={`favorite ${
                            artist.isFavorite ? "favorited" : ""
                          }`}
                          onClick={() => toggleFavorite(artist._id)}
                          style={{ color: artist.isFavorite ? "red" : "grey" }}
                        >
                          <BsHeartFill />
                        </span>
                        <Link to={`/artist/${artist._id}`}>
                          <div className="artistImage">
                            {artist.imageUrl && (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                                alt={artist.title}
                                width="100%"
                                loading="lazy"
                              />
                            )}
                            <div className="artContent">
                              <h4 className="artTitle">{artist.title}</h4>
                              {/* <span className="speciality">{artist.speciality}</span> */}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </MultiCarousel>
                </div>
              </section>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
