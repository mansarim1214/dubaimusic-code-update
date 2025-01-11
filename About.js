import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const About = () => {
  const logoContainerRef = useRef(null);

  useEffect(() => {
    const container = logoContainerRef.current;
    const clone = container.innerHTML; // Clone the logos
    container.innerHTML += clone; // Append the cloned logos for infinite scrolling

    const calculateDuration = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) return 5; // Faster for smaller screens
      if (screenWidth < 1200) return 15; // Moderate speed for medium screens
      return 10; // Slower for larger screens
    };

    const animation = gsap.to(container, {
      x: "-100%", // Scroll to the end of the first set of logos
      ease: "linear",
      repeat: -1,
      duration: calculateDuration(), // Adjust speed based on screen size
    });

    const resizeHandler = () => {
      animation.duration(calculateDuration()); // Update duration on screen resize
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      animation.kill(); // Cleanup animation
      window.removeEventListener("resize", resizeHandler); // Cleanup event listener
    };
  }, []);

  return (
    <div className="bg-custom">
      <div className="container">
        <div className="text-white d-flex justify-content-center align-items-center">
          <div className="col-md-7">
            <div className="text-center">
              <h2>Welcome to Dubai Music</h2>
              <p>
                Your go-to hub for booking the best musicians in Dubai. Whether
                you're planning a wedding, event, or managing a venue, you can
                easily book your favorite music acts with just a click. Explore
                our curated list of top talent and create the perfect atmosphere
                for any experience.
              </p>
            </div>
          </div>
        </div>

        {/* Logo Carousel Section */}
        <div className="logo-carousel text-center">
        <h1>Our Clients</h1>
          <div
            className="logo-container d-flex align-items-center mt-5"
            ref={logoContainerRef}
          >
            <img src="/logos/1.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/2.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/3.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/4.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/5.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/6.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/7.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/8.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/9.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/10.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/11.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/12.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/13.webp" alt="Logo 1" className="logo mx-3" />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
