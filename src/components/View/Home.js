import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { BsChevronCompactRight } from "react-icons/bs";
import { BsChevronCompactLeft } from "react-icons/bs";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./frontend.css";

gsap.registerPlugin(Draggable);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [artistsByCategory, setArtistsByCategory] = useState({});
  const carouselRefs = useRef([]);

  useEffect(() => {
    const manualArtistOrder = {
      Singers: [
        "Jerome Deligero",
        "Emily Peacock",
        "Toi Dupras",
        "Yvonne Park",
        "Matt Palmer",
        "Lina Ammor- Jevtic",
        "Eirini Devitt",
        "Juan Pablo Pellicer",
        "Nick Pritchard",
        "Mostafa Sattar",
        "Jin Flora",
        "Robbi McFaulds",
      ],
      DJ: ["Dadou", "Elena", "Yana Kulyk", "Raphy J", "DJ Stylez", "DJ Melyna"],
      Musicians: [
        "Ksenia Kot",
        "Jose Ramon Nunez",
        "Soren Lyng Hansen",
        "Tatiana Durova",
        "Aleksandra Dudek",
        "Ulyana Goncharova",
      ],
      Trending: [
        "Carrie Gibson’s NuvoSoul",
        "Jaymie Deville",
        "Chelsey Chantelle",
        "Golden Collective",
        "Abdallah Seleem",
        "Dany Echemendia",
        "Marvin Lee",
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
          "Trending",
          "Singers",
          "Solo Looping Artists",
          "Band",
          "DJ",
          "Musicians",
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
            const sortedByManualOrder = sortedArtists
              .filter((artist) => order.includes(artist.title))
              .sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));

            // Add artists not in the manualArtistOrder at the end
            const remainingArtists = sortedArtists.filter(
              (artist) => !order.includes(artist.title)
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

  const isMobile = () => {
    return window.innerWidth <= 500; // Adjust the width threshold as needed
  };

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
            inertia: true,
            throwProps: true,
            edgeResistance: 1,
            onDrag: () => {
              gsap.to(carousel, { x: carousel._gsap.x, ease: "power2.out" });
            },
          });
        }
      });
    }
  }, [artistsByCategory]);


  const scrollCarousel = (direction, index) => {
    if (!isMobile()) {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      const item = carousel.querySelector('.artistImage');
      if (!item) {
        console.error('No items found in carousel');
        return;
      }
  
      const itemWidth = item.clientWidth; // Width of one item
      const scrollAmount = itemWidth * 3; // Scroll 3 items at a time
  
      let newScrollPosition = carousel.scrollLeft + (scrollAmount * direction);
      newScrollPosition = Math.max(0, Math.min(newScrollPosition, carousel.scrollWidth - carousel.clientWidth));
  
      gsap.to(carousel, {
        scrollLeft: newScrollPosition,
        duration: 0.5,
        ease: "power2.out",
      });
    };
  }

}

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
            .map((category, index) => (
              <section key={category._id} className="artSection">
                <h2 className="my-2 artCat">{category.name}</h2>
                <button
                  className="arrow left react-multiple-carousel__arrow react-multiple-carousel__arrow--left "
                  onClick={() => scrollCarousel(-1, index)}
                ><BsChevronCompactLeft /></button>
                <div
                  className="artistCarousel"
                  ref={(el) => (carouselRefs.current[index] = el)}
                  style={{
                    display: "flex",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {artistsByCategory[category.name]?.map((artist) => (
                    <div
                      className="artistImage"
                      key={artist._id}
                      style={{
                        flex: "0 0 16.67%", // 6 items visible at a time
                        boxSizing: "border-box",
                        padding: "0 5px",
                      }}
                    >
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
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                
                <button
                  className="arrow right react-multiple-carousel__arrow react-multiple-carousel__arrow--right "
                  onClick={() => scrollCarousel(1, index)}
                ><BsChevronCompactRight /></button>
              </section>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
