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

  useEffect(() => {
    const manualArtistOrder = {
      Singers: [
        "Jerome Deligero", "Emily Peacock", "Toi Dupras", "Yvonne Park", 
        "Matt Palmer", "Lina Ammor- Jevtic", "Eirini Devitt", 
        "Juan Pablo Pellicer", "Nick Pritchard", "Mostafa Sattar", 
        "Jin Flora", "Robbi McFaulds"
      ],
      DJ: ["Dadou", "Elena", "Yana Kulyk", "Raphy J", "DJ Stylez", "DJ Melyna"],
      Musicians: [
        "Ksenia Kot", "Jose Ramon Nunez", "Soren Lyng Hansen", 
        "Tatiana Durova", "Aleksandra Dudek", "Ulyana Goncharova"
      ],
      Trending: [
        "Carrie Gibson’s NuvoSoul", "Jaymie Deville", "Chelsey Chantelle", 
        "Golden Collective", "Abdallah Seleem", "Dany Echemendia", 
        "Marvin Lee"
      ],
    };
  
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
  
        const desiredOrder = [
          "Trending", "Singers", "Solo Looping Artists", 
          "Band", "DJ", "Musicians"
        ];
  
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
          let sortedArtists = fetchedArtists
            .filter((artist) => artist.category === category.name)
            .map((artist) => ({
              ...artist,
              isFavorite: storedFavorites[artist._id] || false,
            }));
  
          const order = manualArtistOrder[category.name];
          if (order) {
            // Sort based on manualArtistOrder
            const sortedByManualOrder = sortedArtists.filter(artist =>
              order.includes(artist.title)
            ).sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));
  
            // Add artists not in the manualArtistOrder at the end
            const remainingArtists = sortedArtists.filter(
              artist => !order.includes(artist.title)
            );
  
            sortedArtists = [...sortedByManualOrder, ...remainingArtists];
          }
  
          groupedArtists[category.name] = sortedArtists;
        });
  
        setCategories(fetchedCategories);
        setArtistsByCategory(groupedArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
   // Dependency array is now empty, no need to include `manualArtistOrder`
  


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
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  return (
    <>
      <div className="mainFront">


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
                      transitionDuration={300} // Adjust transition duration
                      swipeable={true}         // Enable swipeable
                      draggable={true}         // Enable dragging
                      infinite={false}
                      partialVisible={true}
                      keyBoardControl={true}
                      shouldResetAutoplay={false}
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
