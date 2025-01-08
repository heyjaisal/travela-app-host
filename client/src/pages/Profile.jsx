import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../redux/Action';

const Profile = () => {
  const dispatch = useDispatch();

  const handleGoogleLogout = () => {
  
    const auth2 = window.gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      auth2.signOut().then(() => {
        console.log('User signed out from Google');
      }).catch((error) => {
        console.error('Google sign-out failed:', error);
      });
    }
  };

  const handleAppLogout = () => {

    dispatch({ type: LOGOUT });

    localStorage.clear();
    sessionStorage.clear();

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    handleGoogleLogout();

  };

  return (
    <div>
      <button className='px-3 bg-red-600' onClick={handleAppLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
