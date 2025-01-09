import React from 'react'
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../redux/Action';

const profile = () => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        // Check if gapi is loaded
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
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">

    <div class="order-2 lg:order-1">
    <div>
         <button className='px-3 bg-red-600' onClick={handleLogout}>Logout</button>
      
    </div>
    </div>
  
    <div class="order-1 lg:order-2">7</div>
  </div>

  )
}

export default profile
