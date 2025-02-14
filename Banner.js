import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './frontend.css'; // Import CSS file

const Banner = () => {
  const slides = [

    {
      src: '/banner2.webp',
      alt: 'Banner for Venues',
      text: 'Discover Live Music Venues',
      button: 'Explore Venues',
      url: '/venues',
      class: 'center',
    },

    {
      src: '/banner3.webp',
      alt: 'Banner for Music Stores',
      text: 'Shop at Top Music Stores',
      button: 'Checkout Stores',
      url: '/music-store',
    },
    
    {
      src: '/banner1.webp',
      alt: 'Banner for Musicians',
      text: 'Explore Dubai’s Top Musicians',
      button: 'Explore Now',
      url: '#musicians',
    },
  
    {
      src: '/coca-cola-arena.webp',
      alt: 'Banner for coca cola arena',
      text: 'Experience Thrilling Events at Coca-Cola Arena',
      button: 'Explore Now',
      url: 'https://www.coca-cola-arena.com/',
    },

    {
      src: '/dubai-opera.webp',
      alt: 'Banner for dubai opera',
      text: 'Discover World-Class Performances at Dubai Opera',
      button: 'View Shows',
      url: 'https://www.dubaiopera.com/en-US/products-list?utm_source=sem&utm_medium=cpc&utm_campaign=EE_Tac_BR_BR_DO_All_GA_SEM_Web_AE_EN_PRO_Conv_2322021&utm_term=ae-en&utm_content=en&gad_source=1',
    },

    {
      src: '/guitar-store.webp',
      alt: 'Art of Guitar',
      text: 'Art of Guitar',
      button: 'View Store',
      url: '/music-store/67afa3372272627033bafded',
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
    }, 3000);

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
            <img src={slide.src} alt={slide.alt} className={slide.class}/>
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
