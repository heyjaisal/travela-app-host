import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(token){
      navigate('/home')
    }

  },[navigate])
  return (
    <nav className="w-full bg-slate-800 p-4 flex justify-end">
      <div className="flex gap-4">
        <a 
          href="/signup" 
          className="text-white bg-purple-400 px-4 py-2 rounded hover:bg-purple-500"
        >
          SIGN UP
        </a>
        <a 
          href="/login" 
          className="text-white bg-purple-400 px-4 py-2 rounded hover:bg-purple-500"
        >
          LOGIN
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
