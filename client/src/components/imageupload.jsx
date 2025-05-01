import React from "react";
import { X } from "lucide-react";

const ImageUploader = ({ formData, setformData }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (formData.images.length >= 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setformData((prev) => ({
      ...prev,
      images: [...prev.images, { file, previewUrl }],
    }));
  };

  const handleDelete = (previewUrl) => {
    setformData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.previewUrl !== previewUrl),
    }));
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Upload Images (Max 5)</h2>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 w-full h-40 mb-5">
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
          id="fileInput"
          disabled={formData.images.length >= 5}
        />
        <label
          htmlFor="fileInput"
          className={`cursor-pointer text-gray-500 ${formData.images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {formData.images.length >= 5 ? "Image limit reached" : "Browse Files"}
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {formData.images &&
          formData.images.map((img, index) => (
            <div key={index} className="relative w-32 h-32">
              <img
                src={img.previewUrl}
                alt={`Selected ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(img.previewUrl)}
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
