import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload image to Firebase
      const { data } = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrl(data.url);
      setLoading(false);
    } catch (err) {
      setError("Failed to upload image");
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSubmit = async () => {
    if (imageUrl) {
      try {
        // Save image URL to DB
        await axios.post("http://localhost:5000/saveImageUrl", { imageUrl });
        alert("Image URL saved successfully");
      } catch (err) {
        alert("Failed to save image URL");
      }
    }
  };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>

      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageUrl && (
        <div>
          <p>Image uploaded successfully:</p>
          <img src={imageUrl} alt="Uploaded" width={200} />
        </div>
      )}

      <button onClick={handleSubmit} disabled={!imageUrl || loading}>
        Save Image URL
      </button>
    </div>
  );
};

export default ImageUpload;
