import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditIntSeries = ({ intSeries, setEditIntSeries, setShowAlert }) => {
  const [epno, setEpno] = useState(intSeries.epno);
  const [title, setTitle] = useState(intSeries.title);
  const [description, setDescription] = useState(intSeries.description);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [gallery, setGallery] = useState([]);
  const [newGalleryImages, setNewGalleryImages] = useState([]);

  // Music URLs
  const [spotify, setSpotify] = useState(intSeries.spotify || "");
  const [appleMusic, setAppleMusic] = useState(intSeries.appleMusic || "");
  const [soundcloud, setSoundcloud] = useState(intSeries.soundcloud || "");
  const [youtube, setYoutube] = useState(intSeries.youtube || "");

  useEffect(() => {
    setEpno(intSeries.epno);
    setTitle(intSeries.title);
    setDescription(intSeries.description);
    setSpotify(intSeries.spotify || "");
    setAppleMusic(intSeries.appleMusic || "");
    setSoundcloud(intSeries.soundcloud || "");
    setYoutube(intSeries.youtube || "");
    if (intSeries.gallery) {
      setGallery(intSeries.gallery);
    }
  }, [intSeries]);

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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/intseries/${intSeries._id}/gallery`, {
        data: { image: imageToRemove },
      });
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
    formData.append("epno", epno);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("spotify", spotify);
    formData.append("appleMusic", appleMusic);
    formData.append("soundcloud", soundcloud);
    formData.append("youtube", youtube);
    if (featuredImage) formData.append("featuredImage", featuredImage);
    newGalleryImages.forEach((file) => formData.append("galleryImages", file));

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/intseries/${intSeries._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("IntSeries updated:", response.data);
      setShowAlert({ type: "success", message: "IntSeries updated successfully!" });
      setEditIntSeries(null);
    } catch (error) {
      console.error("Error updating IntSeries:", error);
      setShowAlert({ type: "danger", message: "Failed to update IntSeries." });
    }
  };

  return (
    <div className="edit-intseries">
      <h3>Edit Introducing Series</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Ep #</label>
          <input
            type="text"
            value={epno}
            onChange={(e) => setEpno(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>

        {/* Music URLs */}
        <div className="form-group">
          <label>Spotify URL</label>
          <input
            type="url"
            value={spotify}
            onChange={(e) => setSpotify(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Apple Music URL</label>
          <input
            type="url"
            value={appleMusic}
            onChange={(e) => setAppleMusic(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>SoundCloud URL</label>
          <input
            type="url"
            value={soundcloud}
            onChange={(e) => setSoundcloud(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>YouTube URL</label>
          <input
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            className="form-control"
          />
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
                        alt={`gallery ${index + 1}`}
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
                        alt={`new gallery ${index + 1}`}
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

        <button type="submit" className="btn btn-lg btn-dark mt-4">
          Update IntSeries
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-3 mt-4"
          onClick={() => setEditIntSeries(null)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditIntSeries;
