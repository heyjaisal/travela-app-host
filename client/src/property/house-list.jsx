import PropertyCard from '@/components/Property-card'
import { useOnceEffect } from '@/hooks/useeffectOnce'
import axiosInstance from '../utils/axios-instance';
import React, { useEffect, useState } from 'react'
import { Circles } from 'react-loader-spinner'

function Propertylist() {
    const [Property, setProperty] = useState([])
      const [loading, setLoading] = useState(false);

    useOnceEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const { data } =await axiosInstance.get('/listing/all-items', { 
                    params: { type: 'property' }, 
                    withCredentials: true 
                  });
                  
                setProperty(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }finally {
                setLoading(false);
              }
            
        }
        fetchProperty();
    })

    const handleDelete = (id) => {
        setProperty((prevProperties) => prevProperties.filter((property) => property._id !== id));
    };

    if(loading){
        return(
            <div className="flex justify-center items-center h-screen">
                    <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" visible={true} />
                  </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
            {Property.map((Propertys) => (
                <PropertyCard
                    key={Propertys._id}
                    {...Propertys} 
                    images={Propertys.images || []} 
                    country={Propertys.country || "Unknown"}
                    city={Propertys.city || "Unknown"}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}

export default Propertylist;
