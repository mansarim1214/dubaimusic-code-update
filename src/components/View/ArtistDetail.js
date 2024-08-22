import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import emailjs from "emailjs-com";
import Masonry from 'react-masonry-css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [formMessage, setFormMessage] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/artists/${id}`
        );
        setArtist(response.data);
        setLoading(false);

        // Load images to get their dimensions
        const imagePromises = response.data.galleryImages.map(async (img) => {
          const src = `${process.env.REACT_APP_API_URL}/${img}`;
          return new Promise((resolve) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve({ src, width: image.width, height: image.height });
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
      } catch (error) {
        console.error("Error fetching artist:", error);
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      artistName: artist?.title,
    };

    emailjs
      .send(
        "service_3hkljmf",
        "template_tg0y1rn",
        templateParams,
        "q1l_DC7jwQvu80xJ5"
      )
      .then((response) => {
        setFormMessage("Booking request sent successfully!");
        setFormData({ name: "", phone: "", email: "" });
      })
      .catch((error) => {
        setFormMessage("Failed to send booking request. Please try again.");
        console.error("Error sending booking request:", error);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (!artist) return <div>Artist not found.</div>;

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
    500: 1
  };

  return (
    <div className="artist-detail bg-custom">
      <div className="container">
        {artist.videoUrl && (
          <div className="artist-video">
            <iframe
              width="100%"
              height="500"
              src={`${artist.videoUrl.replace(
                "watch?v=",
                "embed/"
              )}?rel=0&modestbranding=1&showinfo=0&controls=1`}
              title={artist.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <h1>{artist.title}</h1>
        <div>
          Category: <span>{artist.category}</span>
        </div>
        <div>
          Speciality: <span>{artist.speciality}</span>
        </div>

        <div id="description" className="mt-3">
          <div className="row">
            <div className={`col-md-${(artist.galleryImages.length || artist.imageUrl) ? '6' : '12'}`}>
              <h4>About</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    artist.description ||
                    "<em>Description not available yet</em>",
                }}
              />
            </div>

            {(artist.galleryImages.length || artist.imageUrl) && (
              <div className={`col-md-${artist.imageUrl ? '6' : '12'}`}>
                {artist.imageUrl && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                    alt={artist.title}
                    className="artist-image mb-2"
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}

                {artist.galleryImages.length > 0 && (
                  <div className="gallery-container">
                    <h4>Gallery</h4>
                    <Gallery>
                      <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {images.map((img, index) => (
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
                                alt={`Gallery Image ${index + 1}`}
                                className="img-fluid"
                                style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
                              />
                            )}
                          </Item>
                        ))}
                      </Masonry>
                    </Gallery>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="artistForm mt-3">
          <h1 className="mx-2 my-2">Book this Artist</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <button type="submit" className="btn btn-danger enquirybtn">
                  Enquire Now
                </button>
              </div>
            </div>
          </form>
          {formMessage && <p className="form-message">{formMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
