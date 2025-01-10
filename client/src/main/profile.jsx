import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../redux/Action';

const Profile = () => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    name: '',
    country: '',
    email:'',
    phone:'',
    city: '',
    gender: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', { withCredentials: true });
        setFields(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile', fields, { withCredentials: true });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
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
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  };

  return (
    <div>
      <h2 className="text-lg font-mono ml-6 mb-4">User Information</h2>
      <div className="grid grid-cols-1  lg:ml-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-4">
        <div className="order-2 md:order-1 lg:order-1">
          <form>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700" >Name:</label>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <div className='mb-4'> 
              <label className="block text-sm font-semibold text-gray-700">Country:</label>
              <input
                type="text"
                name="country"
                value={fields.country}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">City:</label>
              <input
                type="text"
                name="city"
                value={fields.city}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">Phone:</label>
              <input
                type="number"
                name="phone"
                value={fields.phone}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">Email:</label>
              <input
                type="text"
                name="email"
                value={fields.email}
               disabled
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              />
            </div>
            
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Save
            </button>
          </form>
        </div>

        <div className="order-1 md:order-2 lg:order-2">
        <div className='mb-4'>
              <label className="block text-sm font-semibold text-gray-700">Gender:</label>
              <select
                name="gender"
                value={fields.gender}
                onChange={handleFieldChange}
                className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"

              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          <div>
            <button className="px-3 bg-red-600 text-white" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
