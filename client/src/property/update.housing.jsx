import { useOnceEffect } from "@/hooks/useeffectOnce";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const HouseUpdate = () => {

  const [loading, setLoading] = useState(true);

  const [houseData, sethouseData] = useState({
      propertyType: "",
      size: "",
      price: "",
      description: "",
      bedrooms: 0,
      kitchen: 0,
      bathrooms: 0,
      maxGuests: 0,
      maxStay: 0,
      address: "",
    });

    useOnceEffect(()=>{

    const fetchData = async () =>{
      try{
        
        const response = axios.get('http://localhost:5000/api/host/auth/house',{
          withCredentials: true,
        })
        sethouseData(response.data);
        console.log(response.data);
        setLoading(false);

      }catch(error){

      }
    }
    fetchData()

  })

  if (loading) {
    return (
      <div className="h-screen flex item-center justify-center">
        <ClipLoader size={50} color={"#4A90E2"} loading={loading} />
      </div>
    );
  }
  return (
    <div className="h-screen p-1">
    
        <div>
          <h2 className="text-xl font-bold text-gray-700">Edit & Update</h2>
        </div>
      
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">

            <div>
<h1> left</h1>
            </div>
            <div>
              <h1>right</h1>

            </div>
            </div>
     
    </div>
  );
};

export default HouseUpdate;
