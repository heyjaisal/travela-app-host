import React, { useState } from "react";
import axiosInstance from '../utils/axios-instance';
import { X } from "lucide-react";

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
      const { data } = await axiosInstance.post(
        "/host/auth/upload",
        uploadData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setformData((prev) => ({
        ...prev,
        images: [...(prev.images || []), data.imageUrl],
        imageFile: null,
      }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading image");
    }
    setLoading(false);
  };

  const handleDelete = async (url) => {
    if (!url) return alert("No image to delete");

    setLoading(true);
    try {
      await axiosInstance.delete("/host/auth/delete", {
        withCredentials: true,
        data: { image: url, type: type },
      });
      setformData((prev) => ({
        ...prev,
        images: prev.images.filter((image) => image !== url),
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
      </div>

      {/* Display uploaded images with delete button */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formData.images &&
          formData.images.map((url, index) => (
            <div key={index} className="relative w-32 h-32">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(url)}
                disabled={loading}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          ))}
      </div>
    </>
  );
};

export default ImageUploader;