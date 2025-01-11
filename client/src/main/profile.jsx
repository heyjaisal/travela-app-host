import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../redux/Action";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [Profile, setProfile] = useState({
    name: "",
    profileImage: "",
    country: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          withCredentials: true,
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const validatefeilds = () =>{
    let temperror = {}; 
    
    if(!Profile.name) temperror.name = "Name is required";
    if(!Profile.country) temperror.country = "Country is required";
    if(!Profile.city) temperror.city = "City name required";
    if(!Profile.gender) temperror.gender = "select a gender";
    if (!Profile.phone) {
      temperror.phone = "Phone number is required";
  } else if (Profile.phone.length > 10) {
      temperror.phone = "Phone number must be 10 digits or less";
  }

setErrors(temperror)
return Object.keys(temperror).length === 0
      } 
      

      const handleSave = async () => {
        if (validatefields()) {
          try {
            await axios.put("http://localhost:5000/api/profile", Profile, {
              withCredentials: true,
            });
            toast.success("Profile details submitted successfully!");
          } catch (error) {
            if (error.response?.data?.message === "Phone number already exists") {
              setErrors((prev) => ({ ...prev, phone: error.response.data.message }));
            } else {
              toast.error("Failed to update profile");
            }
          }
        }
      };

  const handleLogout = () => {
    if (window.gapi && window.gapi.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2.isSignedIn.get()) {
        auth2.signOut().catch(console.error);
      }
    }

    dispatch({ type: LOGOUT });
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color={"#4A90E2"} loading={loading} />
      </div>
    );
  }
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Welcome, {Profile.name}</h2>
          </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg mt-6 p-6 flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300">
            <img
              src={Profile.profileImage || "/client/public/no-profile.jpg"}
              alt="User"
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold mt-4">{Profile.name}</h3>
          <p className="text-sm text-gray-500">{Profile.email}</p>
        </div>

        {/* Right Section 1 */}
        <div className="flex-1">
        <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700" >Name:</label>
              <input
                type="text"
                name="name"
                value={Profile.name}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
              {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            </div>
            <div className='mb-4'> 
              <label className="block text-sm font-semibold text-gray-700">Country:</label>
              <input
                type="text"
                name="country"
                value={Profile.country}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
              {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">City:</label>
              <input
                type="text"
                name="city"
                value={Profile.city}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
              {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
            </div>
        </div>

        {/* Right Section 2 */}
        <div className="flex-1"><div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">Phone:</label>
              <input
                type="number"
                name="phone"
                value={Profile.phone}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
              {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">Email:</label>
              <input
                type="text"
                name="email"
                value={Profile.email}
               disabled
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Gender:
            </label>
            <select
              name="gender"
              value={Profile.gender}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
          
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 m-2"
            >
              Save
            </button>
            <button
             className="bg-red-600 text-white px-4 py-2 rounded mt-4 m-2"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;