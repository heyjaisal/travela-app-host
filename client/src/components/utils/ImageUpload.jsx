import React from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ImageUpload = ({ onImageUpload }) => {
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      onImageUpload(data.imageUrl); 
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png', 
    onDrop: (acceptedFiles, fileRejections) => {
      fileRejections.length > 0 
        ? fileRejections.forEach((rejection) => console.error(`Skipped "${rejection.file.name}" due to invalid MIME type.`))
        : onDrop(acceptedFiles); 
    },
  });

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-gray-700">
        Image Upload
      </label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-11 md:p-12 lg:p-13 rounded-md flex flex-col items-center justify-center text-center text-gray-500"
      >
        <input {...getInputProps()} />
        <p className="mb-2">Drag & drop an image</p>
        <FaUpload className="text-2xl mb-2" />
        <p>Click to select</p>
      </div>
    </div>
  );
};

export default ImageUpload;
