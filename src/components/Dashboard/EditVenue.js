import React, { useState, useEffect } from "react";
import axios from "axios";

const EditVenue = ({ venue, setEditVenue, setShowAlert }) => {
  const [title, setTitle] = useState(venue.title);
  const [description, setDescription] = useState(venue.description);
  const [location, setLocation] = useState(venue.location);
  const [category, setCategory] = useState(venue.category);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [fileName, setFileName] = useState("No file chosen");
  const [newGalleryImages, setNewGalleryImages] = useState([]);

  useEffect(() => {
    // Initialize gallery images from existing gallery
    if (venue.gallery) {
      setGallery(venue.gallery);
    }
  }, [venue.gallery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.id === "featuredImage") {
      setFeaturedImage(file);
      setFileName(file ? file.name : "No file chosen");
    } else if (e.target.id === "gallery") {
      setNewGalleryImages([...newGalleryImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveGalleryImage = async (index) => {
    const imageToRemove = gallery[index];

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/venues/${venue._id}/gallery`,
        {
          data: { image: imageToRemove },
        }
      );

      setGallery(gallery.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing gallery image:", error);
    }
  };

  const removeNewGalleryImage = (index) => {
    setNewGalleryImages(newGalleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    if (featuredImage) formData.append("featuredImage", featuredImage);
    newGalleryImages.forEach((file) => formData.append("galleryImages", file));

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/venues/${venue._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Venue updated:", response.data);
      setShowAlert({ type: "success", message: "Venue updated successfully!" });
      setEditVenue(null);
    } catch (error) {
      console.error(
        "Error updating venue:",
        error.response ? error.response.data : error.message
      );
      setShowAlert({ type: "danger", message: "Failed to update venue." });
    }
  };

  return (
    <div className="edit-venue">
      <h3>Edit Venue</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="form-control"
          >
            <option value="">Select category</option>
            <option value="Hidden Gems">Hidden Gems</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <div className="form-group">
          <label>Featured Image</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              className="form-control-file"
              id="featuredImage"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => document.getElementById("featuredImage").click()}
            >
              Upload Photo
            </button>
            <span id="file-name">{fileName}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Gallery</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              className="form-control-file"
              id="gallery"
              multiple
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => document.getElementById("gallery").click()}
            >
              Upload Photos
            </button>
            
          </div>
          <div className="mt-2">
            {gallery.length > 0 && (
              <>
                <h5>Existing Gallery Images</h5>
                <div className="grid-container">
                  {gallery.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${img}`}
                        alt={`galleryimg ${index + 1}`}
                        className="img-fluid"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {newGalleryImages.length > 0 && (
              <>
                <h5 className="mt-4">New Gallery Images</h5>
                <div className="grid-container">
                  {newGalleryImages.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`New galleryimg ${index + 1}`}
                        className="img-fluid"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => removeNewGalleryImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-lg btn-dark mt-5">
          Update Venue
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-3 mt-5"
          onClick={() => setEditVenue(null)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditVenue;
