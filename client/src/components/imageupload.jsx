import React, { useState } from "react";
import axios from "axios";

const ImageUploader = ({ formData, setformData, type }) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setformData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleUpload = async () => {
    if (!formData.imageFile) return alert("Please select an image");

    const uploadData = new FormData();
    uploadData.append("image", formData.imageFile);
    uploadData.append("type", type);

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/upload",
        uploadData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(data.imageUrl);

      setformData((prev) => ({
        ...prev,
        image: data.imageUrl,
        imageFile: null,
      }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading image");
    }
    setLoading(false);
  };
  const handleDelete = async () => {
    if (!formData.image) return alert("No image to delete");

    setLoading(true);
    try {
      console.log(formData.image,type);
      
      // Use POST instead of DELETE
      await axios.delete(
        "http://localhost:5000/api/delete", // Change to POST
        {
          withCredentials: true,
          data: {
            image: formData.image,
            type: type,
          },
        }
      );
      

      setformData((prev) => ({
        ...prev,
        image: "",
      }));
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting image");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Upload images</h2>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 w-full h-40 mb-5">
        {!formData.image ? (
          <>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-gray-500">
              Browse Files
            </label>
            {formData.imageFile && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            )}
          </>
        ) : (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={formData.image}
              alt="Uploaded"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              onClick={handleDelete}
              disabled={loading}
              className="mt-2 text-red-500"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUploader;
