import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { BsChevronCompactRight } from "react-icons/bs";
import { BsChevronCompactLeft } from "react-icons/bs";
import "./frontend.css";

gsap.registerPlugin(Draggable);

const Favorites = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const carouselRefs = useRef([]);

  const isMobile = () => window.innerWidth <= 500;

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favoriteArtists")) || {};
      const favoriteArtistIds = Object.keys(storedFavorites);

      try {
        const responses = await Promise.all(
          favoriteArtistIds.map((artistId) =>
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/artists/${artistId}`
            )
          )
        );
        const fetchedArtists = responses.map((response) => response.data);
        setFavoriteArtists(fetchedArtists);
      } catch (error) {
        console.error("Error fetching favorite artists:", error);
      }
    };

    fetchFavoriteArtists();
  }, []);

  const toggleFavorite = (artistId) => {
    const updatedFavoriteArtists = favoriteArtists.filter(
      (artist) => artist._id !== artistId
    );
    setFavoriteArtists(updatedFavoriteArtists);

    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteArtists")) || {};
    delete storedFavorites[artistId];
    localStorage.setItem("favoriteArtists", JSON.stringify(storedFavorites));
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
            onThrowUpdate: () => {
              gsap.to(carousel, { x: carousel._gsap.x, ease: "power2.out" });
            },
            snap: {
              x: (value) => Math.round(value / 200) * 200, // Adjust based on item width
            },
          });
        }
      });
    }
  }, [favoriteArtists]);

  const scrollCarousel = (direction, index) => {
    if (!isMobile()) {
      const carousel = carouselRefs.current[index];
      if (carousel) {
        const item = carousel.querySelector(".artistImage");
        if (!item) {
          console.error("No items found in carousel");
          return;
        }

        const itemWidth = item.clientWidth;
        const scrollAmount = itemWidth * 3;

        let newScrollPosition =
          carousel.scrollLeft + scrollAmount * direction;
        newScrollPosition = Math.max(
          0,
          Math.min(
            newScrollPosition,
            carousel.scrollWidth - carousel.clientWidth
          )
        );

        gsap.to(carousel, {
          scrollLeft: newScrollPosition,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <div className="bg-custom">
      <div className="container-fluid">
        <h2 className="mb-3 fav-title">
          <strong>Artists You've Favorited</strong>
        </h2>
        {favoriteArtists.length === 0 ? (
          <p>No favorite added yet!</p>
        ) : (
          <div className="row">
            <div className="col no-gutter p-relative">
              <button
                className="arrow left react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
                onClick={() => scrollCarousel(-1, 0)}
              >
                <BsChevronCompactLeft />
              </button>
              <div
                className="artistCarousel"
                ref={(el) => (carouselRefs.current[0] = el)}
                style={{
                  display: "flex",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                {favoriteArtists.map((artist) => (
                  <div
                    key={artist._id}
                    className="artistImage"
                    style={{ flex: "0 0 16.67%", padding: "0 5px" }}
                  >
                    <span
                      className="favorite favorited"
                      onClick={() => toggleFavorite(artist._id)}
                      style={{ color: "red" }}
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
                className="arrow right react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
                onClick={() => scrollCarousel(1, 0)}
              >
                <BsChevronCompactRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
