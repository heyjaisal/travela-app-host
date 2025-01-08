import React from 'react'

const profile = () => {

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  return (

    <div>
      <button className='px-3 bg-red-600' onClick={handleGoogleSignup}>Logout</button>

      
    </div>
  )
}

export default profile
