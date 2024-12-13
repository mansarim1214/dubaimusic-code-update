import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './frontend.css'; // Import CSS file

const Banner = () => {
  const slides = [
    {
      src: '/banner1.webp',
      alt: 'Banner for Musicians',
      text: 'Explore the World of Musicians',
      button: 'Explore Now',
      url: '#musicians',
    },
    {
      src: '/banner2.webp',
      alt: 'Banner for Venues',
      text: 'Find the Perfect Venue',
      button: 'Explore Venues',
      url: '/venues',
    },
    {
      src: '/banner3.webp',
      alt: 'Banner for Music Stores',
      text: 'Shop at Top Music Stores',
      button: 'Checkout Stores',
      url: '/music-store',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef();

  // GSAP Animation
  const animateSlide = (index) => {
    const xOffset = `-${index * 100}%`;
    gsap.to(carouselRef.current, {
      x: xOffset,
      duration: 2,
      ease: 'power2.inOut',
    });
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
      animateSlide(nextIndex);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle Dot Clicks
  const handleDotClick = (index) => {
    setCurrentIndex(index);
    animateSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={carouselRef}>
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide.src} alt={slide.alt} />
            <h1 className="carousel-text">{slide.text}</h1>
            <a href={slide.url} className="carousel-btn enquirybtn">
              {slide.button}
            </a>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index)}
            className={`carousel-dot ${
              currentIndex === index ? 'active' : ''
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
